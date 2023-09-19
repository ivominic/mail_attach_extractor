const pdfUtil = require("pdf-to-text");
const fs = require("fs");
const util = require("./util");
const bankStructure = require("./bank_document_structure");
const html_parse = require("./html_parse");

let folderData = JSON.parse(fs.readFileSync("data/json/folders.json", { encoding: "utf8" }));

let companiesData = JSON.parse(fs.readFileSync("data/json/companies.json", { encoding: "utf8" }));

let readDirectoryPath = folderData.readDir;
let writeDirectoryPath = folderData.writeDir;
let writeBackupDirectoryPath = folderData.writeBackupDir;
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
      } else if (filename.toLowerCase().endsWith(".html") || filename.toLowerCase().endsWith(".htm")) {
        fs.readFile(readDirectoryPath + filename, "utf8", (err, data) => {
          if (err) {
            util.processError(err);
            return;
          }
          htmlFileContent(filename, data);
        });
      }
    });
  });

  //This should be in promise.then, to prevent exiting app before key press
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on("data", process.exit.bind(process, 0));
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
  let isAccountFound = false;

  if (content) {
    //fs.appendFileSync(readDirectoryPath + filename + ".txt", content);
    companiesData.forEach((element) => {
      if (element.ziro_racun && element.ziro_racun !== "null") {
        if (content.indexOf(element.ziro_racun) !== -1 && !destFilename) {
          isAccountFound = true;
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
      let destinationFile = `${writeDirectoryPath}/${companyFolder}/`;
      let destinationBackupFile = `${writeBackupDirectoryPath}/${companyFolder}/`;
      let logMessage = `Uspjeh: "${filename}", kompanija: "${companyName}", žiro račun: "${companyAccountNumber}", putanja: "${destinationFile}${destFilename}"`;
      moveFiles(readDirectoryPath + filename, destinationFile, destFilename, logMessage, destinationBackupFile);
    } else {
      let logMessage = `Nije nađen nijedan žiro račun za fajl: "${filename}"`;
      if (!isAccountFound) {
        logMessage += " - Ne postoji broj računa u bazi.";
      }
      util.writeLog(logMessage, true);
    }
  } else {
    let logMessage = `Sadržaj fajla: "${filename}" nije pročitan.`;
    util.writeLog(logMessage, true);
  }
}

async function moveFiles(sourceDir, destinationDir, destFilename, message, destinationBackupDir) {
  if (util.makeDir(destinationDir)) {
    if (fs.existsSync(destinationDir + destFilename)) {
      let logMessage = `UPOZORENJE!!!! "${sourceDir}" FAJL SA ISTIM NAZIVOM "${destFilename}" VEĆ POSTOJI NA PUTANJI (${destinationDir}).`;
      util.writeLog(logMessage, true);
    } else {
      await fs.copyFile(sourceDir, destinationDir + destFilename, function (err) {
        if (err) util.processError(err);
        util.writeLog(message, false);
      });
      util.makeDir(destinationBackupDir);
      await fs.copyFile(sourceDir, destinationBackupDir + destFilename, function (err) {
        if (err) util.processError(err);
      });
      fs.rm(sourceDir, (error) => {
        util.writeLog(error, true);
        util.processError(error);
      });
    }
  }
}

function htmlFileContent(filename, content) {
  console.log(filename);
  let numberOfMatches = 0;
  let companyName = "";
  let companyFolder = "";
  let companyAccountNumber = "";
  let multipleCompanyNames = "";
  let multipleCompanyAccounts = "";
  let destFilename = "";

  if (content) {
    //fs.appendFileSync(readDirectoryPath + filename + ".txt", content);
    companiesData.forEach((element) => {
      if (element.ziro_racun && element.ziro_racun !== "null") {
        if (content.indexOf(element.ziro_racun) !== -1 && !destFilename) {
          numberOfMatches++;
          companyName = element.sinonim;
          companyFolder = element.folder;
          companyAccountNumber = element.ziro_racun;
          multipleCompanyNames += companyName + ", ";
          multipleCompanyAccounts += companyAccountNumber + ", ";
          destFilename = html_parse.findAccountNumberInHtml(element.ziro_racun, content);
        }
      }
    });

    if (destFilename) {
      let destinationFile = `${writeDirectoryPath}/${companyFolder}/`;
      let logMessage = `Uspjeh: "${filename}", kompanija: "${companyName}", žiro račun: "${companyAccountNumber}", putanja: "${destinationFile}${destFilename}"`;
      moveFiles(readDirectoryPath + filename, destinationFile, destFilename, logMessage);
    } else {
      let logMessage = `Nije nađen nijedan žiro račun za fajl: "${filename}"`;
      util.writeLog(logMessage, true);
    }
  } else {
    let logMessage = `Sadržaj fajla: "${filename}" nije pročitan.`;
    util.writeLog(logMessage, true);
  }
}
