import { sendWrapRequest } from './testWrapper';
import fs from 'fs';
import path from 'path';
// import pdfParse from 'pdf-parse';

const validXml = fs.readFileSync(path.join(__dirname, 'example1.xml'), 'utf-8');
const malformedXml = fs.readFileSync(path.join(__dirname, 'example2.xml'), 'utf-8');

const user1 = sendWrapRequest('POST', '/auth/register', {},
  { email: 'personone@email.com', password: 'passwordone', nameFirst: 'Person', nameLast: 'One' });

describe('Basic XML input validation test', () => {
  test('Malformed invoice data input', () => {
    const pdfResult = sendWrapRequest('POST', '/invoice/render/pdf', { token: user1.token }, { xmlFile: malformedXml, language: 'English', style: 'Light' });
    expect(pdfResult).toStrictEqual(400);

    const jsonResult = sendWrapRequest('POST', '/invoice/render/json', { token: user1.token }, { xmlFile: malformedXml, language: 'English', style: 'Light' });
    expect(jsonResult).toStrictEqual(400);
  });
});

// describe('PDF output content tests' () => {
//   const result = sendWrapRequest('POST', '/invoice/render/pdf', { token: user1.token }, { invoiceData: validXml, language: 'English', style: 'Light' });
//   pdfParse(result).then(function (data) {
//     const pdfText = data.text;
//     test('Does the PDF have Top Level data', async () => {
//       expect(pdfText.includes('February 07, 2022')).toBeTruthy();
//       expect(pdfText.includes('EBWASP1002')).toBeTruthy();
//       expect(pdfText.includes('1')).toBeTruthy();
//       expect(pdfText.includes('As agreed')).toBeTruthy();
//     });
//     test('Does the PDF have Accounting Supplier Party data', async () => {
//       expect(pdfText.includes('Ebusiness Software Services Pty Ltd')).toBeTruthy();
//       expect(pdfText.includes('100 Business St')).toBeTruthy();
//       expect(pdfText.includes('2203')).toBeTruthy();
//       expect(pdfText.includes('Dulwich Hill')).toBeTruthy();
//       expect(pdfText.includes('Australia')).toBeTruthy();
//       expect(pdfText.includes('80647710156')).toBeTruthy();
//     });
//     test('Does the PDF have Accounting Customer Party data', async () => {
//       expect(pdfText.includes('Awolako Enterprises Pty Ltd')).toBeTruthy();
//       expect(pdfText.includes('Suite 123 Level 45')).toBeTruthy();
//       expect(pdfText.includes('999 The Crescent')).toBeTruthy();
//       expect(pdfText.includes('2140')).toBeTruthy();
//       expect(pdfText.includes('Homebush West')).toBeTruthy();
//     });
//     test('Does the PDF have Tax Total data', async () => {
//       expect(pdfText.includes('10.00')).toBeTruthy();
//       expect(pdfText.includes('100.00')).toBeTruthy();
//       expect(pdfText.includes('110.00')).toBeTruthy();
//       expect(pdfText.includes('GST')).toBeTruthy();
//     });
//     test('Does the PDF have Invoice Line data', async () => {
//       expect(pdfText.includes('500.0')).toBeTruthy();
//       expect(pdfText.includes('pencils')).toBeTruthy();
//       expect(pdfText.includes('0.20')).toBeTruthy();
//     });
//   }).catch(function (error) {
//     console.error(error);
//   });
// });

// describe('JSON output content tests', () => {
//   const result = sendWrapRequest('POST', '/invoice/render/json', { token: user1.token }, { xmlFile: validXml, language: 'English', style: 'Light' });
//   test('Does the PDF have Top Level data', () => {
//     expect(result.includes('February 07, 2022')).toBeTruthy();
//     expect(result.includes('EBWASP1002')).toBeTruthy();
//     expect(result.includes('1')).toBeTruthy();
//     expect(result.includes('As agreed')).toBeTruthy();
//   });
//   test('Does the PDF have Accounting Supplier Party data', () => {
//     expect(result.includes('Ebusiness Software Services Pty Ltd')).toBeTruthy();
//     expect(result.includes('100 Business St')).toBeTruthy();
//     expect(result.includes('2203')).toBeTruthy();
//     expect(result.includes('Dulwich Hill')).toBeTruthy();
//     expect(result.includes('Australia')).toBeTruthy();
//     expect(result.includes('80647710156')).toBeTruthy();
//   });
//   test('Does the PDF have Accounting Customer Party data', async () => {
//     expect(result.includes('Awolako Enterprises Pty Ltd')).toBeTruthy();
//     expect(result.includes('Suite 123 Level 45')).toBeTruthy();
//     expect(result.includes('999 The Crescent')).toBeTruthy();
//     expect(result.includes('2140')).toBeTruthy();
//     expect(result.includes('Homebush West')).toBeTruthy();
//   });
//   test('Does the PDF have Tax Total data', async () => {
//     expect(result.includes('10.00')).toBeTruthy();
//     expect(result.includes('100.00')).toBeTruthy();
//     expect(result.includes('110.00')).toBeTruthy();
//     expect(result.includes('GST')).toBeTruthy();
//   });
//   test('Does the PDF have Invoice Line data', async () => {
//     expect(result.includes('500.0')).toBeTruthy();
//     expect(result.includes('pencils')).toBeTruthy();
//     expect(result.includes('0.20')).toBeTruthy();
//   });
// });
