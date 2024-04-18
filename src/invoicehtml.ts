import HTTPError from 'http-errors';
import convert from 'xml-js';
import { getCountry } from 'iso-3166-1-alpha-2';
import { format, parse } from 'date-fns';
import cheerio from 'cheerio';
import { findValueByKeyUnderParent } from './invoice';
import fs from 'fs';
import { exec } from 'child_process';


// Your invoice type code mapping and other constants here

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
export function renderHtml(invoiceData: string, language: string, style: string): Promise<void> {
  return new Promise((resolve, reject) => {
      try {
          const jsonString = convert.xml2json(invoiceData, { compact: true, spaces: 2 });
          const data = JSON.parse(jsonString);
          const $ = cheerio.load('<html><head></head><body style="margin: 50px;"></body></html>');

          // Check if the style is any variation of 'dark', otherwise apply default style
          const isDarkMode = style.toLowerCase().includes('dark');
          $('body').css('background-color', isDarkMode ? '#222' : '#fff');
          $('body').css('color', isDarkMode ? '#fff' : '#000');

          processAccountingCustomerPartyDataHtml(data, $, language);
          processTopLevelDataHtml(data, $, language);
          processTaxTotalDataHtml(data, $, language);

          const htmlString = $.html().replace(/^<html><head><\/head><body>|<\/body><\/html>$/g, '');

          // Write the HTML string to a file
          fs.writeFile('invoice.html', htmlString, (err) => {
              if (err) {
                  console.error('Error writing HTML file:', err);
                  reject(HTTPError(500, 'Internal server error'));
              } else {
                  console.log('HTML file written successfully: invoice.html');
                  // Open the HTML file in the default web browser
                  exec('open invoice.html', (err) => {
                      if (err) {
                          console.error('Error opening HTML file in browser:', err);
                      }
                      resolve();
                  });
              }
          });
      } catch (error) {
          console.error("Error during XML parsing:", error);
          reject(HTTPError(400, 'XML file syntax is not valid'));
      }
  })
};

export function processAccountingCustomerPartyDataHtml(jsonObject: object, $: any, language: string) {
  const translations = getTranslations(language);
  $('body').append(`<h2>${translations.to}</h2>`);
  const registrationName = findValueByKeyUnderParent(jsonObject, 'cac:AccountingCustomerParty', 'cbc:Name');
  const streetName = findValueByKeyUnderParent(jsonObject, 'cac:AccountingCustomerParty', 'cbc:StreetName');
  const additionalStreetName = findValueByKeyUnderParent(jsonObject, 'cac:AccountingCustomerParty', 'cbc:AdditionalStreetName');
  const postalZone = findValueByKeyUnderParent(jsonObject, 'cac:AccountingCustomerParty', 'cbc:PostalZone');
  const cityName = findValueByKeyUnderParent(jsonObject, 'cac:AccountingCustomerParty', 'cbc:CityName');
  $('body').append(`<p>${registrationName}</p>`);
  $('body').append(`<p>${streetName}</p>`);
  $('body').append(`<p>${additionalStreetName}</p>`);
  $('body').append(`<p>${postalZone}</p>`);
  $('body').append(`<p>${cityName}</p>`);
  const countryName = getCountry(`${findValueByKeyUnderParent(jsonObject, 'cac:AccountingCustomerParty', 'cbc:IdentificationCode')}`);
  $('body').append(`<p>${countryName}</p>`);
}

// Process functions remain the same, just change the parameter to accept Cheerio instance
export function processTopLevelDataHtml(jsonObject: object, $: any, language: string) {
    const translations = getTranslations(language);
    const invoiceType = invoiceTypeCodeMapping[findValueByKeyUnderParent(jsonObject, 'cbc:InvoiceTypeCode', 'cbc:InvoiceTypeCode')].toUpperCase();
    $('body').append(`<h1>${invoiceType}</h1>`);

    processAccountingSupplierPartyDataHtml(jsonObject, $, language);

    $('body').append(`<h2>${translations.generalInformation}</h2>`);
    const issueDateValue = findValueByKeyUnderParent(jsonObject, 'cbc:IssueDate', 'cbc:IssueDate');
    const issueDate = issueDateValue ? format(parse(issueDateValue, 'yyyy-MM-dd', new Date()), 'MMMM dd, yyyy') : '';
    const dueDateValue = findValueByKeyUnderParent(jsonObject, 'cbc:DueDate', 'cbc:DueDate');
    const dueDate = dueDateValue ? format(parse(dueDateValue, 'yyyy-MM-dd', new Date()), 'MMMM dd, yyyy') : '';
    const invoiceNumber = findValueByKeyUnderParent(jsonObject, 'cbc:ID', 'cbc:ID');
    $('body').append(`<p>${translations.invoiceIssueDate} ${issueDate}</p>`);
    $('body').append(`<p>${translations.invoiceDueDate} ${dueDate}</p>`);
    $('body').append(`<p>${translations.invoiceNumber} ${invoiceNumber}</p>`);
    processPaymentMeansDataHtml(jsonObject, $, language);

    $('body').append(`<p>${translations.paymentTerms} ${findValueByKeyUnderParent(jsonObject, 'cbc:PaymentTerms', 'cbc:Note')}</p>`);
}

