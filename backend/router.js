const http = require('http');

module.exports = function router () {

    return {

        middlewares: [],
        routes: [],

        /* Default route */

        defaultRoute: 'undefined',

        all (handler) {
            this.defaultRoute = handler;
            return this;
        },

        add(route, handler) {
            this.routes.push({ route: route, handler: handler});
            return this;
        },

        use(handler) {
            this.middlewares.push({ handler: handler });
            return this;
        },

        check(url, req, res) {

            res.__proto__.json = (data) => {
                res.writeHead(200, { 'Content-Type' : 'application/json' });
                res.end(JSON.stringify(data));
            }

            for (let id in this.middlewares) {
                if (typeof this.middlewares[id].handler === 'function') {
                    this.middlewares[id].handler(req, res);
                }
            }

            for (let id in this.routes) {
                if (this.routes[id].route === url) {
                    return this.routes[id].handler(req, res);
                }
            }


            if (typeof this.defaultRoute === 'function') {
                this.defaultRoute(req, res);
            } else {
                res.writeHead(404);
                res.end(`Handler for route ${url} not found`);
            }


        },

        listen(port, callback) {

            http.createServer((req, res) => {
                this.check(req.url, req, res);
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
        return;
    }

    return (req, res) => {
        if (req.url.includes('.')){
            assets(root, req, res);
            return;
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
