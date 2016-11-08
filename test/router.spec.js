const expect = require('chai').expect;

const Router = require('../backend/router').Router;

describe('router', () => {

    let router;

    beforeEach(() => {
        router = new Router();
    });


    describe('add()', () => {
      it('shoud add route', () => {
          router.add('/route', (req, res) => { })
          expect(router.routes).to.have.length(1);

      });

   });

    describe('check()', () => {
        it('shoud resolve existing route', () => {
            router.add('/route', (req, res) => {
                return {};
            })
            let route = router.resolve({ url: '/route'}, {});
            expect(route).to.exist;
        })
    })

});