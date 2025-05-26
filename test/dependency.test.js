const { expect } = require('chai');
const sinon = require('sinon');
const fs = require('fs-extra');
const execa = require('execa');
const DependencyManager = require('../lib/managers/dependency');

describe('DependencyManager', () => {
  let manager;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    manager = new DependencyManager();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#install()', () => {
    it('should validate package names', async () => {
      try {
        await manager.install(['invalid-package!']);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('Invalid package name');
      }
    });

    it('should call tea install for valid packages', async () => {
      sandbox.stub(execa, 'command').resolves({ stdout: 'success' });
      sandbox.stub(fs, 'pathExists').resolves(false);
      
      await manager.install(['lodash']);
      expect(execa.command.calledWith('tea', ['install', 'lodash'])).to.be.true;
    });
  });

  describe('_updateLocalDependencies()', () => {
    it('should update package.json correctly', async () => {
      const mockPkg = { dependencies: {} };
      sandbox.stub(fs, 'readJson').resolves(mockPkg);
      sandbox.stub(fs, 'writeJson').resolves();
      sandbox.stub(fs, 'pathExists').resolves(true);
      
      await manager._updateLocalDependencies(['react'], {});
      expect(mockPkg.dependencies.react).to.equal('^latest');
    });
  });
});
