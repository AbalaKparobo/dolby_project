const fs = require('fs');
const ffprobe = require('ffprobe');
const Utils = require('../utils/Utils')
const ffmpeg = require('fluent-ffmpeg');
const ffprobeStatic = require('ffprobe-static');

module.exports = class VideoControllers {
    constructor(s3client) {
        this.s3client = s3client;
    }

    uploadVideo = (req, res) => {

        const filePath = req.file.path;
        // using the file extension determine what type of file, so it can be added to the right folder
        // const filename = `videos/${req.file.originalname}`;
        const filename = `${req.file.originalname}`;
    
        ffprobe(filePath, { path: ffprobeStatic.path })
        .then(info => {
            return this.s3client.uploadToBucket(filePath, filename, info);
        })
        .then(data => {
            let message, status, filename;
            if (filePath) {
            //    fs.rmSync(filePath, { recursive: true });
            const util = new Utils();
            util.rmAsync(filePath, true);
            }
            if(data) {
                message = "Successful";
                status = 200;
                filename = data["Key"];
    
            } else {
                message = "No Records Found";
                status = 404; // Or any agreed status
            }
            let response = {
                message: message,
                video: filename
            };
            res.status(status).send(response);
        })
        .catch(err => console.log(err));
    }
    
    getAssets = async (req, res) => {

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
                message = "No Records Found";
                status = 404; // Or any agreed status
            }
            let response = {
                message: message,
                data: keys
            };
            return res.status(status).json(response);
        } catch(err) {
            console.log(err);
        }
    }
    
    getMetadata = async (req, res) => {
        const key = req.query.asset;
    
        if(!key) {
            return res.status(400).json({message: "Invalid value for asset"});
        };
    
        try {
            const data = await this.s3client.getMetadata(key)
        
            let message, status;
            if(data) {
                message = "Successful";
                status = 200;
    
            } else {
                message = "No Records Found";
                status = 404; // Or any agreed status
            }
            const response = {
                message: message,
                data: data
            }
            res.status(status).json(response);
        
        } catch(err) {console.log("Error" + err)}
    }

    getAsset = async (req, res) => {
        const key = req.params.key;
    
        if(!key) {
            return res.status(400).send({message: "Invalid value for asset"});
        };
    
        try {
            const data = await this.s3client.getAsset(key);
            let message, status;
            if(data) {
                message = "Successful";
                status = 200;
    
            } else {
                message = "No Records Found";
                status = 404; // Or any agreed status
            }
            const response = {
                message: message,
                data: data
            }
            res.status(status).send(response);
        } catch(err) {
            console.log("Error" + err)
        };
    }

    encodeAsset = async (req, res) => {

        const key = req.body.assetName;
        const videoCodec = req.body.videoCodec;
        const videoBitrate = req.body.videoBitrate;
        const audioCodec = "aac";
        const audioBitrate = "128k";

        if(!key) return res.status(400).json({message: "Error: assetName is required"});
        if(!videoCodec) return res.status(400).json({message: "Error: videoCodec is required"});
        if(!videoBitrate) return res.status(400).json({message: "Error: videoBitrate is required"});

        try {
            const stream = this.s3client.getObjectStream(key);
            if(stream) {
                ffmpeg(stream)
                .inputFormat("mp4")
                .outputOptions('-movflags frag_keyframe+empty_moov')
                .toFormat("mp4")
                .videoBitrate(videoBitrate)
                .videoCodec(videoCodec)
                .audioCodec(audioCodec)
                .audioBitrate(audioBitrate)
                .pipe(this.s3client.uploadFromStream(key))
                .on('end', () => { 
                    console.log("ffmpeg job ended");
                    return res.status(200).json({message: "Successfully Updated " + key });
                })
            }
        } catch(err) {console.log(err)}
    }
}