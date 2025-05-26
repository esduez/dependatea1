import chai from 'chai';
import TeaIntegration from '../../src/core/tea-integration';
import nock from 'nock';

const { expect } = chai;

describe('TeaIntegration', () => {
  let tea;

  before(() => {
    tea = new TeaIntegration();
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should install package successfully', async () => {
    nock('https://api.tea.xyz')
      .post('/v1/packages/install')
      .reply(200, { success: true });

    const result = await tea.installPackage('lodash');
    expect(result).to.have.property('success', true);
  });
});
