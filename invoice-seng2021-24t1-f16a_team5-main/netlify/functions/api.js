import express from "express";
import serverless from "serverless-http";
import { getData } from '../../src/datastore';
import { writeData, readData } from '../../src/other';
import { authRegister } from '../../src/auth';
import multer from 'multer';
import HTTPError from 'http-errors';

const api = express();
const router = express.Router(); // Create an instance of the Express router

router.get("/", (req, res) => {
    res.send({ data: "Hello SENG2021!"});
})

router.get("/slow", (req, res) => {
    const { delay } = req.query;

    setTimeout(
        () =>
            res.send({
                data: `Hello SENG2021! message delayed by ${delay} seconds`,
            }),
        delay * 1000,
    );
});

router.post("/auth/register", (req, res) => {
    readData();
    const currData = getData();
    const jsonData = JSON.parse(req.body);
    const email = jsonData.email;
    const password = jsonData.password;
    const nameFirst = jsonData.nameFirst;
    const nameLast = jsonData.nameLast;
    const { token, authUserId, error } = authRegister(email, password, nameFirst, nameLast);

    if (token !== null && token !== undefined && token !== 'undefined') {
        writeData(currData);
        res.json({
            token: token,
            authUserId: authUserId,
        });
    } else {
        throw HTTPError(400, 'Register error');
    }
});

router.post('/auth/login', (req, res) => {
    readData();
    const currData = getData();
    let jsonData = JSON.parse(req.body);
    const email = jsonData.email;
    const password  = jsonData.password;
    const { authUserId, error, token } = authLogin(email, password);
    if (error === 'error') {
        throw HTTPError(400, 'Login error');
    }
    if (token !== null && token !== undefined && token !== 'undefined') {
        writeData(currData);
        res.json({
            token: token,
            authUserId: authUserId,
        });
    } else {
        throw HTTPError(400, 'Login error');
    }
});

router.post('/invoice/render/html', multer().single('xmlFile'), async (req, res) => {
    const token = req.header('token');
    const jsonData = JSON.parse(req.body);
    const language = jsonData.language;
    const style = jsonData.style;
  
    try {
        if (getData().users.some(user => user.token === undefined)) {
            throw HTTPError(403, 'Token is invalid');
        } else if (!req.file) {
            throw HTTPError(400, 'No file uploaded');
            // Default to English for now
        } else if (language && language.toLowerCase() !== 'english' 
            && language.toLowerCase() !== 'spanish' 
            && language.toLowerCase() !== 'mandarin' 
            && language.toLowerCase() !== 'chinese') {
            throw HTTPError(400, 'Unsupported language');
            // Default to light for now
        } else if (style && style.toLowerCase() !== 'light' && style.toLowerCase() !== 'dark') {
            throw HTTPError(400, 'Unsupported style');
        }
  
        const invoiceData = req.file.buffer.toString();
        const result = await renderHtml(invoiceData, language, style);
  
        res.contentType('application/pdf');
        // For downloading the PDF file
        const filename = req.file.originalname.replace(/\.[^.]*$/, '');
        res.setHeader('content-disposition', `attachment; filename="${filename}"`);
        res.send(result);
    } catch (error) {
        res.status(error.status).json({ error: error.message });
    }
});
  
router.post('/invoice/render/pdf', multer().single('xmlFile'), async (req, res) => {
    const token = req.header('token');
    const { language, style } = req.body;
  
    try {
        if (getData().users.some(user => user.token === undefined)) {
            throw HTTPError(403, 'Token is invalid');
        } else if (!req.file) {
            throw HTTPError(400, 'No file uploaded');
            // Default to English for now
        } else if (language && language.toLowerCase() !== 'english') {
            throw HTTPError(400, 'Unsupported language');
            // Default to light for now
        } else if (style && style.toLowerCase() !== 'light') {
            throw HTTPError(400, 'Unsupported style');
        }
  
        const invoiceData = req.file.buffer.toString();
        const result = await renderPdf(invoiceData, language, style);
  
        res.contentType('application/pdf');
        // For downloading the PDF file
        const filename = req.file.originalname.replace(/\.[^.]*$/, '');
        res.setHeader('content-disposition', `attachment; filename="${filename}"`);
        res.send(result);
    } catch (error) {
        res.status(error.status).json({ error: error.message });
    }
});
  

api.use("/api", router); // Use the router middleware

export const handler = serverless(api);
