process.env.NODE_ENV === 'test';

const express = require("express");
const { expect, assert } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const app = require("../app")

const VideoController = require('../controllers/VideoControllers');
const S3Client = require('../configs/AWSConfig');

describe('GET ABOUT APP', () => {
     let about;

    beforeEach(() => {
        sinon.restore();
        about = { description: "The service is a demo video uploader", version: "V1", name: "AK-VideoUploader" }
    });
    it('Should successfully retrive the about info', (done) => {
        request(app)
        .get('/v1/api/info')
        .expect(200)
        .then((res) => {
            expect(res.body).to.be.an('object');
            assert.deepEqual(res.body, about);
            done();
        })
        .catch((error) => done(error));
    });
});

describe('GET ASSETS_KEYS SUCCESS', () => {
 let result;

 beforeEach(() => {
   sinon.restore();
    result = {"mes":"Successful","videos":["b1be507e6f043c07bf4ba4995b957387","b9bc8c33be3d4c46f47f135bdab2835b","eeb7fde1f989548d3d5dac7bdbdf93bc","f9251b686cbe4ab78c01f01bfa97b9d6","tos-teaser.mp4","tos-teaser2.mp4","tos-teaser3.mp4","videos/tos-teaser.mp4"]}
 });

 it('Should return the key for all records in our storage ', async () => {
    const s3 = sinon.stub(new S3Client());
    // const stub = sinon.stub(s3, 'getAssets').returns(result);
     let videoController = new VideoController(s3);
    sinon.stub(videoController, 'getAssets').resolves(result);
    
    request(app)
        .get('/v1/api/assets')
        .expect(200)
        .then((res) => {
            expect(res.body).to.be.an('object');
            assert.deepEqual(res.body, result);
    });
 });
});
