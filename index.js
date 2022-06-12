const pdfUtil = require("pdf-to-text");
const fs = require("fs");
const util = require("./util");
const bankStructure = require("./bank_document_structure");

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
  let destFilename = "";

  companiesData.forEach((element) => {
    if (element.ziro_racun && element.ziro_racun !== "null") {
      //TODO: Ovdje pozvati provjere za svaku od banaka i vratiti putanju u koju se prebacuje fajl.
      if (content.indexOf(element.ziro_racun) !== -1 && !destFilename) {
        numberOfMatches++;
        companyName = element.sinonim;
        companyFolder = element.folder;
        companyAccountNumber = element.ziro_racun;
        multipleCompanyNames += companyName + ", ";
        multipleCompanyAccounts += companyAccountNumber + ", ";
        destFilename = bankStructure.findAccountNumberInSpecificLine(element.ziro_racun, content);
      }
    }
  });

  if (destFilename) {
    let destinationFile = `${writeDirectoryPath}/${companyFolder}/${destFilename}`;
    let logMessage = `Uspjeh: "${filename}", kompanija: "${companyName}", žiro račun: "${companyAccountNumber}", putanja: "${destinationFile}"`;
    moveFiles(readDirectoryPath + filename, destinationFile);
    util.writeLog(logMessage, false);
  } else {
    let logMessage = `Nije nađen nijedan žiro račun za fajl: "${filename}"`;
    util.writeLog(logMessage, true);
  }
}

function moveFiles(sourceDir, destinationDir) {
  if (util.makeDir(destinationDir)) {
    fs.rename(sourceDir, destinationDir, function (err) {
      if (err) util.processError(err);
    });
  }
}

/*moveFiles(
  "C:/test/input/Forma Addiko Banka.pdf",
  "C:/test/output/IZVODI Z.R. ELEKTRONSKA ARHIVA 021/027 BP Proing/2022/Domaci/Addiko/555.pdf"
);*/
