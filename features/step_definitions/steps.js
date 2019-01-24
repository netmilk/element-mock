/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable func-names */
const { Given, Then } = require('cucumber');
const { expect } = require('chai');
const drafter = require('drafter');
const MockReq = require('mock-req');
const parser = require('http-string-parser');

const { runRouter } = require('../../src/helpers/server');

const parseDocument = async description => new Promise((resolve, reject) => {
  const options = {
    generateSourceMap: true,
  };

  drafter.parse(description, options, (err, result) => {
    if (err) reject(err);
    else resolve(result);
  });
});

Given('I have a following API description document parsed to {string}:', function (string, docString) {
  this.setDocument(docString);
});

Given('I make following {string} HTTP request to the Mock URL:', function (string, docString) {
  const requestDesc = parser.parseRequest(docString);
  const req = new MockReq({
    method: requestDesc.method,
    url: requestDesc.uri,
    headers: requestDesc.headers,
  });
  if (requestDesc.body) {
    req.write(requestDesc.body);
  }
  req.end();

  return parseDocument(this.getDocument())
    .then(data => runRouter(req.url, req.method, data))
    .then(result => this.setResult(result));
});

Then('I receive', function (docString) {
  const result = this.getResult();
  expect(result.content.trim()).to.be.eq(docString.trim());
});
