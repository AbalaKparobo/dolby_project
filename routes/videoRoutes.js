const fs = require('fs');
const os = require('os');
const path = require('path');
const express = require("express");
const multer = require('multer');

const router = express.Router();
const videoController = require('../controllers/videoController');
const serviceController = require('../controllers/serviceController');

let tmpDir;
const appPrefix = 'vidoeuploader-software';
try {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix));
  // the rest of your app goes here
}
catch {
  // handle error
}

const upload = multer({dest: tmpDir});


// returns information about the API. Version, description of other routes, etc. Whatever you’d like
router.get("/info", serviceController.aboutApp);

// Retrieve the names of all uploaded assets.
router.get("/assets", videoController.getAssets);

// Returns the metadata about a specific asset
router.get("/metadata", );

// post an mp4 (multipart form data), which the server will upload to the storage of your choice along with ffprobe metadata. This route should return the name of the asset that is being uploaded to bucket storage along with the ffprobe metadata.
router.post("/upload", upload.single("files"), videoController.uploadVideo);

module.exports = router;