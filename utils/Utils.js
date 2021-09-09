const fs = require('fs');
const path = require('path');

module.exports = class Utils {

    rmAsync (filePath, recursive) {
        return new Promise((res, rej) => {
            fs.rm(filePath, {recursive: recursive}, err => { 
                if (err) {
                    return rej(err)
                } 
                res()
            });
        });
    }

    createTempFile (name) {
        return fs.createWriteStream(path.join(__dirname, '../public/temp/' + name));
    }
}