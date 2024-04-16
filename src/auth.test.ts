import { resetData, clear, readData } from './other';
import request from 'sync-request';
import config from './config.json';

const port = config.port;
const url = config.url;

const postreq = (path: string, qs: Record<string, any>, token = 'no input') => {
  const urlString = `${url}:${port}/${path}`;
  if (token === 'no input') {
    const res = request('POST', urlString,
      {
        body: JSON.stringify(qs),
        headers: {
          'Content-type': 'application/json'
        }
      });
    return res;
  } else {
    const res = request('POST', urlString,
      {
        body: JSON.stringify(qs),
        headers: {
          'Content-type': 'application/json',
          token: token
        }
      });
    return res;
  }
};

const OK = 200;
const outcomes = {
  pass: { authUserId: expect.any(Number) },
  fail: { error: 'error' },
  token: { token: expect.any(String), authUserId: expect.any(Number) },
  filled: expect.arrayContaining([expect.any(String)]),
  empty: expect.not.arrayContaining([expect.any(String)])
};

const statuses = { pass: OK, badreq: 400, unauth: 403 };
readData();
const registerTestList = [
  {
    testName: 'Register first user',
    email: 'jackvanroy@unsw.edu.au',
    password: 'ThisIsAGoodPassword1',
    nameFirst: 'Jack',
    nameLast: 'vanRoy',
    expected: outcomes.token,
    status: statuses.pass
  },

  {
    testName: 'Register same user',
    email: 'jackvanroy@unsw.edu.au',
    password: 'ThisIsAGoodPassword1',
    nameFirst: 'Jack',
    nameLast: 'vanRoy',
    expected: outcomes.fail,
    status: statuses.badreq
  },

  {
    testName: 'Register another user',
    email: 'jack@unsw.edu.au',
    password: 'ThisIsAGoodPassword1',
    nameFirst: 'vanRoy',
    nameLast: 'Jack',
    expected: outcomes.token,
    status: statuses.pass
  },

  {
    testName: 'Registering same first and last name',
    email: 'jack1@unsw.edu.au',
    password: 'ThisIsAGoodPassword1',
    nameFirst: 'Jack',
    nameLast: 'vanRoy',
    expected: outcomes.token,
    status: statuses.pass
  },

  {
    testName: 'Registering another user with same first and last name',
    email: 'jack2@unsw.edu.au',
    password: 'ThisIsAGoodPassword1',
    nameFirst: 'Jack',
    nameLast: 'vanRoy',
    expected: outcomes.token,
    status: statuses.pass
  },

  {
    testName: 'Invalid email',
    email: 'test',
    password: 'ThisIsAGoodPassword1',
    nameFirst: 'John',
    nameLast: 'Jones',
    expected: outcomes.fail,
    status: statuses.badreq
  },

  {
    testName: 'Invalid password',
    email: 'test@example.com',
    password: 'badpw',
    nameFirst: 'John',
    nameLast: 'Jones',
    expected: outcomes.fail,
    status: statuses.badreq
  },

  {
    testName: 'Long first name',
    email: 'john@unsw.edu.au',
    password: 'ThisIsAGoodPassword1',
    nameFirst: 'ThisIsAReallyLoonnngnnnnnnnnnnnnnnnnnnnnnnnnnngggFirstName',
    nameLast: 'Jones',
    expected: outcomes.fail,
    status: statuses.badreq
  },

  {
    testName: 'Long last name',
    email: 'john1@unsw.edu.au',
    password: 'ThisIsAGoodPassword1',
    nameFirst: 'John',
    nameLast: 'ThisIsAReallyLooonggnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnggnLastName',
    expected: outcomes.fail,
    status: statuses.badreq
  },

  {
    testName: 'No first name',
    email: 'john@unsw.edu.au',
    password: 'ThisIsAGoodPassword1',
    nameFirst: '',
    nameLast: 'Wicke',
    expected: outcomes.fail,
    status: statuses.badreq
  },

  {
    testName: 'No last name',
    email: 'john1@unsw.edu.au',
    password: 'ThisIsAGoodPassword1',
    nameFirst: 'John',
    nameLast: '',
    expected: outcomes.fail,
    status: statuses.badreq
  }
];

const loginTestList = [
  {
    testName: 'Correct email and password',
    email: 'jackvanroy@unsw.edu.au',
    password: 'ThisIsAGoodPassword1',
    expected: outcomes.pass,
    status: statuses.pass
  },

  {
    testName: 'Incorrect email but correct password',
    email: 'brya@unsw.edu.au',
    password: 'ThisIsAGoodPassword1',
    expected: outcomes.fail,
    status: statuses.badreq
  },

  {
    testName: 'Correct email but incorrect password',
    email: 'jackvanroy@unsw.edu.au',
    password: 'ThisIsAGoodPassword',
    expected: outcomes.fail,
    status: statuses.badreq

  },

  {
    testName: 'Invalid email',
    email: 'bryan',
    password: 'ThisIsAGoodPassword1',
    expected: outcomes.fail,
    status: statuses.badreq

  },

  {
    testName: 'No email and password',
    email: '',
    password: '',
    expected: outcomes.fail,
    status: statuses.badreq

  },

  {
    testName: 'Correct email but no password',
    email: 'jackvanroy@unsw.edu.au',
    password: '',
    expected: outcomes.fail,
    status: statuses.badreq

  },

  {
    testName: 'No email but correct password',
    email: '',
    password: 'ThisIsAGoodPassword1',
    expected: outcomes.fail,
    status: statuses.badreq
  }
];

describe('HTTP Tests for authRegister', () => {
  resetData();
  clear();
  for (let i = 0; i < registerTestList.length; i++) {
    const field = registerTestList[i];
    test(field.testName, () => {
      const query = postreq('auth/register',
        {
          email: field.email,
          password: field.password,
          nameFirst: field.nameFirst,
          nameLast: field.nameLast
        });
      expect(query.statusCode).toBe(field.status);
      if (field.status === OK) {
        const bodyObj = JSON.parse(String(query.getBody()));
        expect(bodyObj).toEqual(expect.objectContaining(field.expected));
      }
    });
  }
});

describe('Tests for authLogin', () => {
  for (let i = 0; i < loginTestList.length; i++) {
    const field = loginTestList[i];
    test(field.testName, () => {
      const query = postreq('auth/login',
        { email: field.email, password: field.password });
      expect(query.statusCode).toBe(field.status);
      if (field.status === OK) {
        const bodyObj = JSON.parse(String(query.getBody()));
        expect(bodyObj).toEqual(expect.objectContaining(field.expected));
      }
    });
  }
});
