//code taken from https://www.twilio.com/blog/2016/11/a-simple-way-to-ocr-images-from-a-url-with-tesseract-js.html

var img_file = './test.jpeg'


const fsPromises = require('fs').promises;
const {parse} = require('himalaya')
const C_JSON = require('circular-json');
const cv = require('opencv4nodejs');
const Tesseract = require('tesseract.js')
const fs = require("fs");
const util = require('util')
const fs_writeFile = util.promisify(fs.writeFile)
var htmlToJson = require('html-to-json');

const mat = cv.imread('./test.jpeg');

const TesseractOptions = {
  lang :'eng',
  // tessedit_ocr_engine_mode : '3',
  // tessedit_pageseg_mode : '6' 
  // tessedit_create_hocr : '1' ,
  tessedit_create_box : '1',
  tessedit_create_osd : '0',
  tessedit_create_tsv : '1',
  tessedit_create_hocr : '0'
  // tessedit_pageseg_mode : '3'
}
async function tess_recognize(file_path)
{
  Tesseract.recognize(file_path,TesseractOptions).then(function(result){
    stored_result = C_JSON.stringify(result)
    console.log(result.text)


let blocks = result.blocks;
let bboxes = [];
blocks.forEach(block => {
   let paragraphs = block.paragraphs;
   paragraphs.forEach(para =>{
       let lines = para.lines;
       lines.forEach(line => {
           bboxes.push(line.bbox);
       });
   });
});
for (var i=0;i<bboxes.length;i++){
    var x0=bboxes[i].x0
    var y0=bboxes[i].y0
    var x1=bboxes[i].x1
    var y1=bboxes[i].y1
    
    var pt1 = new cv.Point2(x0,y0)
    var pt2 = new cv.Point2(x1,y1)
    var color_vec = new cv.Vec(0, 255, 0)
    mat.drawRectangle (pt1 ,pt2 , color_vec ,  1) 
    console.log(x0,y0,x1,y1)
}
cv.imshow('img',mat);
cv.waitKey();
cv.destroyAllWindows();

console.log(bboxes);
})
.then(function(){
            process.exit()
          }); 
        }

tess_recognize(img_file)
console.log('%%%%%%%%%%%%%%%%%%%%%')
