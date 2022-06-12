const util = require("./util");

function findAccountNumberInSpecificLine(accountNumber, content) {
  let contentArray = util.contentToArrayByLine(content);
  let filename = "";
  !filename && (filename = domesticAddiko(accountNumber, contentArray));
  console.log("filename", filename);
  return filename;
}

function domesticAddiko(accountNumber, contentArray) {
  let retVal = "";
  let location = contentArray[9];
  console.log("Tekst za pretragu:", location);
  console.log("acc_no", accountNumber);
  console.log("tekst", location.substring(73, 90));
  if (accountNumber === location.substring(73, 90)) {
    console.log("NAŠAO!!!!!!!");
    retVal = accountNumber + ".pdf";
  }
  return retVal;
}

module.exports = {
  findAccountNumberInSpecificLine,
};
