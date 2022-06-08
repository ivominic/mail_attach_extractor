const pdfUtil = require("pdf-to-text");
const fs = require("fs");
const util = require("./util");

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
      util.processError(err);
      return;
    }
    filenames.forEach(function (filename) {
      if (filename.toLowerCase().endsWith(".pdf")) {
        pdfUtil.pdfToText(readDirectoryPath + filename, function (err, data) {
          if (err) util.processError(err);
          onFileContent(filename, data);
        });
      }
    });
  });
}

readFiles(readDirectoryPath, fileContent, util.processError);

function fileContent(filename, content) {
  let numberOfMatches = 0;
  let companyName = "";
  let companyFolder = "";
  let companyAccountNumber = "";
  let multipleCompanyNames = "";
  let multipleCompanyAccounts = "";

  companiesData.forEach((element) => {
    if (element.ziro_racun && element.ziro_racun !== "null") {
      //TODO: Ovdje pozvati provjere za svaku od banaka i vratiti putanju u koju se prebacuje fajl.
      if (content.indexOf(element.ziro_racun) !== -1) {
        numberOfMatches++;
        companyName = element.sinonim;
        companyFolder = element.folder;
        companyAccountNumber = element.ziro_racun;
        multipleCompanyNames += companyName + ", ";
        multipleCompanyAccounts += companyAccountNumber + ", ";
      }
    }
  });

  if (numberOfMatches !== 1) {
    if (numberOfMatches === 0) {
      let logMessage = `Nije nađen nijedan žiro račun za fajl: "${filename}"`;
      util.writeLog(logMessage, true);
    } else {
      let logMessage = `Višestruki za: "${filename}", kompanije: "${multipleCompanyNames}", žr: "${multipleCompanyAccounts}"`;
      util.writeLog(logMessage, true);
    }
  } else {
    let logMessage = `Uspjeh: "${filename}", kompanija: "${companyName}", žiro račun: "${companyAccountNumber}"`;
    let destinationDir = `${writeDirectoryPath}/${companyFolder}/`;
    moveFiles(filename, readDirectoryPath, destinationDir);
    util.writeLog(logMessage, false);
  }
}

function moveFiles(filename, sourceDir, destinationDir) {
  if (util.makeDir(destinationDir)) {
    fs.rename(sourceDir + filename, destinationDir + filename, function (err) {
      if (err) util.processError(err);
    });
  }
}
