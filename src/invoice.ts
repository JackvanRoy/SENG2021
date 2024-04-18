/*import HTTPError from 'http-errors';
import convert from 'xml-js';
import PDFDocument from 'pdfkit';
import { getCountry } from 'iso-3166-1-alpha-2';
import { format, parse } from 'date-fns';

const invoiceTypeCodeMapping = {
  71: 'Request for payment',
  80: 'Debit note related to goods or services',
  82: 'Metered services invoice',
  84: 'Debit note related to financial adjustments',
  102: 'Tax notification',
  218: 'Final payment request based on completion of work',
  219: 'Payment request for completed units',
  331: 'Commercial invoice which includes a packing list',
  380: 'Commercial invoice',
  382: 'Commission note',
  383: 'Debit note',
  386: 'Prepayment invoice',
  388: 'Tax invoice',
  393: 'Factored invoice',
  395: 'Consignment invoice',
  553: "Forwarder's invoice discrepancy report",
  575: "Insurer's invoice",
  623: "Forwarder's invoice",
  780: 'Freight invoice',
  817: 'Claim notification',
  870: 'Consular invoice',
  875: 'Partial construction invoice',
  876: 'Partial final construction invoice',
  877: 'Final construction invoice'
};

// const taxCodeMapping = {
//   AE: 'Vat Reverse Charge',
//   E: 'Exempt from Tax',
//   S: 'Standard rate',
//   Z: 'Zero rated goods',
//   G: 'Free export item, VAT not charged',
//   O: 'Services outside scope of tax',
//   K: 'VAT exempt for EEA intra-community supply of goods and services',
//   L: 'Canary Islands general indirect tax',
//   M: 'Tax for production, services and importation in Ceuta and Melilla',
//   B: 'Transferred (VAT), In Italy'
// };

export function renderPdf(invoiceData: string, language: string, style: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Parse XML string into JSON object
      const jsonString = convert.xml2json(invoiceData, { compact: true, spaces: 2 });
      const data = JSON.parse(jsonString);

      // Create a new PDF document
      const doc = new PDFDocument();

      // Push data onto buffers
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));

      // Add contents from JSON to PDF
      processAccountingCustomerPartyData(data, doc);
      processTopLevelData(data, doc);
      processTaxTotalData(data, doc);

      // Combine all buffers
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      doc.end();
    } catch (error) {
      reject(HTTPError(400, 'XML file syntax is not valid'));
    }
  });
}

export function renderJson(invoiceData: string, language: string, style: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Parse XML string into JSON object
      const jsonString = convert.xml2json(invoiceData, { compact: true, spaces: 2 });
      //   const data = JSON.parse(jsonString);

      resolve(jsonString);
    } catch (error) {
      reject(HTTPError(400, 'XML file syntax is not valid'));
    }
  });
}


export function findValueByKeyUnderParent(obj: any, parentKey: string, targetKey: string): any {
  if (obj && typeof obj === 'object') {
    // Check if the current object contains the target key directly
    if (Object.prototype.hasOwnProperty.call(obj, targetKey)) {
      return obj[targetKey]._text !== undefined ? obj[targetKey]._text : obj[targetKey];
    }
    // Check if the parent key exists and is an object
    if (obj[parentKey] && typeof obj[parentKey] === 'object') {
      // Recursively search through nested objects under the parent key
      const result = findValueByKeyUnderParent(obj[parentKey], parentKey, targetKey);
      if (result !== '') {
        return result;
      }
    }
    // Recursively search through all properties of the object
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // Avoid searching the parentKey itself
        if (key !== parentKey) {
          const result = findValueByKeyUnderParent(obj[key], parentKey, targetKey);
          if (result !== '') {
            return result;
          }
        }
      }
    }
  }
  // Return null if the target key is not found
  return '';
}

export function processTopLevelData(jsonObject: object, doc: any) {
  const invoiceType = invoiceTypeCodeMapping[`${findValueByKeyUnderParent(jsonObject, 'cbc:InvoiceTypeCode', 'cbc:InvoiceTypeCode')}`].toUpperCase();
  doc.font('Helvetica-Bold').fontSize(20).text(`${invoiceType}`).moveDown(0.5);

  processAccountingSupplierPartyData(jsonObject, doc);

  doc.font('Helvetica-Bold').fontSize(14).text('GENERAL INFORMATION:').moveDown(0.2);

  // Maybe can format this in a table later
  const issueDateValue = findValueByKeyUnderParent(jsonObject, 'cbc:IssueDate', 'cbc:IssueDate');
  const issueDate = issueDateValue ? format(parse(issueDateValue, 'yyyy-MM-dd', new Date()), 'MMMM dd, yyyy') : '';
  const dueDateValue = findValueByKeyUnderParent(jsonObject, 'cbc:DueDate', 'cbc:DueDate');
  const dueDate = dueDateValue ? format(parse(dueDateValue, 'yyyy-MM-dd', new Date()), 'MMMM dd, yyyy') : '';
  const invoiceNumber = `${findValueByKeyUnderParent(jsonObject, 'cbc:ID', 'cbc:ID')}`;
  doc.font('Helvetica').fontSize(10).text(`Invoice Issue Date: ${issueDate}`).moveDown(0.2);
  doc.text(`Invoice Due Date: ${dueDate}`).moveDown(0.2);
  doc.text(`Invoice Number: ${invoiceNumber}`).moveDown(0.2);

  processPaymentMeansData(jsonObject, doc);

  doc.text(`Payment Terms: ${findValueByKeyUnderParent(jsonObject, 'cbc:PaymentTerms', 'cbc:Note')}`).moveDown(1.5);
}

export function processAccountingSupplierPartyData(jsonObject: object, doc: any) {
  doc.font('Helvetica-Bold').fontSize(14).text('FROM:').moveDown(0.2);
  doc.font('Helvetica');
  doc.fontSize(10).text(`${findValueByKeyUnderParent(jsonObject, 'cac:AccountingSupplierParty', 'cbc:RegistrationName')}`).moveDown(0.2);
  doc.text(`${findValueByKeyUnderParent(jsonObject, 'cac:AccountingSupplierParty', 'cbc:StreetName')}`).moveDown(0.2);
  doc.text(`${findValueByKeyUnderParent(jsonObject, 'cac:AccountingSupplierParty', 'cbc:PostalZone')}`).moveDown(0.2);
  doc.text(`${findValueByKeyUnderParent(jsonObject, 'cac:AccountingSupplierParty', 'cbc:CityName')}`).moveDown(0.2);
  const countryName = getCountry(`${findValueByKeyUnderParent(jsonObject, 'cac:AccountingSupplierParty', 'cbc:IdentificationCode')}`);
  doc.text(`${countryName}`).moveDown(0.2);
  doc.text(`Company ID: ${findValueByKeyUnderParent(jsonObject, 'cac:AccountingSupplierParty', 'cbc:CompanyID')}`).moveDown(1.5);
}

export function processAccountingCustomerPartyData(jsonObject: object, doc: any) {
  doc.font('Helvetica-Bold').fontSize(14).text('TO:').moveDown(0.2);
  doc.font('Helvetica');
  doc.fontSize(10).text(`${findValueByKeyUnderParent(jsonObject, 'cac:AccountingCustomerParty', 'cbc:RegistrationName')}`).moveDown(0.2);
  doc.text(`${findValueByKeyUnderParent(jsonObject, 'cac:AccountingCustomerParty', 'cbc:StreetName')}`).moveDown(0.2);
  doc.text(`${findValueByKeyUnderParent(jsonObject, 'cac:AccountingCustomerParty', 'cbc:AdditionalStreetName')}`).moveDown(0.2);
  doc.text(`${findValueByKeyUnderParent(jsonObject, 'cac:AccountingCustomerParty', 'cbc:PostalZone')}`).moveDown(0.2);
  doc.text(`${findValueByKeyUnderParent(jsonObject, 'cac:AccountingCustomerParty', 'cbc:CityName')}`).moveDown(0.2);
  const countryName = getCountry(`${findValueByKeyUnderParent(jsonObject, 'cac:AccountingCustomerParty', 'cbc:IdentificationCode')}`);
  doc.text(`${countryName}`).moveDown(4);
}

export function processPaymentMeansData(jsonObject: object, doc: any) {
  doc.text(`Payment Means Code: ${findValueByKeyUnderParent(jsonObject, 'cbc:PaymentMeansCode', 'cbc:PaymentMeansCode')}`).moveDown(0.2);
}

export function processTaxTotalData(jsonObject: object, doc: any) {
  const data: (string | number)[][] = [
    ['Quantity', 'Code', 'Account', 'Description', 'Price', 'Amount', 'GST%', 'Total'],
    [findValueByKeyUnderParent(jsonObject, 'cac:InvoiceLine', 'cbc:InvoicedQuantity'),
      '',
      '',
    findValueByKeyUnderParent(jsonObject, 'cac:InvoiceLine', 'cbc:Name'),
    findValueByKeyUnderParent(jsonObject, 'cac:InvoiceLine', 'cbc:PriceAmount'),
    findValueByKeyUnderParent(jsonObject, 'cac:InvoiceLine', 'cbc:LineExtensionAmount'),
    findValueByKeyUnderParent(jsonObject, 'cac:InvoiceLine', 'cbc:Percent'),
      ''],
  ];
  const table = {
    x: 60, // Starting position of the table on the x-axis
    y: 500, // Starting position of the table on the y-axis
    w: 500, // Width of the table
    h: 30, // Height of the table
    cellMargin: 0 // Margin within each cell
  };

  // Calculate the width of each column
  const colWidth = table.w / data[0].length;

  // Iterate through the data to populate the table
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      // Calculate the position of the current cell
      const xPos = table.x + j * colWidth;
      const yPos = table.y + i * table.cellMargin + i * 20; // Adjust vertical spacing

      // Draw the cell with the data
      doc.text(String(data[i][j]), xPos, yPos, { width: colWidth, align: 'center' });
    }
  }
  const totalTable = {
    x: 350,
    y: 550,
    w: 200,
    h: 30,
    cellMargin: 0
  };
  const totalData: (string | number)[][] = [
    ['Total:', findValueByKeyUnderParent(jsonObject, 'cac:LegalMonetaryTotal', 'cbc:TaxInclusiveAmount')],
    ['Payable Amount:', findValueByKeyUnderParent(jsonObject, 'cac:LegalMonetaryTotal', 'cbc:PayableAmount')],
  ];
  const colTotalWidth = totalTable.w / totalData[0].length;

  for (let i = 0; i < totalData.length; i++) {
    for (let j = 0; j < totalData[i].length; j++) {
      // Calculate the position of the current cell
      const xPos = totalTable.x + j * colTotalWidth;
      const yPos = totalTable.y + i * totalTable.cellMargin + i * 20; // Adjust vertical spacing

      // Draw the cell with the data
      doc.text(String(totalData[i][j]), xPos, yPos, { width: colTotalWidth, align: 'center' });
    }
  }

  const pageWidth = doc.page.width;

  // Calculate the x position to center the text
  const xPos = (pageWidth) / 2.75;

  // Draw the "GST SUMMARY" text
  doc.font('Helvetica-Bold').fontSize(14).text('GST SUMMARY', xPos, doc.y + 20);
  doc.font('Helvetica').fontSize(10);

  const gstData: (string | number)[][] = [
    ['Description', '', '', 'Amount', 'GST%', 'GST', 'Total'],
    ['',
      '',
      '',
      findValueByKeyUnderParent(jsonObject, 'cac:TaxTotal', 'cbc:TaxableAmount'),
      findValueByKeyUnderParent(jsonObject, 'cac:TaxTotal', 'cbc:Percent'),
      findValueByKeyUnderParent(jsonObject, 'cac:TaxTotal', 'cbc:TaxAmount'),
      findValueByKeyUnderParent(jsonObject, 'cac:LegalMonetaryTotal', 'cbc:TaxInclusiveAmount')],
  ];
  const gstTable = {
    x: 60, // Starting position of the table on the x-axis
    y: 630, // Starting position of the table on the y-axis
    w: 500, // Width of the table
    h: 30, // Height of the table
    cellMargin: 0 // Margin within each cell
  };

  // Calculate the width of each column
  const gstColWidth = gstTable.w / gstData[0].length;

  // Iterate through the data to populate the table
  for (let i = 0; i < gstData.length; i++) {
    for (let j = 0; j < gstData[i].length; j++) {
      // Calculate the position of the current cell
      const xPos = gstTable.x + j * gstColWidth;
      const yPos = gstTable.y + i * gstTable.cellMargin + i * 20; // Adjust vertical spacing

      // Draw the cell with the data
      doc.text(String(gstData[i][j]), xPos, yPos, { width: gstColWidth, align: 'center' });
    }
  }
}
*/