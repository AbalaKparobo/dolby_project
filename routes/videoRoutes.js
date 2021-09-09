const fs = require('fs');
const os = require('os');
const path = require('path');
const multer = require('multer');
const express = require("express");

const S3client = require('../configs/AWSConfig');
const VideoControllers = require('../controllers/VideoControllers');
const serviceController = require('../controllers/serviceController');

class VideoRoute {

  constructor(SController, VController) {
    this.vController = VController;
    this.SController = SController;
    this.init();
    const upload = multer({dest: tmpDir});
    this.router = express.Router();
  }

  init() {
    // let tmpDir;
    // const appPrefix = 'vidoeuploader';
    // try {
    //   tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix));
    // } catch(err) {
    //   throw err;
    // }
  }

  // this.router.get("/info", serviceController.aboutApp);

  // router.get("/assets", videoController.getAssets);

  // router.get("/metadata", videoController.getMetadata);

  // router.post("/upload", upload.single("files"), videoController.uploadVideo);

  // router.post("/encode", videoController.encodeAsset);

  // router.get("/:key", videoController.getAsset)

  // module.exports = router;
}

const router = express.Router();

let tmpDir;
const appPrefix = 'vidoeuploader';
try {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix));
} catch(err) {
  throw err;
}

const upload = multer({dest: tmpDir});

const videoController = new VideoControllers(new S3client);

router.get("/info", serviceController.aboutApp);

router.get("/assets", videoController.getAssets);

router.get("/metadata", videoController.getMetadata);

router.post("/upload", upload.single("files"), videoController.uploadVideo);

router.post("/encode", videoController.encodeAsset);

router.get("/:key", videoController.getAsset)

module.exports = router;