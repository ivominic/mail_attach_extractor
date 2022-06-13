const util = require("./util");

function findAccountNumberInSpecificLine(accountNumber, content) {
  let contentArray = util.contentToArrayByLine(content);
  let filename = "";
  console.log("Account number", accountNumber);
  !filename && (filename = domesticAddiko(accountNumber, contentArray));
  !filename && (filename = domesticCKB(accountNumber, contentArray));
  !filename && (filename = domesticHipotekarna(accountNumber, contentArray));
  !filename && (filename = domesticLovcen(accountNumber, contentArray));
  !filename && (filename = domesticZiirat(accountNumber, contentArray));
  !filename && (filename = foreignCKB(accountNumber, contentArray));
  !filename && (filename = foreignHipotekarna(accountNumber, contentArray));
  !filename && (filename = foreignLovcen(accountNumber, contentArray));
  !filename && (filename = foreignZiirat(accountNumber, contentArray));
  console.log("filename", filename);
  return filename;
}

function domesticAddiko(accountNumber, contentArray) {
  let retVal = "";
  let accountPosition = contentArray[9].indexOf(" za račun ") + 10;
  let datePosition = contentArray[10].indexOf(" na dan ") + 8;
  let numberPosition = contentArray[9].indexOf("Izvod broj ") + 11;
  if (accountPosition >= 10 && datePosition >= 8 && numberPosition >= 11) {
    let accountValue = contentArray[9].substring(accountPosition, accountPosition + 18).trim();
    let dateValue = contentArray[10].substring(datePosition, datePosition + 10).trim();
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
  if (accountPosition >= 15 && datePosition >= 8 && numberPosition >= 11) {
    let accountValue = contentArray[0].substring(accountPosition, accountPosition + 18).trim();
    let dateValue = contentArray[0].substring(datePosition, datePosition + 10).trim();
    let numberValue = parseInt(contentArray[0].substring(numberPosition, numberPosition + 3).trim());
    if (accountNumber === accountValue) {
      retVal = `br.${numberValue} od ${dateValue}.pdf`;
    }
  }
  return retVal;
}

function domesticHipotekarna(accountNumber, contentArray) {
  //Not structured pdf correctly. Ask for better file!!!!!!!!!!!!!!!!!!!!!!
  let retVal = "";
  //let accountPosition = contentArray[3].indexOf("Broj računa: ") + 13;
  let accountPosition = 81;
  //let datePosition = contentArray[5].indexOf(" za dan ") + 8;
  let datePosition = 70;
  //let numberPosition = contentArray[5].indexOf("Izvod br. ") + 10;
  let numberPosition = 60;
  console.log(contentArray[3]);
  console.log(contentArray[5]);
  //if (accountPosition >= 13 && datePosition >= 8 && numberPosition >= 10) {
  if (contentArray[3].length >= 99 && contentArray[5].length >= 89) {
    let accountValue = contentArray[3].substring(accountPosition, accountPosition + 18).trim();
    let dateValue = contentArray[5].substring(datePosition).trim();
    let numberValue = parseInt(contentArray[5].substring(numberPosition, numberPosition + 5).trim());
    if (accountNumber === accountValue) {
      retVal = `br.${numberValue} od ${dateValue}.pdf`;
    }
  }
  return retVal;
}

function domesticLovcen(accountNumber, contentArray) {
  let retVal = "";
  let accountPosition = contentArray[13].indexOf("Račun: ") + 7;
  let datePosition = contentArray[10].indexOf("Datum:") + 6;
  let numberPosition = contentArray[9].indexOf("Izvod broj:") + 11;
  if (accountPosition >= 7 && datePosition >= 6 && numberPosition >= 11) {
    let accountValue = contentArray[13].substring(accountPosition, accountPosition + 40).trim();
    let dateValue = contentArray[10].substring(datePosition).trim();
    let numberValue = parseInt(contentArray[9].substring(numberPosition).trim());
    if (accountNumber === accountValue) {
      retVal = `br.${numberValue} od ${dateValue}.pdf`;
    }
  }
  return retVal;
}

function domesticZiirat(accountNumber, contentArray) {
  let retVal = "";
  let accountPosition = contentArray[4].indexOf("Račun: ") + 7;
  let datePosition = contentArray[1].indexOf(" NA DAN ") + 7;
  let numberPosition = contentArray[0].indexOf("IZVOD BROJ ") + 11;
  if (accountPosition >= 7 && datePosition >= 7 && numberPosition >= 11) {
    let accountValue = contentArray[4].substring(accountPosition, accountPosition + 30).trim();
    let dateValue = contentArray[1].substring(datePosition).trim();
    let numberValue = parseInt(contentArray[0].substring(numberPosition).trim());
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
  if (accountPosition >= 6 && datePosition >= 8 && numberPosition >= 19) {
    let accountValue = contentArray[4].substring(accountPosition, accountPosition + 22).trim();
    let dateValue = contentArray[0].substring(datePosition, datePosition + 10).trim();
    let numberValue = parseInt(contentArray[0].substring(numberPosition, numberPosition + 3).trim());
    if (accountNumber === accountValue) {
      retVal = `br.${numberValue} od ${dateValue}.pdf`;
    }
  }
  return retVal;
}

function foreignHipotekarna(accountNumber, contentArray) {
  //Not structured pdf correctly. Ask for better file!!!!!!!!!!!!!!!!!!!!!!
  let retVal = "";
  let accountPosition = contentArray[6].indexOf("IBAN ") + 13;
  //let datePosition = contentArray[5].indexOf(" za dan ") + 8;
  let datePosition = 123;
  //let numberPosition = contentArray[5].indexOf("Izvod br. ") + 10;
  let numberPosition = 131;
  console.log(contentArray[6]);
  //console.log(contentArray[8]);
  //console.log(contentArray[2]);
  console.log(contentArray[6].length);
  console.log(contentArray[8].length);
  console.log(contentArray[2].length);
  if (contentArray[6].length >= 122 && contentArray[8].length >= 133 && contentArray[2].length >= 133) {
    let accountValue = contentArray[6].substring(accountPosition).trim();
    let dateValue = contentArray[8].substring(datePosition).trim();
    let numberValue = parseInt(contentArray[2].substring(numberPosition, numberPosition + 5).trim());
    console.log("asdsadsa", accountValue);
    console.log("bbbbbbbb", accountNumber);
    if (accountNumber === accountValue) {
      retVal = `br.${numberValue} od ${dateValue}.pdf`;
    }
  }
  return retVal;
}

function foreignLovcen(accountNumber, contentArray) {
  let retVal = "";
  let accountValue = contentArray[10].trim();
  let dateValue = contentArray[11].trim();
  let numberValue = parseInt(contentArray[9].trim().substring(0, 3));
  if (accountNumber === accountValue) {
    retVal = `br.${numberValue} od ${dateValue}.pdf`;
  }
  return retVal;
}

function foreignZiirat(accountNumber, contentArray) {
  let retVal = "";
  let accountPosition = contentArray[6].indexOf("Račun: ") + 7;
  let accountValue = contentArray[6].substring(accountPosition, accountPosition + 30).trim();
  if (accountValue !== accountNumber) {
    accountValue = contentArray[7].trim();
  }
  let dateValue = contentArray[26].substring(40, 55).trim();
  let numberValue = parseInt(contentArray[0].substring(55, 58).trim());
  if (accountValue && dateValue && numberValue) {
    if (accountNumber === accountValue) {
      retVal = `br.${numberValue} od ${dateValue}.pdf`;
    }
  }
  return retVal;
}

module.exports = {
  findAccountNumberInSpecificLine,
};
