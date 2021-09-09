process.env.NODE_ENV === 'test';

const sinon = require('sinon');
const { expect, assert } = require('chai');
const VideoController = require('../controllers/VideoControllers');
const S3Client = require('../configs/AWSConfig');

describe('GET METHOD TEST', () => {
 let assets;
 let S3ClientStub, videoController;
 let mockResponse, mockRequest, mockNext;

 before( async() => {
  mockRequest = {
    query:  {
      asset: "test-file.mp4"
    }
  }
  mockResponse = {
    status: (x) => {
      return {
        json: (y) => {return y}
      }
    }
  }
  mockNext = arg => arg;
 })

 beforeEach((done) => {
   sinon.restore();
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
      done();
 });

    it('Should return keys for all assets in the S3 bucket', async () => {
        const s3 = new S3Client();
        const stub = sinon.stub(s3, 'getAssets').returns(assets);
        const expected = {message: "Successful", data: assets.Contents.map(ctn => ctn.Key)}

        videoController = new VideoController(s3);
        const assetsreturned = await videoController.getAssets(mockRequest, mockResponse, () => {});

        assert.deepEqual(assetsreturned, expected);

    });

    // it.only("Should return 404 for an empty bucket", async() => {
    //     const s3 = new S3Client();
    //     assets.Contents = [];
    //     const stub = sinon.stub(s3, 'getAssets').returns(assets);
    //     videoController = new VideoController(s3);

    //     const assetsreturned = await videoController.getAssets(mockRequest, mockResponse, () => {});
    //     console.log(assetsreturned);
    //     assetsreturned.has.status(404);

    // })

    it('Should return metadata for an assets in the S3 bucket', async () => {
      const metadata = {"AcceptRanges":"bytes","LastModified":"2021-09-09T12:47:36.000Z","ContentLength":53397323,"ETag":"\"f842de0b6b298469b7a883162443b7a4-11\"","ContentType":"application/octet-stream","Metadata":{"ffprobe":{"streams":[{"index":0,"codec_name":"h264","codec_long_name":"H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10","profile":"High","codec_type":"video","codec_time_base":"50/2997","codec_tag_string":"avc1","codec_tag":"0x31637661","width":1280,"height":720,"coded_width":1280,"coded_height":720,"has_b_frames":2,"sample_aspect_ratio":"1:1","display_aspect_ratio":"16:9","pix_fmt":"yuv420p","level":31,"color_range":"tv","color_space":"bt709","color_transfer":"bt709","color_primaries":"bt709","chroma_location":"left","refs":1,"is_avc":"true","nal_length_size":"4","r_frame_rate":"2997/100","avg_frame_rate":"2997/100","time_base":"1/11988","start_pts":800,"start_time":"0.066733","duration_ts":1599200,"duration":"133.400067","bit_rate":"3068591","bits_per_raw_sample":"8","disposition":{"default":1,"dub":0,"original":0,"comment":0,"lyrics":0,"karaoke":0,"forced":0,"hearing_impaired":0,"visual_impaired":0,"clean_effects":0,"attached_pic":0,"timed_thumbnails":0},"tags":{"language":"und","handler_name":"ISO Media file produced by Google Inc. Created on: 11/06/2019."}},{"index":1,"codec_name":"aac","codec_long_name":"AAC (Advanced Audio Coding)","profile":"LC","codec_type":"audio","codec_time_base":"1/44100","codec_tag_string":"mp4a","codec_tag":"0x6134706d","sample_fmt":"fltp","sample_rate":"44100","channels":2,"channel_layout":"stereo","bits_per_sample":0,"r_frame_rate":"0/0","avg_frame_rate":"0/0","time_base":"1/44100","start_pts":0,"start_time":"0.000000","duration_ts":5867262,"duration":"133.044490","bit_rate":"129666","max_bit_rate":"128000","disposition":{"default":1,"dub":0,"original":0,"comment":0,"lyrics":0,"karaoke":0,"forced":0,"hearing_impaired":0,"visual_impaired":0,"clean_effects":0,"attached_pic":0,"timed_thumbnails":0},"tags":{"language":"eng","handler_name":"ISO Media file produced by Google Inc. Created on: 11/06/2019."}}]}}}
      const s3 = new S3Client();
      const stub = sinon.stub(s3, 'getMetadata').returns(metadata);
      const expected = {message: "Successful", data: metadata}

      videoController = new VideoController(s3);
      const assetsreturned = await videoController.getMetadata(mockRequest, mockResponse, () => {});

      assert.deepEqual(assetsreturned, expected);

  });
});


