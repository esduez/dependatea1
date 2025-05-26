const { expect } = require('chai');
const sinon = require('sinon');
const fs = require('fs-extra');
const execa = require('execa');
const DependencyManager = require('../../lib/managers/dependency');
const TeaManager = require('../../lib/tea/config');

describe('DependencyManager', () => {
  let depManager;
  let teaManagerStub;
  let execaStub;
  let fsStub;

  beforeEach(() => {
    teaManagerStub = sinon.createStubInstance(TeaManager);
    teaManagerStub.isEnabled = true;
    
    depManager = new DependencyManager(teaManagerStub);
    
    execaStub = sinon.stub(execa, 'command');
    fsStub = sinon.stub(fs);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('#install()', () => {
    it('should install packages with TEA', async () => {
      execaStub.resolves({ stdout: '' });
      fsStub.pathExists.resolves(false);
      
      await depManager.install(['lodash', 'express']);
      
      sinon.assert.calledWith(execaStub, 'tea', ['install', 'lodash', 'express']);
    });
  });

  describe('#list()', () => {
    it('should list all dependencies', async () => {
      execaStub.withArgs('npm', ['list', '-g', '--depth=0', '--json'])
        .resolves({ stdout: '{"dependencies":{"lodash":"^4.17.21"}}' });
      
      execaStub.withArgs('tea', ['list', '--json'])
        .resolves({ stdout: '[{"name":"tea-pkg"}]' });
      
      fsStub.pathExists.resolves(true);
      fsStub.readFile.resolves('{"dependencies":{"express":"^4.18.2"}}');
      
      const result = await depManager.list();
      
      expect(result.project.dependencies).to.have.property('express');
      expect(result.global).to.have.property('lodash');
      expect(result.tea).to.be.an('array');
    });
  });
});
