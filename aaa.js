var pdfUtil = require("pdf-to-text");
var pdf_path = "d:/test/zogo3.pdf";
pdfUtil.info(pdf_path, function (err, info) {
  if (err) throw err;
  console.log(info);
});
pdfUtil.pdfToText(pdf_path, function (err, data) {
  if (err) throw err;
  console.log(data); //print text
});
