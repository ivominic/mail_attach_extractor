const fs = require("fs");
const os = require("os");

function processError(error) {
  let now = new Date();
  let formatedMessage = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}  ` + error + os.EOL;
  fs.appendFileSync("data/error/" + now.toDateString() + ".log", formatedMessage);
  console.log("\x1b[31m", error);
}

function writeLog(message, color) {
  let now = new Date();
  let formatedMessage = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}  ` + message + os.EOL;
  fs.appendFileSync("data/log/" + now.toDateString() + ".log", formatedMessage);
  if (color) {
    console.log("\x1b[31m", message);
  } else {
    console.log("\x1b[37m", message);
  }
}

module.exports = {
  processError,
  writeLog,
};
