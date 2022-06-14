const fs = require("fs");
const os = require("os");

function processError(error) {
  let now = new Date();
  let formatedMessage = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}  ` + error + os.EOL;
  fs.appendFileSync("data/error/" + formatLogFilename(), formatedMessage);
  console.log("\x1b[31m", error);
}

function writeLog(message, color) {
  let now = new Date();
  let formatedMessage = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}  ` + message + os.EOL;
  fs.appendFileSync("data/log/" + formatLogFilename(), formatedMessage);
  if (color) {
    console.log("\x1b[31m", message);
  } else {
    console.log("\x1b[37m", message);
  }
}

function makeDir(folder) {
  let retval = true;
  fs.mkdirSync(folder, { recursive: true });
  return retval;
}

function contentToArrayByLine(content) {
  return content.split(os.EOL);
}

function formatLogFilename() {
  let now = new Date();
  let month = now.getMonth() + 1;
  month < 10 && (month = `0${month}`);
  return `${now.getFullYear()}.${month}.${now.getDate()}.log`;
}

module.exports = {
  processError,
  writeLog,
  makeDir,
  contentToArrayByLine,
};
