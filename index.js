const { server } = require('./src/server');

const hostname = '0.0.0.0';
const port = process.env.PORT || 3000;

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
