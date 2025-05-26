import { expect } from 'chai';
import sinon from 'sinon';
import DependencyManager from '../../src/core/DependencyManager.js';
import fs from 'fs-extra';

describe('DependencyManager', () => {
  let sandbox;
  let teaClientStub;

  before(() => {
    sandbox = sinon.createSandbox();
    teaClientStub = {
      connect: sandbox.stub().resolves(),
      install: sandbox.stub().resolves({ success: true })
    };
    sandbox.stub(DependencyManager, 'teaClient').get(() => teaClientStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#install()', () => {
    it('should install packages via TEA client', async () => {
      sandbox.stub(fs, 'readJson').resolves({});
      sandbox.stub(fs, 'writeJson').resolves();
      
      const manager = await DependencyManager.initialize();
      const result = await manager.install(['lodash']);
      
      expect(teaClientStub.install.calledWith('lodash')).to.be.true;
      expect(result).to.be.an('array');
    });
  });
});
