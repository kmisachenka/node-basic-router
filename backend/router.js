const http = require('http')
const Stack = require('./stack');
const Middleware = require('./middleware');

module.exports = function router () {

    return {

        stack: new Stack(),
        routes: [],

        /* Default route. Will be used if defined as callback */

        defaultRoute: 'undefined',

        all (handler) {
            this.defaultRoute = handler;
            return this;
        },

        add(route, handler) {
            this.routes.push({ lookup: route, handler: handler});
            return this;
        },

        use(handler) {
            this.stack.add(handler);
        },

        resolve(req, res) {

            const url = req.url;

            res.__proto__.json = (data) => {
                res.writeHead(200, { 'Content-Type' : 'application/json' });
                res.end(JSON.stringify(data));
            }

            this.stack.route(req, res);

            this.routes
                .filter(route => { return route.lookup === url })
                .forEach(route => {
                    route.handler(req, res)
                    return
                });


            if(!res.finished) {
                res.writeHead(404, { 'Content-Type' : 'text/html'});
                res.end(`Route for ${url} not found`);
            }

        },

        listen(port, callback) {

            http.createServer((req, res) => {
                this.resolve(req, res);
            }).listen(port);

            if (typeof callback === 'function') {
                callback();
            }
        }
    }

};

const assets = require('./assets');

module.exports.static = (root) => {

    if (typeof root !== 'string') {
        console.log('root must be a string')
    }

    return (req, res, next) => {
        if (req.url.includes('.')) {
            assets(root, req, res, next);
        } else {
            next()
        }
    }
}

module.exports.logger = () => {
    return (req, res, next) => {
        let start = Date.now();
        res.on('finish', () => {
            let finish = Date.now();
            console.log(`${req.method} ${req.url} ${finish - start} ms`)
        })
        next();
    }

}
