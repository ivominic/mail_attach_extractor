const util = require("./util");

function findAccountNumberInSpecificLine(accountNumber, content) {
  let contentArray = util.contentToArrayByLine(content);
  let filename = "";
  !filename && (filename = domesticAddiko(accountNumber, contentArray));
  !filename && (filename = domesticAdriatic(accountNumber, contentArray));
  !filename && (filename = domesticCKB(accountNumber, contentArray));
  !filename && (filename = domesticHipotekarna(accountNumber, contentArray));
  !filename && (filename = domesticLovcen(accountNumber, contentArray));
  !filename && (filename = domesticLovcenObsolete(accountNumber, contentArray));
  !filename && (filename = domesticNLB(accountNumber, contentArray));
  !filename && (filename = domesticNLB2(accountNumber, contentArray));
  !filename && (filename = domesticNLB3(accountNumber, contentArray));
  !filename && (filename = domesticNLB4(accountNumber, contentArray));
  !filename && (filename = domesticPrvaBanka(accountNumber, contentArray));
  !filename && (filename = domesticZapad(accountNumber, contentArray));
  !filename && (filename = domesticZiirat(accountNumber, contentArray));
  !filename && (filename = foreignAdriatic(accountNumber, contentArray));
  !filename && (filename = foreignAdriatic2(accountNumber, contentArray));
  !filename && (filename = foreignCKB(accountNumber, contentArray));
  !filename && (filename = foreignHipotekarna(accountNumber, contentArray));
  !filename && (filename = foreignHipotekarna2(accountNumber, contentArray));
  !filename && (filename = foreignLovcen(accountNumber, contentArray));
  !filename && (filename = foreignNLB(accountNumber, contentArray));
  !filename && (filename = foreignNLB2(accountNumber, contentArray));
  !filename && (filename = foreignZiirat(accountNumber, contentArray));
  !filename && (filename = payCardHipotekarna(accountNumber, contentArray));
  !filename && (filename = payCardHipotekarna2(accountNumber, contentArray));
  !filename && (filename = payCardHipotekarna3(accountNumber, contentArray));
  !filename && (filename = payCardHipotekarna4(accountNumber, contentArray));
  return filename;
}

function domesticAddiko(accountNumber, contentArray) {
  let retVal = "";
  let row1 = contentArray[8];
  let row2 = contentArray[9];
  if (row1.indexOf(" za račun ") < 0 || row2.indexOf(" na dan ") < 0) {
    row1 = contentArray[9];
    row2 = contentArray[10];
  }
  let accountPosition = row1.indexOf(" za račun ") + 10;
  let datePosition = row2.indexOf(" na dan ") + 8;
  let numberPosition = row1.indexOf("Izvod broj ") + 11;
  if (accountPosition >= 10 && datePosition >= 8 && numberPosition >= 11) {
    let accountValue = row1.substring(accountPosition, accountPosition + 18).trim();
    let dateValue = checkDate(row2.substring(datePosition, datePosition + 10).trim());
    let numberValue = parseInt(row1.substring(numberPosition, numberPosition + 3).trim());
    if (accountNumber === accountValue && accountValue?.length <= 18) {
      retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
    }
  }
  return retVal;
}

function domesticAdriatic(accountNumber, contentArray) {
  let retVal = "";
  if (contentArray.length < 9) return retVal;
  let accountValue = contentArray[3].trim().split(" ")[0];
  let dateArray = contentArray[6].trim().split(" ");
  let dateValue = checkDate(dateArray[dateArray.length - 1]);
  let numberArray = contentArray[2].trim().split(" ");
  let numberValue = parseInt(numberArray[numberArray.length - 1]);
  if (accountNumber === accountValue && accountValue?.length <= 18 && dateValue && numberValue) {
    retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
  }
  return retVal;
}

function domesticCKB(accountNumber, contentArray) {
  let retVal = "";
  if (contentArray.length < 1) return retVal;
  let accountPosition = contentArray[0].indexOf(" stanje računa ") + 15;
  let datePosition = contentArray[0].indexOf(" na dan ") + 8;
  let numberPosition = contentArray[0].indexOf("Izvod broj ") + 11;
  if (accountPosition >= 15 && datePosition >= 8 && numberPosition >= 11) {
    let accountValue = contentArray[0].substring(accountPosition, accountPosition + 18).trim();
    let dateValue = checkDate(contentArray[0].substring(datePosition, datePosition + 10).trim());
    let numberValue = parseInt(contentArray[0].substring(numberPosition, numberPosition + 3).trim());
    if (accountNumber === accountValue && accountValue?.length <= 18) {
      retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
    }
  }
  return retVal;
}

