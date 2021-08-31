const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');

exports.uploadVideo = (req, res) => {
    console.log(req.file);
    const filePath = req.file.path;
    console.log(filePath);

    ffprobe(filePath, { path: ffprobeStatic.path })
    .then(info => {
        console.log(info);
    })
    .catch(err => console.log(err));
}