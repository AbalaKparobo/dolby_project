const fs = require('fs');
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');
const s3Connect = require('../configs/awsConnection');

exports.uploadVideo = (req, res) => {

    const filePath = req.file.path;
    // using the file extension determine what type of file, so it can be added to the right folder
    // const filename = `videos/${req.file.originalname}`;
    const filename = `${req.file.originalname}`;

    ffprobe(filePath, { path: ffprobeStatic.path })
    .then(info => {
        return s3Connect.uploadToBucket(filePath, filename, info);
    })
    .then(data => {
        let message, status, filename;
        if (filePath) {
           fs.rmSync(filePath, { recursive: true });
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

exports.getAssets = (req, res) => {
    s3Connect.getAssets()
    .then(response => {
        if(response && response.Contents) {
            let contents = response.Contents;
            let keys = [];
            contents.forEach(cnt => {
                keys.push(cnt["Key"])
            })
            return keys;
        }
    })
    .then(names => {
        let message, status;
        if(names.length > 0) {
            message = "Successful";
            status = 200;

        } else {
            message = "No Records Found";
            status = 404; // Or any agreed status
        }
        let response = {
            message: message,
            videos: names
        };
        res.status(status).send(response);
    })
    .catch(err => console.log(err));
}

exports.getMetadata = (req, res) => {
    const key = req.query.asset;

    if(!key) {
        return res.status(400).send({message: "Invalid value for asset"});
    };

    s3Connect.getMetadata(key)
    .then(data => {
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
    })
    .catch(err => console.log("Error" + err));
}