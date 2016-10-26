const Middleware = require('./middleware');

class Stack {

    constructor () {
        this.current = 0;
        this.middlewares = [];
    }

    add (callback) {
        let middleware = new Middleware(callback);
        this.middlewares.push(middleware);
    }

    route (req, res) {
        this.middlewares.forEach(middleware => middleware.handle(req, res, this.next));
    }

    next () {
        console.log('aaaaaaaaaaa');

    }
}

module.exports = Stack;