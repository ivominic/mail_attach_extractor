const cheerio = require("cheerio");

const util = require("./util");

function findAccountNumberInHtml(accountNumber, content) {
  let filename = "";

  console.log("accountNumber", accountNumber);
  const $ = cheerio.load(content, null, false);

  !filename && (filename = domesticErste(accountNumber, $));

  return filename;
}

//TODO: Branko da odredi koji account čitamo
function domesticErste(accountNumber, $) {
  let retVal = "";
  let dateText = $("p").next("p").text();
  let dateValue = dateText.substring(dateText.length - 12);
  let accountValue = $("table").next("table").next("table").find("tr").next().find("td").next().html();
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

  if (accountNumber === accountValue) {
    retVal = `br.${numberValue} od ${dateValue}.pdf`;
  }
  return retVal;
}

module.exports = {
  findAccountNumberInHtml,
};