describe('POST METHODS TEST', () => {
  let assets;
  let S3ClientStub, videoController;
  let mockResponse, mockRequest, mockNext;
 
  before( async() => {

   mockRequest = {
     body:  {
       asset: "test-file.mp4"
     },
     file: {
       path: "./public/temp/test/test-video.mp4",
       originalname: "test-video.mp4"
     }
   }
   mockResponse = {
     status: (x) => {
       return {
         json: (y) => {return y}
       }
     }
   }
   mockNext = arg => arg;
  })
 
  beforeEach((done) => {
    sinon.restore();
       done();
  });
 
     it.only('Should upload and return name of uploaded asset in the S3 bucket', async () => {
       const upload = {
        Location: 'https://demo-bucket-001.s3.us-west-2.amazonaws.com/test-video.mp4',
        Bucket: 'demo-bucket-001',
        Key: 'test-video.mp4',
        ETag: '"b198e0a3ec80d1e5b6390783d17dbd63-8"'
      }
         const s3 = new S3Client();
         const stub = sinon.stub(s3, 'uploadToBucket').returns(upload);
         const expected = {message: "Successful", video: upload.Key}
 
         videoController = new VideoController(s3);
         const assetsreturned = await videoController.uploadVideo(mockRequest, mockResponse, () => {});
 
         assert.deepEqual(assetsreturned, expected);
 
     });
 
     // it.only("Should return 404 for an empty bucket", async() => {
     //     const s3 = new S3Client();
     //     assets.Contents = [];
     //     const stub = sinon.stub(s3, 'getAssets').returns(assets);
     //     videoController = new VideoController(s3);
 
     //     const assetsreturned = await videoController.getAssets(mockRequest, mockResponse, () => {});
     //     console.log(assetsreturned);
     //     assetsreturned.has.status(404);
 
     // })
 
  //    it.only('Should return metadata for an assets in the S3 bucket', async () => {
  //      const metadata = {"AcceptRanges":"bytes","LastModified":"2021-09-09T12:47:36.000Z","ContentLength":53397323,"ETag":"\"f842de0b6b298469b7a883162443b7a4-11\"","ContentType":"application/octet-stream","Metadata":{"ffprobe":{"streams":[{"index":0,"codec_name":"h264","codec_long_name":"H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10","profile":"High","codec_type":"video","codec_time_base":"50/2997","codec_tag_string":"avc1","codec_tag":"0x31637661","width":1280,"height":720,"coded_width":1280,"coded_height":720,"has_b_frames":2,"sample_aspect_ratio":"1:1","display_aspect_ratio":"16:9","pix_fmt":"yuv420p","level":31,"color_range":"tv","color_space":"bt709","color_transfer":"bt709","color_primaries":"bt709","chroma_location":"left","refs":1,"is_avc":"true","nal_length_size":"4","r_frame_rate":"2997/100","avg_frame_rate":"2997/100","time_base":"1/11988","start_pts":800,"start_time":"0.066733","duration_ts":1599200,"duration":"133.400067","bit_rate":"3068591","bits_per_raw_sample":"8","disposition":{"default":1,"dub":0,"original":0,"comment":0,"lyrics":0,"karaoke":0,"forced":0,"hearing_impaired":0,"visual_impaired":0,"clean_effects":0,"attached_pic":0,"timed_thumbnails":0},"tags":{"language":"und","handler_name":"ISO Media file produced by Google Inc. Created on: 11/06/2019."}},{"index":1,"codec_name":"aac","codec_long_name":"AAC (Advanced Audio Coding)","profile":"LC","codec_type":"audio","codec_time_base":"1/44100","codec_tag_string":"mp4a","codec_tag":"0x6134706d","sample_fmt":"fltp","sample_rate":"44100","channels":2,"channel_layout":"stereo","bits_per_sample":0,"r_frame_rate":"0/0","avg_frame_rate":"0/0","time_base":"1/44100","start_pts":0,"start_time":"0.000000","duration_ts":5867262,"duration":"133.044490","bit_rate":"129666","max_bit_rate":"128000","disposition":{"default":1,"dub":0,"original":0,"comment":0,"lyrics":0,"karaoke":0,"forced":0,"hearing_impaired":0,"visual_impaired":0,"clean_effects":0,"attached_pic":0,"timed_thumbnails":0},"tags":{"language":"eng","handler_name":"ISO Media file produced by Google Inc. Created on: 11/06/2019."}}]}}}
  //      const s3 = new S3Client();
  //      const stub = sinon.stub(s3, 'getMetadata').returns(metadata);
  //      const expected = {message: "Successful", data: metadata}
 
  //      videoController = new VideoController(s3);
  //      const assetsreturned = await videoController.getMetadata(mockRequest, mockResponse, () => {});
 
  //      assert.deepEqual(assetsreturned, expected);
 
  //  });
  })