import { getData, setData } from './datastore';
import fs from 'fs';
import config from './config.json';
import crypto from 'crypto';
const dataFile = 'src/data.json';
const defaultData = 'src/default.json';

const SECRET = 's3cr3t';
function getSecret() {
  return SECRET;
}

function writeData(jsonData: Record<string, any>) {
  fs.writeFileSync(dataFile, JSON.stringify(jsonData), { flag: 'w' });
  setData((jsonData));
}

function readData () {
  const storeData = fs.readFileSync(dataFile, { flag: 'r' });
  try {
    setData(JSON.parse(String(storeData)));
  } catch {
    console.log('Failed to parse:', storeData, String(storeData));
  }
}

function resetData () {
  const storeData = fs.readFileSync(defaultData, { flag: 'r' });
  setData(JSON.parse(String(storeData)));
  fs.writeFileSync(dataFile, JSON.stringify(getData()), { flag: 'w' });
  // fs.writeFileSync(testdata, JSON.stringify(getData()), { flag: 'w' });
}

function getHashOf(text: string) {
  return crypto.createHash('sha256').update(text + SECRET).digest('hex');
}

const port = config.port;
const url = config.url;


function clear() {
  const data = getData();
  data.users.length = 0;
  data.users = [];
  writeData(data);
  setData(data);
  return {};
}

export { getHashOf, getSecret, writeData, readData, resetData, clear };
