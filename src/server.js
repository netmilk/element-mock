const fs = require('fs');
const http = require('http');
const accepts = require('accepts');

const { runRouter, collectPostData } = require('./helpers/server');
const { log } = require('./logger');

const data = process.env.ELEMENTS || JSON.parse(fs.readFileSync('./source/elements.json', 'utf8'));

const server = http.createServer((req, res) => {
  const accept = accepts(req);

  Promise.all([
    collectPostData(req),
    runRouter(req.url, req.method, data, {
      type: accept.type()[0],
      language: accept.language()[0],
      encoding: accept.encoding()[0],
    }),
  ])
    .then((allResults) => {
      const [body, result] = allResults;
      const responseHeaders = {};
      res.statusCode = result.statusCode;

      if (result.headers) {
        result.headers.forEach((header) => {
          if (header.key.toLowerCase() !== 'content-length') {
            res.setHeader(header.key, header.value);
            responseHeaders[header.key] = header.value;
          }
        });
      }

      const request = {
        url: req.url,
        method: req.method,
        headers: req.headers,
        body,
      };
      const response = {
        headers: responseHeaders,
        body: result.content,
        statusCode: result.statusCode,
      };

      return log(request, response)
        .then(() => res.end(result.content));
    })
    .catch(err => console.error(err));
});

module.exports.server = server;
