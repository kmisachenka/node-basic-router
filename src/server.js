const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 9000;

let files = {};

const assets = (req, res) => {

    const sendError = (message, code) => {
        if (code === undefined) {
            code = 404;
        }
        res.writeHead(code, { 'Content-Type' : 'text/html' });
        res.end(message);
    };

    const serve = (file) => {
        let contentType;
        switch (file.ext.toLowerCase()) {
            case "css":
                contentType = "text/css";
                break;
            case "html":
                contentType = "text/html";
                break;
            case "js":
                contentType = "application/javascript";
                break;
            case "ico":
                contentType = "image/ico";
                break;
            case "json":
                contentType = "application/json";
                break;
            case "jpg":
                contentType = "image/jpeg";
                break;
            case "jpeg":
                contentType = "image/jpeg";
                break;
            case "png":
                contentType = "image/png";
                break;
            default:
                contentType = "text/plain";
        }
        res.writeHead(200, { 'Content-Type' : contentType });
        res.end(file.content);
    };

    const readFile = (filePath) => {
        if (files[filePath]) {
            serve(files[filePath]);
        } else {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    sendError('Error reading file ' + filePath)
                    return;
                }
                files[filePath] = {
                    ext: filePath.split('.').pop(),
                    content: data
                }
                serve(files[filePath]);
            });

        }
    };

    readFile(path.normalize(__dirname + req.url));

};



const server = http.createServer(assets).listen(PORT);

console.log('Listening on ' + PORT + ' port');