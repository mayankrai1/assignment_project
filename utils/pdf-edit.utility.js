const { degrees, PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require("fs"); 
const path = require("path");

const applicationRetainerPositions = {
    clientName:"0,250,622",
    clientId:"0,250,605",
    clientDob:"0,250,585",
    clientAddress:"0,250,562",
    clientPhone:"0,320,540",
    clientEmail:"0,320,520",
    designateName:"0,320,503",
    designateRelationship:"0,320,485",
    designateId:"0,320,467",
    designateAddress:"0,320,450",
    designatePhone:"0,320,433",
    designateEmail:"0,320,417",
    date:"0,300,672",
    month:"0,340,672",
    year:"0,390,672",
    fpAmount:"2,235,392",
    fpGst:"2,290,392",
    fpTotal:"2,345,392",
    tcAmount:"2,235,288",
    tcGst:"2,290,288",
    tcTotal:"2,345,288"
};

exports.generateRetainerAggrement = async (data)=> {
const unfilledApplicationRetainerAggrementFilePath = path.join(`${__dirname}/../resources/static/assets/canx_docs/unfilledApplicationRetainerAggrement.pdf`);
const existingPdfBytes = fs.readFileSync(unfilledApplicationRetainerAggrementFilePath);
const pdfDoc = await PDFDocument.load(existingPdfBytes);
const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

// Get the first page of the document
const pages = pdfDoc.getPages();

//##########for testing positions. to be removed later
// const thirdPage = pages[2];
// const { width, height } = thirdPage.getSize();

// for(var i = 0; i<height; i=i+20){
//     for(var j = 0; j<width; j=j+40){
//         thirdPage.drawText(''+j+','+i, {
//             x: j,
//             y: i,
//             size: 8,
//             font: helveticaFont,
//             color: rgb(0, 0, 0)
//           });   
//     }
// }

Object.keys(applicationRetainerPositions).forEach(key => {
    pages[Number(applicationRetainerPositions[key].split(',')[0])].drawText(data[key] ? data[key] : 'N/A', {
        x: Number(applicationRetainerPositions[key].split(',')[1]),
        y: Number(applicationRetainerPositions[key].split(',')[2]),
        size: 8,
        font: helveticaFont,
        color: rgb(0, 0, 0)
      });   
})

const pdfBytes = await pdfDoc.save();
if (!fs.existsSync(data.path)){
    fs.mkdirSync(data.path, { recursive: true });
}
fs.writeFileSync(data.path+'/finalRetainerAggrement.pdf', pdfBytes);
return data.path+'/finalRetainerAggrement.pdf';
}