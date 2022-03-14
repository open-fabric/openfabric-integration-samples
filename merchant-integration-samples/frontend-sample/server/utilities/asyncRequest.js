import request from "request";
const parseBody = body => {
  try {
    return JSON.parse(body);
  } catch (e) {
    return body;
  }
};
export const asyncRequest = (url, options) =>
  new Promise((resolve, reject) =>
    request(url, options, (error, res, body) => {
      if (!error && res.statusCode > 199 && res.statusCode < 300) {
        resolve(body ? parseBody(body) : true);
      } else {
        reject(
          error ?? `HTTP error: ${res.statusCode} ${JSON.stringify(res.body)}`
        );
      }
    })
  );