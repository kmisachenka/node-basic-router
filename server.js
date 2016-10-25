const http = require('http');
const fs = require('fs');
const path = require('path');

const assets = require('./backend/assets')
const router = require('./backend/router')();

const PORT = 9000;

router
    .add('static', assets)
    .add('/', (req, res) => {
        res.writeHead(200, { 'Content-Type' : 'application/json' });
        res.end('root' + '\n');
    })
    .add('route', (req, res) => {
        res.writeHead(200, { 'Content-Type' : 'application/json' });
        res.end('route' + '\n');
    });

let process = (req, res) => {
    router.check(req.url, req, res);
}

const server = http.createServer(process).listen(PORT);

console.log('Listening on ' + PORT + ' port');