const util = require("./util");

function findAccountNumberInSpecificLine(accountNumber, content) {
  let contentArray = util.contentToArrayByLine(content);



}

function domesticAddiko(accountNumber, contentArray) {
  let retVal = ""
  let location = contentArray[9];
  console.log("Tekst za pretragu:", location)


}