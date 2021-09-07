const fs = require('fs');
const os = require('os');
const path = require('path');
const multer = require('multer');
const express = require("express");

const router = express.Router();
// const videoController = require('../controllers/videoController');
const serviceController = require('../controllers/serviceController');
const VideoControllers = require('../controllers/VideoControllers');
const S3client = require('../configs/AWSConfig');

let tmpDir;
const appPrefix = 'vidoeuploader';
try {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix));
}
catch(err) {
  // properly handle error
  console.log(err);
}

const upload = multer({dest: tmpDir});

const videoController = new VideoControllers(new S3client);

router.get("/info", serviceController.aboutApp);

router.get("/assets", videoController.getAssets);

router.get("/metadata", videoController.getMetadata);

router.post("/upload", upload.single("files"), videoController.uploadVideo);

// router.post("/encode", videoController.encodeAsset);

module.exports = router;