export function processAccountingSupplierPartyDataHtml(jsonObject: object, $: any, language: string) {
  const translations = getTranslations(language);
  $('body').append(`<h2>${translations.from}</h2>`);
  $('body').append(`<p>${findValueByKeyUnderParent(jsonObject, 'cac:AccountingSupplierParty', 'cbc:RegistrationName')}</p>`);
  $('body').append(`<p>${findValueByKeyUnderParent(jsonObject, 'cac:AccountingSupplierParty', 'cbc:StreetName')}</p>`);
  $('body').append(`<p>${findValueByKeyUnderParent(jsonObject, 'cac:AccountingSupplierParty', 'cbc:PostalZone')}</p>`);
  $('body').append(`<p>${findValueByKeyUnderParent(jsonObject, 'cac:AccountingSupplierParty', 'cbc:CityName')}</p>`);
  const countryName = getCountry(`${findValueByKeyUnderParent(jsonObject, 'cac:AccountingSupplierParty', 'cbc:IdentificationCode')}`);
  $('body').append(`<p>${countryName}</p>`);
  $('body').append(`<p>${translations.companyID} ${findValueByKeyUnderParent(jsonObject, 'cac:AccountingSupplierParty', 'cbc:CompanyID')}</p>`);
}

export function processPaymentMeansDataHtml(jsonObject: object, $: any, language: string) {
  const translations = getTranslations(language);
  $('body').append(`<p>${translations.paymentMeansCode} ${findValueByKeyUnderParent(jsonObject, 'cbc:PaymentMeansCode', 'cbc:PaymentMeansCode')}</p>`);
}

export function processTaxTotalDataHtml(jsonObject: object, $: any, language: string) {
  const translations = getTranslations(language);
  const tableData: (string | number)[][] = [
    [translations.quantity, translations.description, translations.price, translations.amount, translations.gstPercent],
    [findValueByKeyUnderParent(jsonObject, 'cac:InvoiceLine', 'cbc:InvoicedQuantity'),
      findValueByKeyUnderParent(jsonObject, 'cac:InvoiceLine', 'cbc:Name'),
      findValueByKeyUnderParent(jsonObject, 'cac:InvoiceLine', 'cbc:PriceAmount'),
      findValueByKeyUnderParent(jsonObject, 'cac:InvoiceLine', 'cbc:LineExtensionAmount'),
      findValueByKeyUnderParent(jsonObject, 'cac:InvoiceLine', 'cbc:Percent')]
  ];

  const $table = $('<table style="border-collapse: collapse;"></table>').appendTo('body');

  // Create table header row
  const $headerRow = $('<tr></tr>').appendTo($table);

  // Populate table header
  for (let i = 0; i < tableData[0].length; i++) {
    const $cell = $('<th style="padding: 10px;"></th>').appendTo($headerRow);
    $cell.text(String(tableData[0][i]));
    $cell.css('text-align', 'center'); // Center-align titles
  }

  // Create table data rows
  for (let i = 1; i < tableData.length; i++) {
    const $row = $('<tr></tr>').appendTo($table);
    for (let j = 0; j < tableData[i].length; j++) {
      const $cell = $('<td style="padding: 10px;"></td>').appendTo($row);
      $cell.text(String(tableData[i][j]));
    }
  }

  $('body').append('<div style="margin-top: 50px;"></div>');

  const totalData: (string | number)[][] = [
    [translations.total, findValueByKeyUnderParent(jsonObject, 'cac:LegalMonetaryTotal', 'cbc:TaxInclusiveAmount')],
    [translations.payableAmount, findValueByKeyUnderParent(jsonObject, 'cac:LegalMonetaryTotal', 'cbc:PayableAmount')],
  ];

  // Create total table element
  const $totalTable = $('<table style="clear:both; border-collapse: collapse;"></table>').appendTo('body');

  // Create total table header row
  const $totalHeaderRow = $('<tr></tr>').appendTo($totalTable);

  // Populate total table header
  for (let i = 0; i < totalData[0].length; i++) {
    const $cell = $('<th style="padding: 10px;"></th>').appendTo($totalHeaderRow);
    $cell.text(String(totalData[0][i]));
    $cell.css('text-align', 'center'); // Center-align titles
  }

  // Populate total data
  for (let i = 1; i < totalData.length; i++) {
    const $row = $('<tr></tr>').appendTo($totalTable);
    for (let j = 0; j < totalData[i].length; j++) {
      const $cell = $('<td style="padding: 10px;"></td>').appendTo($row);
      $cell.text(String(totalData[i][j]));
    }
  }

  // Center-align GST Summary text
  $('body').append(`<h2>${translations.gstSummary}</h2>`);

  const gstData: (string | number)[][] = [
    [translations.description, translations.amount, translations.gstPercent, translations.gst, translations.total2],
    [ findValueByKeyUnderParent(jsonObject, '', ''),
      findValueByKeyUnderParent(jsonObject, 'cac:TaxTotal', 'cbc:TaxableAmount'),
      findValueByKeyUnderParent(jsonObject, 'cac:TaxTotal', 'cbc:Percent'),
      findValueByKeyUnderParent(jsonObject, 'cac:TaxTotal', 'cbc:TaxAmount'),
      findValueByKeyUnderParent(jsonObject, 'cac:LegalMonetaryTotal', 'cbc:TaxInclusiveAmount')],
  ];

  // Create GST table element
  const $gstTable = $('<table style="clear:both; border-collapse: collapse;"></table>').appendTo('body');

  // Create GST table header row
  const $gstHeaderRow = $('<tr></tr>').appendTo($gstTable);

  // Populate GST table header
  for (let i = 0; i < gstData[0].length; i++) {
    const $cell = $('<th style="padding: 10px;"></th>').appendTo($gstHeaderRow);
    $cell.text(String(gstData[0][i]));
    $cell.css('text-align', 'center'); // Center-align titles
  }

  // Populate GST data
  for (let i = 1; i < gstData.length; i++) {
    const $row = $('<tr></tr>').appendTo($gstTable);
    for (let j = 0; j < gstData[i].length; j++) {
      const $cell = $('<td style="padding: 10px;"></td>').appendTo($row);
      $cell.text(String(gstData[i][j]));
    }
  }
}