function domesticHipotekarna(accountNumber, contentArray) {
  let retVal = "";
  if (contentArray.length < 6) return retVal;
  let accountValue = contentArray[3].trim().split(" ")[0];
  let numberDate = contentArray[5].trim();
  let numberDateArray = contentArray[5].trim().split(" ");
  let dateValue = checkDate(numberDate.substring(4, 40).trim());
  let numberValue = parseInt(numberDateArray[0]);
  if (accountNumber === accountValue && accountValue?.length <= 18 && dateValue && numberValue) {
    retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
  }
  return retVal;
}

function domesticLovcen(accountNumber, contentArray) {
  let retVal = "";
  if (contentArray.length < 7) return retVal;
  let accountValue = contentArray[3].replace("Broj računa", "").replace(":", "").trim().split(" ")[0];
  let temp = contentArray[6].replace("IZVOD BR.", "").replace("za dan ", "").trim().split(" ");
  if (temp.length < 2) {
    return retVal;
  }
  let numberValue = temp[0].trim();
  let dateValue = temp[1].trim();
  if (accountNumber === accountValue && accountValue?.length <= 18 && dateValue?.length === 10) {
    retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
  }
  return retVal;
}

function domesticLovcenObsolete(accountNumber, contentArray) {
  let retVal = "";
  if (contentArray.length < 7) return retVal;
  let accountValue = contentArray[3].trim();
  let numberValue = contentArray[2].trim().substring(contentArray[2].trim().length - 3);
  let dateValue = checkDate(contentArray[6].trim().substring(contentArray[6].trim().length - 10));
  if (accountNumber === accountValue && accountValue?.length <= 18 && dateValue?.length === 10) {
    retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
  }
  return retVal;
}

function domesticPrvaBanka(accountNumber, contentArray) {
  let retVal = "";
  if (contentArray.length < 14) return retVal;
  let accountPosition = contentArray[13].indexOf("Račun: ") + 7;
  let datePosition = contentArray[13].trim().split(" ");
  let numberPosition = contentArray[7].trim().split(" ");
  if (accountPosition >= 7) {
    let accountValue = contentArray[13].substring(accountPosition, accountPosition + 40).trim();
    let dateValue = checkDate(datePosition[datePosition.length - 1]);
    let numberValue = parseInt(numberPosition[numberPosition.length - 1]);
    if (accountNumber === accountValue && accountValue?.length <= 12 && dateValue?.length === 10) {
      retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
    }
  }
  return retVal;
}

function domesticZapad(accountNumber, contentArray) {
  let retVal = "";
  if (contentArray.length < 5) return retVal;
  let accountPosition = contentArray[4].indexOf("Žiro račun: ") + 12;
  let datePosition = contentArray[2].indexOf("za dan ") + 6;
  let numberPosition = contentArray[0].indexOf("IZVOD RAČUNA - broj ") + 19;
  if (accountPosition >= 12 && datePosition >= 6 && numberPosition >= 19) {
    let accountValue = contentArray[4].substring(accountPosition, accountPosition + 40).trim();
    let dateValue = checkDate(contentArray[2].substring(datePosition).trim());
    let numberValue = parseInt(contentArray[0].substring(numberPosition).trim());
    if (accountNumber === accountValue && accountValue?.length <= 18) {
      retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
    }
  }
  return retVal;
}

function domesticZiirat(accountNumber, contentArray) {
  let retVal = "";
  if (contentArray.length < 5) return retVal;
  let accountPosition = contentArray[4].indexOf("Račun: ") + 7;
  let datePosition = contentArray[1].indexOf(" NA DAN ") + 7;
  let numberPosition = contentArray[0].indexOf("IZVOD BROJ ") + 11;
  if (accountPosition >= 7 && datePosition >= 7 && numberPosition >= 11) {
    let accountValue = contentArray[4].substring(accountPosition, accountPosition + 30).trim();
    let dateValue = checkDate(contentArray[1].substring(datePosition).trim());
    let numberValue = parseInt(contentArray[0].substring(numberPosition).trim());
    if (accountNumber === accountValue && accountValue?.length <= 20) {
      retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
    }
  }
  return retVal;
}

