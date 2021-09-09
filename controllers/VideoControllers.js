const fs = require('fs');
const path = require('path');
const Stream  = require('stream');
const ffprobe = require('ffprobe');
const Promise = require('bluebird');
const Utils = require('../utils/Utils')
const ffmpeg = require('fluent-ffmpeg');
const ffprobeStatic = require('ffprobe-static');
const createError = require('http-errors');

module.exports = class VideoControllers {
    constructor(s3client) {
        this.s3client = s3client;
        this.utils = new Utils
    }

    uploadVideo = (req, res, next) => {

        const filePath = req.file.path;
        // using the file extension determine what type of file, so it can be added to the right folder
        // const filename = `videos/${req.file.originalname}`;
        const filename = `${req.file.originalname}`;
    
        ffprobe(filePath, { path: ffprobeStatic.path })
        .then(info => {
            console.log("successfully ran ffprobe");
            return this.s3client.uploadToBucket(filePath, filename, info);
        })
        .then(data => {
            let message, status, filename;
            if (filePath) {
            this.utils.rmAsync(filePath, true);
            }
            if(data) {
                message = "Successful";
                status = 200;
                filename = data["Key"];
    
            } else {
                return next(createError(404, "Error uploading file, please try again"))
            }
            let response = {
                message: message,
                video: filename
            };
            res.status(status).send(response);
        })
        .catch(err => next(400, err));
    }
    
    getAssets = async (req, res, next) => {

        try {
            const data = await this.s3client.getAssets();
            const keys = [];
            if(data && data.Contents) {
                const contents = data.Contents;
                contents.forEach(cnt => {
                    keys.push(cnt["Key"])
                })
            }
            let message, status;
            if(keys.length > 0) {
                message = "Successful";
                status = 200;
            } else {
                // message = "No Records Found";
                // status = 404; // Or any agreed status
                return next(createError(404, "No Records Found"));

            }
            let response = {
                message: message,
                data: keys
            };
            return res.status(status).json(response);
        } catch(err) {
            next(createError(400, err));
        }
    }
    
    getMetadata = async (req, res, next) => {
        const key = req.query.asset;
    
        if(!key) {
            return next(createError(400, "Invalid value for asset"));
        };
    
        try {
            const data = await this.s3client.getMetadata(key)
        
            let message, status;
            if(data) {
                message = "Successful";
                status = 200;
    
            } else {
                // message = "No Records Found";
                // status = 404; // Or any agreed status
                return next(createError(404, "No Record Found"));
            }
            const response = {
                message: message,
                data: data
            }
            return res.status(status).json(response);
        
        } catch(err) {
            next(createError(400, err));
        }
    }

    getAsset = async (req, res, next) => {
        const key = req.params.key;
    
        if(!key) {
            return next(createError(400, "Invalid value for asset"));
        };
    
        try {
            const data = await this.s3client.getAsset(key);
            let message, status;
            if(data) {
                message = "Successful";
                status = 200;
    
            } else {
                // message = "No Records Found";
                // status = 404; // Or any agreed status
                return next(createError(404, "No Record Found"));
            }
            const response = {
                message: message,
                data: data
            }
            res.status(status).send(response);
        } catch(err) {
            next(createError(400, err));
        };
    }

    encodeAsset = async (req, res, next) => {

        const key = req.body.assetName;
        const videoCodec = req.body.videoCodec;
        const videoBitrate = req.body.videoBitrate;
        const audioCodec = "aac";
        const audioBitrate = "128k";

        if(!key) return next(createError(400, "Error: assetName is required"));
        if(!videoCodec) return next(createError(400, "Error: videoCodec is required"));
        if(!videoBitrate) return next(createError(400, "Error: videoBitrate is required"));

        try {
            const stream = this.s3client.getObjectStream(key);
            const filePath = path.join(__dirname, '../public/temp/');
            
            if (!fs.existsSync(filePath)){
                fs.mkdirSync(filePath);
            }
            if(stream) {
                let command = ffmpeg(stream)
                    .inputFormat("mp4")
                    .toFormat("mp4")
                    .videoBitrate(videoBitrate)
                    .videoCodec(videoCodec)
                    .audioCodec(audioCodec)
                    .audioBitrate(audioBitrate)
                    .outputOptions('-movflags frag_keyframe+empty_moov')
                  
                command = this.promisifyCommand(command, filePath, key);
                command()
                .then(stm => {
                    const filename = filePath + "/" + key;
                    return ffprobe(filename, { path: ffprobeStatic.path })
                })
                .then(meta => {
                    const filename = filePath + "/" + key;
                    return this.s3client.uploadToBucket(filename, key, meta);
                })
                .then(result => {
                    this.utils.rmAsync(filePath, true);
                    return res.status(200).json({message: "Successfully Updated " + key });
                })
                .catch(err => next(err))
            } else {
                return next(createError(404, "No Record Matching Provided assetName"))
            }
        } catch(err) {
            next(createError(400, err));    
        } finally {
            if(fs.existsSync(filePath)) {}
        }
    }

    promisifyCommand = (command, outputPath, filename) => {
       
        return Promise.promisify( (cb) => {
            command
            .on('progress', progress => console.log("Processing; " + progress.percent + "% done"))
            .on( 'end',   ()      => { cb(null)  } )
            .on( 'error', (error) => { cb(error) } )
            .save(outputPath + "/" + filename)
        })
    }

    async uploadFromStreamwithMetadata(key) {
        try {
            const stream = new Stream.PassThrough();
            const metadata = await ffprobe(stream);

            return this.s3client.uploadFromStream(key, stream, metadata);
        } catch (err) {throw err;}       

    }
}