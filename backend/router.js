module.exports = function () {

    return {

        routes: [],

        add(route, handler) {
            this.routes.push({ route: route , handler: handler});
            return this;
        },

        check(url, req, res) {
            for (let id in this.routes) {
                if (this.routes[id].route === url) {
                    return this.routes[id].handler(req, res);
                }
            }
        }
    }

};