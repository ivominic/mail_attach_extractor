const pdfUtil = require("pdf-to-text");
const fs = require("fs");

const pdf_path = "d:/test/Forma Ziirat Banka.pdf";
/*pdfUtil.info(pdf_path, function (err, info) {
  if (err) throw err;
  console.log(info);
});*/

const readAllFiles = (directoryPath) => {
  fs.readdir(directoryPath, function (err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function (filename) {
      fs.readFile(directoryPath + filename, "utf-8", function (err, content1) {
        if (err) {
          console.error(filename, err);
          return;
        }
        if (filename.endsWith(".pdf")) {
          pdfUtil.pdfToText(directoryPath + filename, function (err, content) {
            if (err) throw err;
            checkFileContent(filename, content);
          });
        }
      });
    });
  });
};

const checkFileContent = (filename, content) => {
  console.log(filename, content.length);
};

readAllFiles("d:/test/");
