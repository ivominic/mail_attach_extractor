const cheerio = require("cheerio");

const util = require("./util");

function findAccountNumberInHtml(accountNumber, content) {
  let filename = "";
  const $ = cheerio.load(content, null, false);

  !filename && (filename = domesticErste(accountNumber, $));
  !filename && (filename = foreignErste(accountNumber, $));

  return filename;
}

function domesticErste(accountNumber, $) {
  let retVal = "";
  let dateText = $("p").next("p").text();
  let dateValue = dateText.substring(dateText.length - 12);
  let accountValue1 = $("table").next("table").next("table").find("tr").find("td").next().html();
  let accountValue2 = $("table").next("table").next("table").find("tr").next().find("td").next().html();
  let numberValue = $("table")
    .next("table")
    .next("table")
    .find("tr")
    .next()
    .next()
    .next()
    .find("td")
    .next()
    .html()
    .substring(0, 3);

  if (accountNumber === accountValue1 || accountNumber === accountValue2) {
    retVal = `br.${numberValue} od ${dateValue}.htm`;
  }
  return retVal;
}

function foreignErste(accountNumber, $) {
  let retVal = "";
  let dateText = $("p").next("p").text();
  let dateValue = dateText.substring(dateText.length - 12);
  let testIban = $("table").next("table").next("table").find("tr").find("td").html();
  if (testIban.trim() !== "IBAN:") return retVal;
  let accountValue1 = $("table").next("table").next("table").find("tr").find("td").next().html();
  let accountValue2 = $("table").next("table").next("table").find("tr").next().find("td").next().html();
  let numberValue = $("table")
    .next("table")
    .next("table")
    .find("tr")
    .next()
    .next()
    .next()
    .next()
    .find("td")
    .next()
    .html()
    .substring(0, 3);

  if (accountNumber === accountValue1 || accountNumber === accountValue2) {
    retVal = `br.${numberValue} od ${dateValue}.htm`;
  }
  return retVal;
}

module.exports = {
  findAccountNumberInHtml,
};
