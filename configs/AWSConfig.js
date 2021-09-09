const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const Stream  = require('stream');

module.exports = class AWSConnect {

    constructor() {
        this.init();
    }
    
    init() {

        try {
            AWS.config.update({
                accessKeyId: process.env.ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
                region: process.env.REGION
            });
            
            // this.BUCKET_NAME = process.env.BUCKET_NAME;
            this.BUCKET_NAME = 'videos-folder-001';

            this.s3 = new AWS.S3();
            this.initBucket();
        } catch(err) {console.log(err)}
        
    }

    initBucket = async (bucket = this.BUCKET_NAME) => {
       
        const params = {
            Bucket: bucket
        }
        try {
            await this.s3.headBucket(params).promise();
        } catch(err) { 
            await this.s3.createBucket(params).promise();
        }
    }
    
    uploadToBucket = async (file, key, metadata, bucket = this.BUCKET_NAME) => {

        let fileStream = fs.createReadStream(file);
        fileStream.on('error', function(err) {
            console.log('File Error', err);
        });
        const params = {
            Bucket: bucket,
            Key: key,
            Body: fileStream,
            Metadata: {
                ffprobe: JSON.stringify(metadata)
            }
        };
        try {
            const data = await this.s3.upload(params).promise();
            return data;
        } catch(err) {console.log(err)}
    }
    
    getAssets = async (bucket = this.BUCKET_NAME) => {

        const params = {
            Bucket : bucket,
        };
        try {
            const data = await this.s3.listObjects(params).promise();
            return data;
        } catch(err) {console.log(err)}
    }
    
    getAsset = async (key, bucket = this.BUCKET_NAME) => {

        const params = {
            Bucket: bucket,
            Key: key
        };
        try {
            const data = await this.s3.getObject(params).promise();
            return data;
        } catch(err) {console.log(err)}
    }
    
    getMetadata = async (key, bucket = this.BUCKET_NAME) => {

        const params = {
            Bucket: bucket, 
            Key: key
        };
        try {
            const data = await this.s3.headObject(params).promise();
            return data;
        } catch(err) {console.log(err)}
    }

    getObjectStream = (key, bucket = this.BUCKET_NAME) => {

        try {
            return this.s3.getObject({
                Bucket: bucket,
                Key: key
              }).createReadStream()
        } catch(err) {console.log(err)}
      }

      uploadFromStream = (key, body, metadata, bucket = this.BUCKET_NAME) =>  {
        const pass = new Stream.PassThrough();
      
        const params = {
            Bucket: bucket,
            Key: key,
            Body: body,
            Metadata: {
                ffprobe: JSON.stringify(metadata)
            }
        };
        try {
            const upload =  this.s3.upload(params).promise();
            return upload;

        } catch (err) { console.log(err) }
    }

}