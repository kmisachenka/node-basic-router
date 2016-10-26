const http = require('http');
const fs = require('fs');
const path = require('path');

const assets = require('./backend/assets')
const router = require('./backend/router');

const PORT = 9000;

const app = router();

// app.use(router.logger());
// app.use(router.static(__dirname + '/public'));

app.use((req, res, next) => {
    console.log('First middleware');
    next()
});

app.use((req, res, next) => {
    console.log('Second middleware');
    next();
})

app.use(router.logger());

app
    .add('/', (req, res) => {
        let response = {
            handler: "route handler"
        }
        res.json(response);
    })
    .all((req, res) => {
        let response = {
            handler: "default handler"
        }
        res.json(response);
    });

app.listen(PORT, () => {
    console.log('Listening on ' + PORT + ' port');
})

