import { getData, setData } from './datastore';
import validator from 'validator';
import { getHashOf, getSecret } from './other';

export function authLogin(email: string, password: string) {
  const data: any = getData();
  const users: any = data.users;
  let userToken = 'default';
  // Check if email is a valid email
  if (!validator.isEmail(email)) {
    return { error: 'error' };
  }
    interface userDetails {
        authUserId: number;
        token: string;
        email: string;
        password: string;
        nameFirst: string;
        nameLast: string;
    }

    // Check email and password against user database
    const userExists = users.filter(function (u: userDetails) {
      if (u.email === email && u.password === getHashOf(password + getSecret())) {
        return true;
      }
      return false;
    });
    if (userExists[0] === null || userExists[0] === undefined) {
      return { error: 'error' };
    }
    userToken = userExists[0].token;
    return {
      token: userToken,
      authUserId: userExists[0].authUserId
    };
}

export function authRegister(email: string,
  password: string, nameFirst: string,
  nameLast: string) {
  const data: any = getData();
  const users: any = data.users;
  let userToken = 'default';
  // Check if email is a valid email
  if (!validator.isEmail(email)) {
    return {
      error: 'error',
    };
  }
    interface userDetails {
        authUserId: number;
        token: string;
        email: string;
        password: string;
        nameFirst: string;
        nameLast: string;
    }
    // Check if user already exists in the database
    const userExists = users.filter(function (u: userDetails) {
      if (u.email === email) {
        return u;
      } else {
        return null;
      }
    });
    if (userExists[0] != null) {
      return { error: 'error' };
    }
    // Check if password is less than 6 characters
    if (password.length < 6) {
      return { error: 'error' };
    }
    // Check if names are the appropriate length
    if (nameFirst.length < 1 || nameFirst.length > 30 ||
      nameLast.length < 1 || nameLast.length > 30) {
      return { error: 'error' };
    }

    // Generate new authUserId
    let authUserId = 1000;
    if (users.length > 0) {
      authUserId = users[users.length - 1].authUserId + 1; // Get last user ID and add 1 to it
    }
    // Creates a random string
    const token = `${Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6)}`;
    // attaches the random string to the authUserId to make a custom usertoken
    userToken = `${authUserId}-${token}`;
    // Add user to database
    users.push({
      authUserId: authUserId,
      token: userToken,
      nameFirst: nameFirst,
      nameLast: nameLast,
      email: email,
      password: getHashOf(password + getSecret()),
    });

    // Update database
    setData(data);
    return {
      authUserId: authUserId,
      token: userToken
    };
}

