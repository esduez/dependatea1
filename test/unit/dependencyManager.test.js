const { expect } = require('chai');
const sinon = require('sinon');
const DependencyManager = require('../../lib/managers/dependency');

describe('DependencyManager', () => {
  let manager;
  let execaStub;
  let fsStub;

  beforeEach(() => {
    manager = new DependencyManager();
    execaStub = sinon.stub(require('execa'), 'command').resolves();
    fsStub = sinon.stub(require('fs-extra'));
  });

  it('should install packages via TEA', async () => {
    fsStub.pathExists.resolves(true);
    fsStub.readJson.resolves({ dependencies: {} });
    
    await manager.install(['lodash']);
    expect(execaStub.calledWith('tea', ['install', 'lodash'])).to.be.true;
  });
});
