const fs = require("fs");

const createReadStream = (filePath) => {

    return fs.createReadStream(filePath);

};

module.exports = {
    createReadStream
};