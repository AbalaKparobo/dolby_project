const fs = require('fs');

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
}