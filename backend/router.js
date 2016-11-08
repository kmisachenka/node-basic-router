const http = require('http');

class Router {

    constructor() {

        this.middlewares = [];
        this.routes = [];

        /* Default route. Will be used if other routes not match */

        this.defaultRoute = 'undefined';

    }

    all(handler) {
        this.defaultRoute = handler;
        return this;
    }

    add(route, handler) {
        this.routes.push({ lookup: route, handler: handler});
        return this;
    }

    use(handler) {
        this.middlewares.push({ handler: handler });
    }

    resolve(req, res) {

        const url = req.url;

        res.__proto__.json = (data) => {
            res.writeHead(200, { 'Content-Type' : 'application/json' });
            res.end(JSON.stringify(data));
        }

        /* Handle middlewares */

        this.middlewares.forEach((middleware) => {
            middleware.handler(req, res);
        })

        /* Handle routes */

        this.routes
            .filter(route => { return route.lookup === url })
            .forEach(route => {
                route.handler(req, res)
                return
            });

        /* Handle default route if exists */

        if (this.defaultRoute) {
            this.defaultRoute(req, res);
            return;
        }

        /* If it is not - sent 404 */

        if(!res.finished) {
            res.writeHead(404, { 'Content-Type' : 'text/html'});
            res.end(`Route for ${url} not found`);
        }

    }

    listen(port, callback) {

        http.createServer((req, res) => {
            this.resolve(req, res);
        }).listen(port);

        if (typeof callback === 'function') {
            callback();
        } else {
            throw new Error("callback must be a function")
        }
    }

}

module.exports.Router = Router;

const assets = require('./assets');

module.exports.static = (root) => {

    if (typeof root !== 'string') {
        throw new Error('root must be a string')
    }

    return (req, res) => {
        if (req.url.includes('.')) {
            assets(root, req, res);
        }
    }
}

module.exports.logger = () => {
    return (req, res) => {
        let start = Date.now();
        res.on('finish', () => {
            let finish = Date.now();
            console.log(`${req.method} ${req.url} ${finish - start} ms`)
        })
    }

}
