process.env.NODE_ENV === 'test';

const sinon = require('sinon');
const { expect } = require('chai');
const serviceController = require('../controllers/serviceController');

describe('ABOUT APPLICATION', () => {
 let about;

 beforeEach(() => {
   sinon.restore();
    about = { description: "The service is a demo video uploader", version: "V1", name: "AK-VideoUploader" }
 });

 it('Should return about info for the app', async () => {
   sinon.stub(serviceController, 'aboutApp').resolves(about);

   expect(await serviceController.aboutApp()).to.equal(about);
 });
});