function domesticNLB(accountNumber, contentArray) {
  let retVal = "";
  if (contentArray.length < 4) return retVal;
  let accountValue = contentArray[3].substring(contentArray[3].length - 25, contentArray[3].length).trim();
  let datePosition = contentArray[1].indexOf(" DANA ") + 6;
  let numberPosition = contentArray[0].indexOf("IZVOD BR. ") + 10;
  if (accountValue === accountNumber && datePosition >= 6 && numberPosition >= 10 && accountValue?.length <= 13) {
    let dateValue = checkDate(contentArray[1].substring(datePosition).trim());
    let numberValue = parseInt(contentArray[0].substring(numberPosition).trim());
    retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
  }
  return retVal;
}

function domesticNLB2(accountNumber, contentArray) {
  let retVal = "";
  if (contentArray.length < 20) return retVal;
  let accountPosition = contentArray[0].trim().split(" ");
  let accountValue = accountPosition[accountPosition.length - 1];
  let numberValue = accountPosition[accountPosition.length - 3];
  let dateRow1 = contentArray[16].trim();
  let dateRow2 = contentArray[17].trim();
  let dateVal1 = dateRow1.substring(dateRow1.length - 21, dateRow1.length - 10).trim();
  let dateVal2 = dateRow2.substring(dateRow2.length - 21, dateRow2.length - 10).trim();
  let dateValue = checkDate(dateVal1) || checkDate(dateVal2);
  if (accountValue === accountNumber && accountValue?.length <= 21 && numberValue && dateValue) {
    retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
  }
  return retVal;
}

function domesticNLB3(accountNumber, contentArray) {
  //Read all data from the last line - footer info
  let retVal = "";
  if (contentArray.length < 20) return retVal;
  let temp = contentArray[contentArray.length - 2];
  if (temp.length < 50) {
    return retVal;
  }
  let accountPosition = temp.indexOf("Za račun ") + 9;
  let numberPosition = temp.indexOf("Izvod br. ") + 10;
  let datePosition = temp.indexOf("Izvod za datum ") + 15;
  if (accountPosition < 20 || datePosition < 40) {
    return retVal;
  }
  let accountValue = temp.substring(accountPosition, accountPosition + 21).trim();
  let numberValue = temp.substring(numberPosition, numberPosition + 4).trim();
  let dateValue = checkDate(temp.substring(datePosition, datePosition + 11).trim());
  if (accountValue === accountNumber && accountValue?.length <= 21 && numberValue && dateValue) {
    retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
  }
  return retVal;
}

function domesticNLB4(accountNumber, contentArray) {
  let retVal = "";
  if (contentArray.length < 20) return retVal;
  let accountPosition = contentArray[0].trim().split(" ");
  if (accountPosition.length < 5) {
    return retVal;
  }
  let accountValue = accountPosition[4].replace("\n", "");
  let numberValue = accountPosition[2];
  let dateValue = "";
  contentArray.forEach((element) => {
    if (element.includes("ZA PROMJENU SREDSTAVA NA RAČUNU DANA")) {
      let temp = element.replace("ZA PROMJENU SREDSTAVA NA RAČUNU DANA").trim().split(" ");
      dateValue = checkDate(temp[0]);
      if (!dateValue) dateValue = checkDate(temp[1]);
    }
  });
  if (accountValue === accountNumber && accountValue?.length <= 21 && numberValue && dateValue) {
    retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
  }
  return retVal;
}

function foreignAdriatic(accountNumber, contentArray) {
  let retVal = "";
  if (contentArray.length < 9) return retVal;
  let accountValue = contentArray[3].trim().split(" ")[0];
  let dateArray = contentArray[6].trim().split(" ");
  let dateValue = checkDate(dateArray[dateArray.length - 1]);
  let numberArray = contentArray[2].trim().split(" ");
  let numberValue = parseInt(numberArray[numberArray.length - 1]);
  if (accountNumber === accountValue && accountValue?.length === 27 && dateValue && numberValue) {
    retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
  }
  return retVal;
}

