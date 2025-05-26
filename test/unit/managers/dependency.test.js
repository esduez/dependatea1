const { expect } = require('chai');
const sinon = require('sinon');
const fs = require('fs-extra');
const execa = require('execa');
const DependencyManager = require('../../../lib/managers/dependency');

describe('DependencyManager', () => {
  let manager;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    manager = new DependencyManager();
    
    // Stub execa
    sandbox.stub(execa, 'command').resolves({ stdout: 'success' });
    
    // Stub fs-extra methods
    sandbox.stub(fs, 'pathExists').resolves(true);
    sandbox.stub(fs, 'readJson').resolves({ dependencies: {} });
    sandbox.stub(fs, 'writeJson').resolves();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#install()', () => {
    it('should install packages via TEA when enabled', async () => {
      await manager.install(['lodash', 'express']);
      
      expect(execa.command.calledWith('tea', [
        'install', 'lodash', 'express'
      ])).to.be.true;
    });

    it('should update package.json for local installs', async () => {
      await manager.install(['react'], { dev: true });
      
      expect(fs.writeJson.calledOnce).to.be.true;
      const [path, pkg] = fs.writeJson.args[0];
      expect(pkg.devDependencies.react).to.exist;
    });
  });
});
