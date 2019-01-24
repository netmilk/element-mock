const elementRouter = require('element-routing');

module.exports.collectPostData = async req => new Promise((resolve, reject) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  req.on('end', () => {
    resolve(body);
  });
  req.on('error', (err) => {
    reject(err);
  });
});

module.exports.runRouter = (url, method, data, options) => {
  const results = elementRouter.getResults(data, url, method, options);
  const [result] = results;

  if (result) {
    return {
      statusCode: result.response.statusCode,
      content: result.response.content,
      headers: result.response.headers,
    };
  }

  return {
    statusCode: 404,
    content: '',
  };
};
