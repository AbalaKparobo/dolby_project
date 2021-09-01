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
    if(!bucketExist(BUCKET_NAME)) {
        createBucket(BUCKET_NAME);
    }
    console.log("AWS S3 bucket ready");
}


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
// const res = fetchBuckets();
// console.log(res);

function bucketExist(bucketName){
    const getBuckets = promisify(fetchBuckets);
    console.log(getBuckets);
    return getBuckets()
    .then(buckets => {
        buckets.forEach(bucket => {
            if(bucket == bucketName) {
                console.log(bucket);
                return true;
            }
        });
        return false;
    })
};
// let res2 = bucketExist(BUCKET_NAME);
// console.log(res2.re);

function createBucket(bucketName){

    let bucketParams = {
        Bucket : bucketName
    };
      
    return s3.createBucket(bucketParams, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          return data.Location;
        }
    });
};

exports.uploadToBucket = (file, metadata, bucket = BUCKET_NAME) => {
    console.log("starting upload");

    let uploadParams = {Bucket: bucket, Key: '', Body: '', metadata: metadata};

    let fileStream = fs.createReadStream(file);
    fileStream.on('error', function(err) {
        console.log('File Error', err);
    });
    uploadParams.Body = fileStream;
    uploadParams.Key = path.basename(file);

    // call S3 to retrieve upload file to specified bucket
    s3.upload (uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        } if (data) {
            console.log("Upload Success", data.Location);
        }
    });
}

exports.getAssets = (bucket = BUCKET_NAME) => {
    let bucketParams = {
        Bucket : bucket,
      };
      
      // Call S3 to obtain a list of the objects in the bucket
      s3.listObjects(bucketParams, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
    });
}
