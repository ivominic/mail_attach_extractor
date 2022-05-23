const pdfUtil = require("pdf-to-text");
const fs = require("fs");

const readAllFiles = (directoryPath) => {
  fs.readdir(directoryPath, function (err, filenames) {
    if (err) {
      console.error(err);
      return;
    }
    filenames.forEach(function (filename) {
      let currentPath = directoryPath + filename;
      if (filename.endsWith(".pdf")) {
        pdfUtil.pdfToText(currentPath, function (err, content) {
          if (err) throw err;
          checkFileContent(filename, content);
          let newPath = directoryPath + "new/";
          fs.mkdir(newPath, { recursive: true }, (err) => {
            if (err) throw err;
          });
          fs.rename(currentPath, newPath + filename, function (err) {
            if (err) throw err;
            console.log("Successfully moved!", newPath + filename);
          });
        });
      }
    });
  });
};

const checkFileContent = (filename, content) => {
  console.log(filename, content.length);
};

readAllFiles("d:/test/");
