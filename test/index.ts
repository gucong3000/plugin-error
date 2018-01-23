'use strict';

import expect = require('expect.js');
import * as PluginError from '../';

describe('PluginError()', function() {
  it('should default name to Error', (done) => {
    const err = new PluginError('test', 'something broke');
    expect(err.name).to.equal('Error');
    done();
  });

  it('should default name to Error, even when wrapped error has no name', (done) => {
    const realErr = { message: 'something broke' };
    const err = new PluginError('test', realErr);
    expect(err.name).to.equal('Error');
    done();
  });

  it('should print the plugin name in toString', (done) => {
    const err = new PluginError('test', 'something broke');
    expect(err.toString()).to.contain('test');
    done();
  });

  it('should not include the stack by default in toString', (done) => {
    const err = new PluginError('test', 'something broke');
    // Just check that there are no 'at' lines
    expect(err.toString()).not.to.contain('at');
    done();
  });

  it('should include the stack when specified in toString', (done) => {
    const err = new PluginError('test', 'something broke', { stack: 'at huh', showStack: true });
    // Just check that there are 'at' lines
    expect(err.toString()).to.contain('at');
    done();
  });

  it('should take arguments as one object', (done) => {
    const err = new PluginError({
      message: 'something broke',
      plugin: 'test',
    });
    expect(err.plugin).to.equal('test');
    expect(err.message).to.equal('something broke');
    done();
  });

  it('should take arguments as plugin name and one object', (done) => {
    const err = new PluginError('test', {
      message: 'something broke',
    });
    expect(err.plugin).to.equal('test');
    expect(err.message).to.equal('something broke');
    done();
  });

  it('should take arguments as plugin name and message', (done) => {
    const err = new PluginError('test', 'something broke');
    expect(err.plugin).to.equal('test');
    expect(err.message).to.equal('something broke');
    done();
  });

  it('should take arguments as plugin name, message, and one object', (done) => {
    const err = new PluginError('test', 'something broke', { showStack: true });
    expect(err.plugin).to.equal('test');
    expect(err.message).to.equal('something broke');
    expect(err.showStack).to.equal(true);
    done();
  });

  it('should take arguments as plugin name, error, and one object', (done) => {
    const realErr = Object.assign(
      new Error('something broke'),
      {
        fileName: 'original.js',
      },
    );
    const err = new PluginError('test', realErr, { showStack: true, fileName: 'override.js' });
    expect(err.plugin).to.equal('test');
    expect(err.message).to.equal('something broke');
    expect(err.fileName).to.equal('override.js');
    expect(err.showStack).to.equal(true);
    done();
  });

  it('should take properties from error', (done) => {
    const realErr = Object.assign(
      new Error('something broke'),
      {
        abstractProperty: 'abstract',
      },
    );
    const err = new PluginError('test', realErr);
    expect(err.plugin).to.equal('test');
    expect(err.message).to.equal('something broke');
    expect(err.abstractProperty).to.equal('abstract');
    done();
  });

  it('should be configured to show properties by default', (done) => {
    const err = new PluginError('test', 'something broke');
    expect(err.showProperties).to.be(true);
    done();
  });

  it('should not be configured to take option to show properties', (done) => {
    const err = new PluginError('test', 'something broke', { showProperties: false });
    expect(err.showProperties).to.be(false);
    done();
  });

  it('should show properties', (done) => {
    const err = new PluginError('test', 'it broke', { showProperties: true });
    err.fileName = 'original.js';
    err.lineNumber = 35;
    expect(err.toString()).to.contain('it broke');
    expect(err.toString()).not.to.contain('message:');
    expect(err.toString()).to.contain('fileName:');
    done();
  });

  it('should show properties', (done) => {
    const realErr = Object.assign(
      new Error('something broke'),
      {
        fileName: 'original.js',
        lineNumber: 35,
      },
    );
    const err = new PluginError('test', realErr, { showProperties: true });
    expect(err.toString()).not.to.contain('message:');
    expect(err.toString()).to.contain('fileName:');
    done();
  });

  it('should not show properties', (done) => {
    const realErr = Object.assign(
      new Error('something broke'),
      {
        fileName: 'original.js',
        lineNumber: 35,
      },
    );
    const err = new PluginError('test', realErr, { showProperties: false });
    expect(err.toString()).not.to.contain('message:');
    expect(err.toString()).not.to.contain('fileName:');
    done();
  });

  it('should not show properties, but should show stack', (done) => {
    const err = new PluginError('test', 'it broke', { stack: 'test stack', showStack: true, showProperties: false });
    err.fileName = 'original.js';
    err.lineNumber = 35;
    expect(err.toString()).not.to.contain('message:');
    expect(err.toString()).not.to.contain('fileName:');
    expect(err.toString()).to.contain('test stack');
    done();
  });

  it('should not show properties, but should show stack for real error', (done) => {
    const realErr = Object.assign(
      new Error('something broke'),
      {
        fileName: 'original.js',
        lineNumber: 35,
        stack: 'test stack',
      },
    );
    const err = new PluginError('test', realErr, { showStack: true, showProperties: false });
    expect(err.toString()).not.contain('message:');
    expect(err.toString()).not.contain('fileName:');
    expect(err.toString()).contain('test stack');
    done();
  });

  it('should not show properties, but should show stack for _stack', (done) => {
    const realErr = Object.assign(
      new Error('something broke'),
      {
        _stack: 'test stack',
        fileName: 'original.js',
        lineNumber: 35,
      },
    );
    const err = new PluginError('test', realErr, { showStack: true, showProperties: false });
    expect(err.toString()).not.contain('message:');
    expect(err.toString()).not.contain('fileName:');
    expect(err.toString()).contain('test stack');
    done();
  });

  it('should show properties and stack', (done) => {
    const realErr = Object.assign(
      new Error('something broke'),
      {
        fileName: 'original.js',
        stack: 'test stack',
      },
    );
    const err = new PluginError('test', realErr, { showStack: true });
    expect(err.toString()).not.contain('message:');
    expect(err.toString()).contain('fileName:');
    expect(err.toString()).contain('test stack');
    done();
  });

  it('should show properties added after the error is created', (done) => {
    const realErr = new Error('something broke');
    const err = new PluginError('test', realErr);
    err.fileName = 'original.js';
    expect(err.toString()).not.contain('message:');
    expect(err.toString()).contain('fileName:');
    done();
  });

  it('should toString quickly', (done) => {
    this.timeout(100);

    const err = new PluginError('test', 'it broke', { showStack: true });
    err.toString();

    done();
  });

  it('should toString quickly with original error', (done) => {
    this.timeout(100);

    const realErr = new Error('it broke');
    const err = new PluginError('test', realErr, { showStack: true });
    err.toString();

    done();
  });

  it('should not show "Details:" if there are no properties to show', (done) => {
    const err = new PluginError('plugin', 'message');
    expect(err.toString()).not.contain('Details:');
    done();
  });

  it('should throw a error "Call PluginError using new"', (done) => {
    expect(PluginError.bind(this)).to.throwException((err) => {
      expect(err).to.be.a(Error);
      expect(err.name).to.equal('Error');
      expect(err.message).to.equal('Call PluginError using new');
      done();
    });
  });

  it('should throw a error "Missing plugin name"', (done) => {
    expect(() => {
      return new PluginError({
        message: 'something broke',
        plugin: '',
      });
    }).to.throwException((err) => {
      expect(err).to.be.a(Error);
      expect(err.name).to.equal('Error');
      expect(err.message).to.equal('Missing plugin name');
      done();
    });
  });

  it('should throw a error "Missing error message"', (done) => {
    expect(() => {
      return new PluginError({
        message: '',
        plugin: 'test',
      });
    }).to.throwException((err) => {
      expect(err).to.be.a(Error);
      expect(err.name).to.equal('Error');
      expect(err.message).to.equal('Missing error message');
      done();
    });
  });

  it('support error type define with "Error | string"', (done) => {
    const PLUGIN_NAME = 'test';
    function createPluginError(err: Error | string) {
      return new PluginError(PLUGIN_NAME, err);
    }
    expect(createPluginError('something broke').message).to.equal('something broke');
    expect(createPluginError(new Error('something broke')).message).to.equal('something broke');
    done();
  });

  it('Inference with union type on second parameter', (done) => {
    const PLUGIN_NAME = 'test';

    interface IFooError extends Error {
      foo: number;
    }

    function createPluginError(err: IFooError | string) {
      return new PluginError(PLUGIN_NAME, err);
    }

    const fooError: IFooError = Object.assign(new Error('something broke'), {foo: 1});
    const pluginError = createPluginError(fooError);
    const foo: number = pluginError.foo;
    expect(foo).to.be(1);
    done();
  });

  it('Inference with union type on second parameter and dependent properties', (done) => {
    // Inference with union type on second parameter and dependent properties
    const PLUGIN_NAME = 'test';

    interface IFooBarError extends Error {
      foo: number;
      bar: number;
    }

    function createPluginError(err: IFooBarError | string) {
      return new PluginError(PLUGIN_NAME, err);
    }

    const fooError: IFooBarError = Object.assign(new Error('something broke'), {foo: 1, bar: 2});
    const pluginError = createPluginError(fooError);
    const foo: number = pluginError.foo;
    const bar: number = pluginError.bar;
    expect(foo).to.be(1);
    expect(bar).to.be(2);
    done();
  });
});
