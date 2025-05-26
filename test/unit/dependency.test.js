const { expect } = require('chai');
const sinon = require('sinon');
const DependencyManager = require('../../lib/managers/dependency');
const fs = require('fs-extra');
const execa = require('execa');

describe('DependencyManager', () => {
  let manager;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    manager = new DependencyManager();
    sandbox.stub(fs, 'pathExists').resolves(true);
    sandbox.stub(fs, 'readJson').resolves({ dependencies: {} });
    sandbox.stub(fs, 'writeJson').resolves();
    sandbox.stub(execa, 'command').resolves();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#install()', () => {
    it('should install packages via TEA', async () => {
      await manager.install(['lodash']);
      expect(execa.command.calledWith('tea', ['install', 'lodash'])).to.be.true;
    });

    it('should update package.json', async () => {
      await manager.install(['react']);
      expect(fs.writeJson.calledOnce).to.be.true;
    });
  });
});
