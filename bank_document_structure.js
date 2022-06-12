const util = require("./util");

function findAccountNumberInSpecificLine(accountNumber, content) {
  let contentArray = util.contentToArrayByLine(content);
  let filename = "";
  !filename && (filename = domesticAddiko(accountNumber, contentArray));
  !filename && (filename = domesticCKB(accountNumber, contentArray));
  !filename && (filename = foreignCKB(accountNumber, contentArray));
  console.log("filename", filename);
  return filename;
}

function domesticAddiko(accountNumber, contentArray) {
  let retVal = "";
  let accountPosition = contentArray[9].indexOf(" za račun ") + 10;
  let datePosition = contentArray[10].indexOf(" na dan ") + 8;
  let numberPosition = contentArray[9].indexOf("Izvod broj ") + 11;
  if (accountPosition >= 10 || datePosition >= 8 || numberPosition >= 11) {
    let accountValue = contentArray[9].substring(accountPosition, accountPosition + 18).trim();
    let dateValue = contentArray[10].substring(datePosition, datePosition + 18).trim();
    let numberValue = parseInt(contentArray[9].substring(numberPosition, numberPosition + 3).trim());
    if (accountNumber === accountValue) {
      retVal = `br.${numberValue} od ${dateValue}.pdf`;
    }
  }
  return retVal;
}

function domesticCKB(accountNumber, contentArray) {
  let retVal = "";
  let accountPosition = contentArray[0].indexOf(" stanje računa ") + 15;
  let datePosition = contentArray[0].indexOf(" na dan ") + 8;
  let numberPosition = contentArray[0].indexOf("Izvod broj ") + 11;
  if (accountPosition >= 15 || datePosition >= 8 || numberPosition >= 11) {
    let accountValue = contentArray[0].substring(accountPosition, accountPosition + 18).trim();
    let dateValue = contentArray[0].substring(datePosition, datePosition + 18).trim();
    let numberValue = parseInt(contentArray[0].substring(numberPosition, numberPosition + 3).trim());
    if (accountNumber === accountValue) {
      retVal = `br.${numberValue} od ${dateValue}.pdf`;
    }
  }
  return retVal;
}

function foreignCKB(accountNumber, contentArray) {
  let retVal = "";
  let accountPosition = contentArray[4].indexOf("IBAN:") + 6;
  let datePosition = contentArray[0].indexOf(" na dan ") + 8;
  let numberPosition = contentArray[0].indexOf("Devizni izvod broj ") + 19;
  if (accountPosition >= 6 || datePosition >= 8 || numberPosition >= 19) {
    let accountValue = contentArray[4].substring(accountPosition, accountPosition + 22).trim();
    let dateValue = contentArray[0].substring(datePosition, datePosition + 18).trim();
    let numberValue = parseInt(contentArray[0].substring(numberPosition, numberPosition + 3).trim());
    if (accountNumber === accountValue) {
      retVal = `br.${numberValue} od ${dateValue}.pdf`;
    }
  }
  return retVal;
}

module.exports = {
  findAccountNumberInSpecificLine,
};
