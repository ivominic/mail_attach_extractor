/**Moves downloaded pdf files,in apropriate directories, based on their content */
const fs = require("fs");
const pdfParse = require("pdf-parse");

const readPdf = async (uri) => {
  const buffer = fs.readFileSync(uri);
  try {
    const data = await pdfParse(buffer);

    // The content
    console.log("Content: ", data);
  } catch (err) {
    throw new Error(err);
  }
};

// Testing
const filename = "d:/test/zogo.pdf";
readPdf(filename);
/*
const mightyPdfParser = require("mighty-pdf-parser");
const fs = require("fs");
const filename = "d:/test/zogo1.pdf";
const dataBuffer = fs.readFileSync(filename);

const options = {
  // Activate pageRange option so you can parse pages with range.
  // Default = false (parse all pages from document).
  pageRange: true,
  // Define starting page for range
  // Default = 1.
  startPage: 1,
  // Define end page for range
  // Default = 1.
  endPage: 1,
};

mightyPdfParser(dataBuffer, options).then((response) => {
  // Response with number of pages that are parsed.
  console.log(response.pageCount);
  // Response with document metadata.
  console.log(response.metadata);
  // Response with document basic info.
  console.log(response.info);
  // Reponse with text
  console.log(response.text);
  // Response with PDFjs version.
});
*/
