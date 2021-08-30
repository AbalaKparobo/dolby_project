const express = require("express");
const multer = require('multer');
const router = express.Router();
const upload = multer({dest: "public/data/uploads"});

// returns information about the API. Version, description of other routes, etc. Whatever you’d like
router.get("/info", );

// Retrieve the names of all uploaded assets.
router.get("/assets", );

// Returns the metadata about a specific asset
router.get("/metadata", );

// post an mp4 (multipart form data), which the server will upload to the storage of your choice along with ffprobe metadata. This route should return the name of the asset that is being uploaded to bucket storage along with the ffprobe metadata.
router.post("/upload", upload.array("files"), (req, res) => {
    console.log(req.body);
    console.log(req.files);
});

module.exports = router;