function foreignAdriatic2(accountNumber, contentArray) {
  let retVal = "";
  if (contentArray.length < 9) return retVal;
  let accountValue = contentArray[4].trim().split(" ")[contentArray[4].trim().split(" ").length - 1];
  let dateArray = contentArray[8].trim().split(" ");
  let dateValue = checkDate(dateArray[dateArray.length - 1]);
  let numberArray = contentArray[2].trim().split(" ");
  let numberValue = parseInt(numberArray[numberArray.length - 1]);
  if (accountNumber === accountValue && accountValue?.length === 18 && dateValue && numberValue) {
    retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
  }
  return retVal;
}

function foreignCKB(accountNumber, contentArray) {
  let retVal = "";
  if (contentArray.length < 5) return retVal;
  let accountPosition = contentArray[4].indexOf("IBAN:") + 6;
  let datePosition = contentArray[0].indexOf(" na dan ") + 8;
  let numberPosition = contentArray[0].indexOf("Devizni izvod broj ") + 19;
  if (accountPosition >= 6 && datePosition >= 8 && numberPosition >= 19) {
    let accountValue = contentArray[4].substring(accountPosition, accountPosition + 22).trim();
    let dateValue = checkDate(contentArray[0].substring(datePosition, datePosition + 10).trim());
    let numberValue = parseInt(contentArray[0].substring(numberPosition, numberPosition + 3).trim());
    if (accountNumber === accountValue && accountValue?.length === 22) {
      retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
    }
  }
  return retVal;
}

function foreignHipotekarna(accountNumber, contentArray) {
  let retVal = "";
  if (contentArray.length < 11) return retVal;
  let accountArray = contentArray[4].trim().split(" ");
  //let accountValue = contentArray[3].trim().split(" ")[0];
  let accountValue = accountArray[accountArray.length - 1];
  //let dateArray = contentArray[8].trim().split(" ");
  let dateArray = contentArray[10].trim().split(" ");
  let dateValue = checkDate(dateArray[dateArray.length - 1]);
  let numberArray = contentArray[2].trim().split(" ");
  let numberValue = parseInt(numberArray[numberArray.length - 1]);
  if (accountNumber === accountValue && accountValue?.length === 27 && dateValue && numberValue) {
    retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
  }
  return retVal;
}

function foreignHipotekarna2(accountNumber, contentArray) {
  let retVal = "";
  if (contentArray.length < 11) return retVal;
  let accountValue = contentArray[3].trim().split(" ")[0];
  let dateArray = contentArray[8].trim().split(" ");
  let dateValue = checkDate(dateArray[dateArray.length - 1]);
  let numberArray = contentArray[2].trim().split(" ");
  let numberValue = parseInt(numberArray[numberArray.length - 1]);
  if (accountNumber === accountValue && accountValue?.length === 27 && dateValue && numberValue) {
    retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
  }
  return retVal;
}

function foreignLovcen(accountNumber, contentArray) {
  let retVal = "";
  if (contentArray.length < 12) return retVal;
  let accountValue = contentArray[10].trim();
  let dateValue = checkDate(contentArray[11].trim());
  let numberValue = parseInt(contentArray[9].trim().substring(0, 3));
  if (accountNumber === accountValue && accountValue?.length === 13) {
    retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
  }
  return retVal;
}

function foreignNLB(accountNumber, contentArray) {
  let retVal = "";
  if (contentArray.length < 27) return retVal;
  let accountValue = contentArray[14].substring(8).trim();
  let dateValue = checkDate(contentArray[26].substring(0, 10).trim());
  let numberValue = parseInt(contentArray[17].substring(9, 12).trim());
  if (accountValue === accountNumber && accountValue?.length === 13 && dateValue && numberValue) {
    retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
  }
  return retVal;
}

function foreignNLB2(accountNumber, contentArray) {
  //Impossible to find otherwise. Complete idiots in this bank.
  let retVal = "";
  if (contentArray.length < 27) return retVal;
  let accountPosition = contentArray[0].trim().split(" ");
  let accountValue = accountPosition[accountPosition.length - 1];
  let dateValue = "",
    numberValue = "";
  contentArray.forEach((element) => {
    if (!dateValue && element.includes("PODGORICA")) {
      let temp = element.replace("\n", "");
      dateValue = checkDate(temp.replace("PODGORICA", "").trim());
    }
    if (!numberValue && element.includes("IZVOD Br.")) {
      let temp = element.replace("\n", "");
      numberValue = temp.substring(temp.indexOf("IZVOD Br.") + 9, temp.indexOf("IZVOD Br.") + 12).trim();
    }
  });
  if (accountValue === accountNumber && dateValue && numberValue) {
    retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
  }
  return retVal;
}

