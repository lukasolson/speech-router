/**
 * @venus-library mocha
 * @venus-code ../speech-router.js
 */

describe('SpeechRouter', function () {
  var instance;

  beforeEach(function () {
    if (SpeechRouter) {
      instance = new SpeechRouter();
    }
  });

  afterEach(function () {
    if (instance) {
      instance.stop();
    }
  });

  it('supports speech API', function () {
    if (!SpeechRouter) {
      throw new Error('Unable to initialize SpeechRouter. User Agent likely does not support tho webkitSpeechRecognition API');
    }
  });

  describe('simple parameters', function () {
    it('should trigger simple route', function () {
      var routeFn = sinon.spy(),
          path    = 'hello';

      instance.route(path, routeFn);
      instance.trigger('hello');
      expect(routeFn.callCount).to.be(1);
    });
  });

  describe('named parameters, no whitespace', function () {
    var path, input, routeFn;

    beforeEach(function () {
      routeFn = sinon.spy();
      path = 'hello :name';
    });

    it('should trigger route once', function () {
      instance.route(path, routeFn);
      instance.trigger('hello bob');
      expect(routeFn.callCount).to.be(1);
    });

    it('should trigger route with parameter value', function () {
      instance.route(path, routeFn);
      instance.trigger(input);
      expect(routeFn.calledWith('bob')).to.be.ok;
    });

    it('should not trigger route', function () {
      instance.route(path, routeFn);
      instance.trigger('hello');
      expect(routeFn.callCount).to.be(0);
    });
  });

  describe('named parameters, whitespace', function () {
    var path, routeFn;

    beforeEach(function () {
      routeFn = sinon.spy();
      path = 'hello *fullname';
    });

    it('should trigger route once', function () {
      instance.route(path, routeFn);
      instance.trigger('hello bob jones');
      expect(routeFn.callCount).to.be(1);
    });

    it('should trigger route with parameter value', function () {
      instance.route(path, routeFn);
      instance.trigger('hello bob jones');
      expect(routeFn.calledWith('bob jones')).to.be.ok;
    });

    it('should not trigger route', function () {
      instance.route(path, routeFn);
      instance.trigger('hello');
      expect(routeFn.callCount).to.be(0);
    });
  });

  describe('optional text', function () {
    var path, input, routeFn;

    beforeEach(function () {
      routeFn = sinon.spy();
      path = 'hello (bob)';
    });

    it('should trigger route once', function () {
      instance.route(path, routeFn);
      instance.trigger('hello bob');
      expect(routeFn.callCount).to.be(1);
    });

    it('should trigger route once without parameter', function () {
      instance.route(path, routeFn);
      instance.trigger('hello ');
      expect(routeFn.callCount).to.be(1);
    });
  });

});
