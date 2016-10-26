class Middleware {

    constructor (callback) {
        this.callback = callback;
    }

    handle (req, res, next) {
        this.callback(req, res, next);
    }

}

module.exports = Middleware;