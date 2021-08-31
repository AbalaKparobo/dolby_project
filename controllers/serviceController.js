exports.aboutApp = (req, res) => {
    res.send(about);
}

const about = {
    description: "The service is a demo video uploader",
    version: "V1",
    name: "AK-VideoUploader"
}