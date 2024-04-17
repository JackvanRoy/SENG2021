import express, { json, Request, Response } from 'express';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import { renderJson, renderPdf } from './invoice';
import { renderHtml } from './invoicehtml';
import multer from 'multer';
import HTTPError from 'http-errors';
import { getData } from './datastore';
import { authLogin, authRegister } from './auth';
import { writeData, readData } from './other';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// For logging errors (print to terminal)
app.use(morgan('dev'));

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || '0.0.0.0';

// Start server
const server = app.listen(PORT, HOST, () => {
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

// Serve the public directory with index.html
app.use(express.static(__dirname + '/public'));

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});

app.post('/invoice/render/pdf', multer().single('xmlFile'), async (req: Request, res: Response) => {
    const { language, style } = req.body;

  try {
    // token stuff still dodgy
    if (getData().users.some(user => user.token === undefined)) {
      throw HTTPError(403, 'Token is invalid');
    }

    const invoiceData = req.file.buffer.toString();
    const result = await renderPdf(invoiceData, language, style);

    res.send(result);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
  }
});

app.post('/invoice/render/json', multer().single('xmlFile'), async (req: Request, res: Response) => {
    const { language, style } = req.body;

  try {
    // token stuff still dodgy
    if (getData().users.some(user => user.token === undefined)) {
      throw HTTPError(403, 'Token is invalid');
    }

    const invoiceData = req.file.buffer.toString();
    const result = await renderJson(invoiceData, language, style);

    res.send(result);
  } catch (error) {
    res.status(error.status).json({ error: error.message });
  }
});


app.post('/invoice/render/html', multer().single('xmlFile'), async (req: Request, res: Response) => {
  const token = req.header('token');
  const { language, style } = req.body;

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


app.post('/auth/register', (req, res) => {
  readData();
  const currData = getData();
  const { email, password, nameFirst, nameLast } = req.body;
  const { token, authUserId, error } = authRegister(email, password, nameFirst, nameLast);
  if (error === 'error') {
    throw HTTPError(400, 'Register error');
  }

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

app.post('/auth/login', (req, res) => {
  readData();
  const currData = getData();
  const { email, password } = req.body;
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

app.use(errorHandler());
