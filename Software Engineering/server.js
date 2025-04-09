const http = require('http');
const app = require('./app');
//const https = require('https');  /////
const fs = require('fs');

const port = process.env.PORT || 8765;
const server = http.createServer(app);
server.listen(port);

/*const options = {
    key: fs.readFileSync('C:/Users/andre/Desktop/softeng/key.pem'),
    cert: fs.readFileSync('C:/Users/andre/Desktop/softeng/cert.pem'),
    passphrase: '1234'
  };
https.createServer(options,app).listen(8765)*/


