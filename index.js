let pdfUtil = require("pdf-to-text");
let fs = require("fs");

let readDirectoryPath = "c:/test/input/";
let writeDirectoryPath = "c:/test/output/";
/*pdfUtil.info(pdf_path, function (err, info) {
  if (err) throw err;
  console.log(info);
});*/
/*pdfUtil.pdfToText(pdf_path, function (err, data) {
  if (err) throw err;
  console.log(data); //print text
});*/

function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function (err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function (filename) {
      if (filename.toLowerCase().endsWith(".pdf")) {
        pdfUtil.pdfToText(readDirectoryPath + filename, function (err, data) {
          if (err) throw err;
          onFileContent(filename, data);
        });
      }
    });
  });
}

readFiles(readDirectoryPath, fileContent, processError);

function fileContent(filename, content) {
  fs.writeFile(writeDirectoryPath + filename + ".txt", content, () => {});
  //console.log("\x1b[31m", filename);
  //console.log("\x1b[37m", content);
}

function processError(error) {
  console.error("ERROR: ", error);
}