export function getTranslations(language: string) {
  if (language.toLowerCase() === 'spanish') {
    return {
      to: 'A:',
      from: 'De:',
      generalInformation: 'Información general:',
      invoiceIssueDate: 'Fecha de emisión de la factura:',
      invoiceDueDate: 'Fecha de vencimiento de la factura:',
      invoiceNumber: 'Número de factura:',
      paymentTerms: 'Términos de pago:',
      companyID: 'ID de la empresa:',
      paymentMeansCode: 'Código de medio de pago:',
      gstSummary: 'RESUMEN DE GST',
      total: 'Total:',
      payableAmount: 'Monto a pagar:',
      description: 'Descripción',
      amount: 'Cantidad',
      gstPercent: 'Porcentaje de GST',
      gst: 'GST',
      total2: 'Total',
      price: 'Precio',
      quantity: 'Cantidad',
    };
  } else if (language.toLowerCase() === 'mandarin' || language.toLowerCase() === 'chinese') {
    return {
      to: '致：',
      from: '来自：',
      generalInformation: '一般信息：',
      invoiceIssueDate: '发票开具日期：',
      invoiceDueDate: '发票到期日期：',
      invoiceNumber: '发票号码：',
      paymentTerms: '付款条款：',
      companyID: '公司ID: ',
      paymentMeansCode: '支付方式代码：',
      gstSummary: '商品和服务税 摘要',
      total: '总计：',
      payableAmount: '应付金额：',
      description: '描述',
      amount: '数量',
      gstPercent: '商品和服务税%',
      gst: '商品和服务税',
      total2: '总计',
      quantity: '数量',
      price: '价格'
    };
  } else {
    // Return default translations or handle other languages
    return {
      to: 'TO:',
      from: 'FROM:',
      generalInformation: 'GENERAL INFORMATION:',
      invoiceIssueDate: 'Invoice Issue Date:',
      invoiceDueDate: 'Invoice Due Date:',
      invoiceNumber: 'Invoice Number:',
      paymentTerms: 'Payment Terms:',
      companyID: 'Company ID:',
      paymentMeansCode: 'Payment Means Code:',
      gstSummary: 'GST SUMMARY',
      total: 'Total:',
      payableAmount: 'Payable Amount:',
      description: 'Description',
      amount: 'Amount',
      gstPercent: 'GST%',
      gst: 'GST',
      total2: 'Total',
      price: 'Price',
      quantity: 'Quantity'
    };
  }
}
