const { expect } = require('chai');
const sinon = require('sinon');
const DependencyManager = require('../lib/managers/dependency');

describe('DependencyManager', () => {
  let depManager;

  beforeEach(() => {
    depManager = new DependencyManager();
  });

  describe('#install()', () => {
    it('should install packages with TEA when enabled', async () => {
      const execaStub = sinon.stub(require('execa'), 'command').resolves();
      const fsStub = sinon.stub(require('fs-extra'));
      
      fsStub.pathExists.resolves(true);
      fsStub.readJson.resolves({ dependencies: {} });
      
      await depManager.install(['lodash']);
      
      expect(execaStub.calledWith('tea', ['install', 'lodash'])).to.be.true;
    });
  });
});
