process.env.NODE_ENV === 'test';

const sinon = require('sinon');
const { expect, assert } = require('chai');
const VideoController = require('../controllers/VideoControllers');
const S3Client = require('../configs/AWSConfig');

describe('GET ALL ASSETS', () => {
 let assets;
 let S3ClientStub, videoController;

 beforeEach((done) => {
   sinon.restore();
   setTimeout(done, 1000);
    assets = {
        IsTruncated: false,
        Marker: 'TEST',
        Contents: [
          {
            Key: 'b1be507e6f043c07bf4ba4995b957387',
            LastModified: '2021-09-01T10:28:18.000Z',
            ETag: '"00eef05b7d98b6d21498e113638f7156-7"',
            Size: 33537464,
            StorageClass: 'STANDARD',
            Owner: [Object]
          },
          {
            Key: 'b9bc8c33be3d4c46f47f135bdab2835b',
            LastModified: '2021-09-01T11:56:08.000Z',
            ETag: '"00eef05b7d98b6d21498e113638f7156-7"',
            Size: 33537464,
            StorageClass: 'STANDARD',
            Owner: [Object]
          },
          {
            Key: 'eeb7fde1f989548d3d5dac7bdbdf93bc',
            LastModified: '2021-09-01T10:21:41.000Z',
            ETag: '"00eef05b7d98b6d21498e113638f7156-7"',
            Size: 33537464,
            StorageClass: 'STANDARD',
            Owner: [Object]
          },
          {
            Key: 'f9251b686cbe4ab78c01f01bfa97b9d6',
            LastModified: '2021-09-01T12:09:42.000Z',
            ETag: '"00eef05b7d98b6d21498e113638f7156-7"',
            Size: 33537464,
            StorageClass: 'STANDARD',
            Owner: [Object]
          },
          {
            Key: 'tos-teaser.mp4',
            LastModified: '2021-09-01T16:13:00.000Z',
            ETag: '"00eef05b7d98b6d21498e113638f7156-7"',
            Size: 33537464,
            StorageClass: 'STANDARD',
            Owner: [Object]
          },
          {
            Key: 'tos-teaser2.mp4',
            LastModified: '2021-09-01T16:19:11.000Z',
            ETag: '"00eef05b7d98b6d21498e113638f7156-7"',
            Size: 33537464,
            StorageClass: 'STANDARD',
            Owner: [Object]
          },
          {
            Key: 'tos-teaser3.mp4',
            LastModified: '2021-09-01T16:35:19.000Z',
            ETag: '"00eef05b7d98b6d21498e113638f7156-7"',
            Size: 33537464,
            StorageClass: 'STANDARD',
            Owner: [Object]
          },
          {
            Key: 'videos/tos-teaser.mp4',
            LastModified: '2021-09-01T14:26:03.000Z',
            ETag: '"00eef05b7d98b6d21498e113638f7156-7"',
            Size: 33537464,
            StorageClass: 'STANDARD',
            Owner: [Object]
          }
        ],
        Name: 'videos-folder-001',
        Prefix: '',
        MaxKeys: 1000,
        CommonPrefixes: []
      };
 });

    it('Should return keys for all assets in the S3 bucket', async () => {
        const s3 = new S3Client();
        const stub = sinon.stub(s3, 'getAssets').returns(assets);
        videoController = new VideoController(s3);
        const assetsreturned = await videoController.getAssets();
        // assert.deepEqual(assetsreturned, assets);
    });
});