const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
});

const BUCKET_NAME = process.env.BUCKET_NAME;

const s3 = new AWS.S3();


exports.connectS3 = () => {
    bucketExist(BUCKET_NAME)
    .then(data => {
        console.log(data);
    })
    .catch(err => console.log(err))
    //     createBucket(BUCKET_NAME);
    // }
    // console.log("AWS S3 bucket ready");
}

const bucketExist = async (bucket = BUCKET_NAME) => {
    // should return 200 ok else doesnot exit or no access
    const params = {
        Bucket: bucket
    };
    const headBucket = promisify(s3.headBucket.bind(s3));
    try {
        let data = await headBucket(params);
        console.log(data);
        return data;
    } catch(err) {console.log(err)}
    //    s3.headBucket(params, function(err, data) {
    //      if (err) console.log(err, err.stack); // an error occurred
    //      else     console.log(data);           // successful response
    //    });
};

const createBucket = async(bucketName = BUCKET_NAME) => {

    let bucketParams = {
        Bucket : bucketName
    };
    const createBucket = promisify(s3.createBucket.bind(s3))
    try {
        const data = await createBucket(bucketParams)
        return data;
    } catch(err) {console.log(err)}
    
    // return s3.createBucket(bucketParams, function(err, data) {
    //     if (err) {
    //       console.log("Error", err);
    //     } else {
    //       return data.Location;
    //     }
    // });
};

function fetchBuckets(){
    let result = [];
    s3.listBuckets(function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
            // console.log(data.Buckets);
          result = data.Buckets;
        }
      });
    return result;
};

exports.uploadToBucket = async (file, key, metadata, bucket = BUCKET_NAME) => {

    let fileStream = fs.createReadStream(file);
    fileStream.on('error', function(err) {
        console.log('File Error', err);
    });
    let uploadParams = {
        Bucket: bucket,
        Key: key,
        Body: fileStream,
        Metadata: {
            ffprobe: JSON.stringify(metadata)
        }
    };
    const upload = promisify(s3.upload.bind(s3));
    try {
        let data = await upload(uploadParams);
        return data;
    } catch(err) {console.log(err)}
}

exports.getAssets = async (bucket = BUCKET_NAME) => {
    const bucketParams = {
        Bucket : bucket,
    };
    const listObjects = promisify(s3.listObjects.bind(s3));
    try {
        let data = await listObjects(bucketParams);
        return data;
    } catch(err) {console.log(err)}
}

exports.getAsset = async (key, bucket = BUCKET_NAME) => {
    const params = {
        Bucket: bucket,
        Key: key
    };
    const getObject = promisify(s3.getObject.bind(s3));
    try {
        let data = await getObject(params);
        return data;
    } catch(err) {console.log(err)}
}

exports.getMetadata = async (key, bucket = BUCKET_NAME) => {
    const params = {
        Bucket: bucket, 
        Key: key
    };
    const headObject = promisify(s3.headObject.bind(s3));
    try {
        let data = await headObject(params);
        return data;
    } catch(err) {console.log(err)}
}