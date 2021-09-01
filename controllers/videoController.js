const fs = require('fs');
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');
const s3Connect = require('../configs/awsConnection');

exports.uploadVideo = (req, res) => {
    console.log(req.file);
    const filePath = req.file.path;
    console.log(filePath);

    ffprobe(filePath, { path: ffprobeStatic.path })
    .then(info => {
        // console.log(info);
        return info;
    })
    .then(fileProbe => {
        console.log("recieved probe, starting upload trigger");
        console.log(filePath);
        s3Connect.uploadToBucket(filePath, fileProbe);
    })
    // .then(res => {
    //     const destination = req.file.destination;
    //     if (destination) {
    //         fs.rmSync(destination, { recursive: true });
    //     }
    // })
    .catch(err => console.log(err));
}

exports.getAssets = (req, res) => {
    s3Connect.getAssets();
    // get Contents [{},..] get {}.Key return [Key...]
}