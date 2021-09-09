exports.aboutApp = (req, res, next) => {
    res.status(200).send(about);
}

const about = {
    description: "The service is a demo video uploader",
    version: "V1",
    name: "AK-VideoUploader"
}