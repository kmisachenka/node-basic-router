const expect = require('chai').expect;

const Router = require('../backend/router');

describe('router', () => {

    let router;

    beforeEach(() => {
        router = Router();
    });


    describe('add()', () => {
      it('shoud add route', () => {
          router.add('/route', (req, res) => { })
          expect(router.routes).to.have.length(1);

      });

   });

    describe('check()', () => {
        it('shoud check existing route', () => {
            router.add('/route', (req, res) => {
                return {};
            })
            let route = router.check('/route', {}, {});
            expect(route).to.exist;
        })
    })

});