import request, { HttpVerb } from 'sync-request';
import { port, url } from './config.json';

const SERVER_URL = `${url}:${port}`;

/**
 * A function to clear up testing in test files by wrappng around sync-requests
 * @param method - GET/DELETE/POST/PUT
 * @param endpoint - endpoint (/route/name)
 * @param data - any data input, can be {} (empty)
 * @returns {object} - JSON data returned
 */

type tokenHeader = {
    token?: string
};

export const sendWrapRequest = (method: HttpVerb, endpoint: string, token: tokenHeader, data: object) => {
  if (!endpoint.startsWith('/')) {
    return { error: 'Missing leading slash on endpoint' };
  }

  const res = request(
    method,
    SERVER_URL + endpoint,
    {
      headers: ['GET', 'DELETE', 'PUT', 'POST'].includes(method) ? token : {},
      qs: ['GET', 'DELETE'].includes(method) ? data : {},
      json: ['PUT', 'POST'].includes(method) ? data : {},
    }
  );

  // Gives errors if we don't recieve an object
  if (res.statusCode !== 200) {
    return res.statusCode;
  }

  return JSON.parse(res.getBody() as string);
};