function foreignZiirat(accountNumber, contentArray) {
  let retVal = "";
  if (contentArray.length < 30) return retVal;
  let accountPosition = contentArray[6].indexOf("Račun: ") + 7;
  let accountValue = contentArray[6].substring(accountPosition, accountPosition + 30).trim();
  if (accountPosition === 6) {
    accountValue = contentArray[6].trim();
  }
  if (accountValue !== accountNumber) {
    accountValue = contentArray[7].trim();
  }
  let dateVal1 = contentArray[26].substring(34, 55).trim();
  let dateVal2 = contentArray[27].substring(34, 55).trim();
  let dateVal3 = contentArray[28].substring(34, 55).trim();
  let dateVal4 = contentArray[29].substring(34, 55).trim();
  let dateValue = checkDate(dateVal1) || checkDate(dateVal2) || checkDate(dateVal3) || checkDate(dateVal4);
  let rowLength = contentArray[0].trim().length;
  let numberValue = contentArray[0].trim().substring(rowLength - 8, rowLength - 5);
  if (accountValue && dateValue && numberValue) {
    if (accountNumber === accountValue && accountValue?.length === 22) {
      retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
    }
  }
  return retVal;
}

function payCardHipotekarna(accountNumber, contentArray) {
  let retVal = "";
  if (contentArray.length < 6) return retVal;
  let accountValue = contentArray[3].substring(49, 95).trim().split(" ")[0];
  //let otherData = contentArray[5].substring(40, 77).trim();
  let otherData = contentArray[5].substring(40, 80).trim();
  let dateValue = checkShortDate(otherData.substring(otherData.length - 8, otherData.length - 1));
  let numberValue = parseInt(otherData.substring(0, 3));
  if (accountNumber === accountValue && accountValue?.length === 18 && dateValue && numberValue) {
    retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
  }
  return retVal;
}

function payCardHipotekarna2(accountNumber, contentArray) {
  let retVal = "";
  if (contentArray.length < 6) return retVal;
  let accountValue = contentArray[3].substring(44, 95).trim().split(" ")[0];
  //let otherData = contentArray[5].substring(40, 77).trim();
  let otherData = contentArray[5].substring(40, 80).trim();
  let dateValue = checkShortDate(otherData.substring(otherData.length - 8, otherData.length - 1));
  let numberValue = parseInt(otherData.substring(0, 3));
  if (accountNumber === accountValue && accountValue?.length === 18 && dateValue && numberValue) {
    retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
  }
  return retVal;
}

function payCardHipotekarna3(accountNumber, contentArray) {
  let retVal = "";
  if (contentArray.length < 6) return retVal;
  let accountValue = contentArray[3].trim().split(" ")[0];
  let otherData = contentArray[5].substring(40, 80).trim();
  let dateValue = checkShortDate(otherData.substring(otherData.length - 8, otherData.length - 1));
  let numberValue = parseInt(otherData.substring(0, 3));
  if (accountNumber === accountValue && accountValue?.length === 18 && dateValue && numberValue) {
    retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
  }
  return retVal;
}

function payCardHipotekarna4(accountNumber, contentArray) {
  let retVal = "";
  if (contentArray.length < 6) return retVal;
  let accountRow = contentArray[3].trim().split(" ");
  let accountValue = accountRow[accountRow.length - 1];
  let otherData = contentArray[5].substring(40, 80).trim();
  let dateValue = checkShortDate(otherData.substring(otherData.length - 8, otherData.length - 1));
  let numberValue = parseInt(otherData.substring(0, 3));
  if (accountNumber === accountValue && accountValue?.length === 18 && dateValue && numberValue) {
    retVal = `br.${formatNumber(numberValue)} od ${dateValue}.pdf`;
  }
  return retVal;
}

function formatNumber(number) {
  let value = `00${number}`;
  return value.substring(value.length - 3, value.length);
}

function checkDate(date) {
  const re = /^(\d{2}\.\d{2}\.\d{4})/;
  let m = re.exec(date);
  return m && m[0];
}

function checkShortDate(date) {
  const re = /^(\d{2}\.\d{4})/;
  let m = re.exec(date);
  return m && m[0];
}

module.exports = {
  findAccountNumberInSpecificLine,
};
