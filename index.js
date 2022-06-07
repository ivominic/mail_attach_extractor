let pdfUtil = require("pdf-to-text");
let fs = require("fs");

let folderData = JSON.parse(fs.readFileSync("data/json/folders.json", { encoding: "utf8" }));

let companiesData = JSON.parse(fs.readFileSync("data/json/companies.json", { encoding: "utf8" }));

let readDirectoryPath = folderData.readDir;
let writeDirectoryPath = folderData.writeDir;
//console.log(readDirectoryPath, writeDirectoryPath);
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
  let numberOfMatches = 0;
  let companyName = "";
  let companyFolder = "";
  let companyAccountNumber = "";
  let multipleCompanyNames = "";
  let multipleCompanyAccounts = "";

  companiesData.forEach((element) => {
    if (element.ziro_racun && element.ziro_racun !== "null") {
      //console.log("\x1b[37m", element.ziro_racun);
      if (content.indexOf(element.ziro_racun) !== -1) {
        numberOfMatches++;
        companyName = element.sinonim;
        companyFolder = element.folder;
        companyAccountNumber = element.ziro_racun;
        multipleCompanyNames += companyName + ", ";
        multipleCompanyAccounts += companyAccountNumber + ", ";
        //console.log("\x1b[31m", companyName, companyAccountNumber);
      }
    }
  });

  if (numberOfMatches !== 1) {
    if (numberOfMatches === 0) {
      console.log("\x1b[31m", "Nije nađen nijedan žiro račun za fajl: ", filename);
    } else {
      console.log(
        "\x1b[31m",
        "Za fajl:",
        filename,
        "nađene su sljedeće kompanije:",
        multipleCompanyNames,
        " i žr:",
        multipleCompanyAccounts
      );
    }
  } else {
    console.log("\x1b[37m", filename, companyName, companyAccountNumber);
  }
}

function processError(error) {
  console.error("ERROR: ", error);
}
