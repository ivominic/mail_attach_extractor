const { PdfReader } = require("pdfreader");

let pdfFilePath = "d:/test/zogo.pdf";

new PdfReader().parseFileItems(pdfFilePath, (err, item) => {
  parseItem(err, item);
});

function parseItem(err, item) {
  if (err) console.error("error:", err);
  else if (!item) console.warn("end of file");
  else if (!item.text && item) {
    if (item.page) {
      new PdfReader().parseFileItems(item.page, (err, item) => {
        parseItem(err, item);
      });
    }
    console.log("aaaaaaa", item);
  } else if (item.text) console.log(item.text);
}

/*var path = require("path");
var extract = require("pdf-text-extract");
extract(pdfFilePath, function (err, pages) {
  if (err) {
    console.dir(err);
    return;
  }
  console.dir(pages);
});
*/
