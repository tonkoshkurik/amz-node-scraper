var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var AWS = require('aws-sdk');
var cells;
var doc = new GoogleSpreadsheet('1jhQ_2gULNnl6lLX01dGfXfcaGr-tyoZylDThW04E6co');
var amazon = require('amazon-product-api');
var sheet;

// var allObj = [];
// var AWSAccessKeyId=AKIAIYY7J4DNDU3SXE6Q,
// AWSSecretKey=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;

// var scraper = require('product-scraper');

// scraper.init('http://www.amazon.com/gp/product/B00X4WHP5E/', function(data){
//     console.log(data);
// });

// client.itemLookup({
//   idType: 'ASIN',
//   itemId: 'B00NXO1U18'
// }).then(function(results) {
//   var res = JSON.stringify(results);
//   var objres = JSON.parse(res);
//   console.log(objres[0].ItemAttributes[0].PackageDimensions);
// }).catch(function(err) {
//   console.log(err);
// });

function getASIN(url) {
  var urla = url;
  var regex = RegExp("http://www.amazon.com/([\\w-]+/)?(dp|gp/product)/(\\w+/)?(\\w{10})");
  m = urla.match("/([A-Z0-9]{10})(?:[/?]|$)")
  if (m) { 
    return m[1];
  }
}
function getTitle(obj){
  return obj[0].ItemAttributes[0].Title[0];
}
function getWeight(obj){
  return obj[0].ItemAttributes[0].PackageDimensions[0].Weight[0]._ + ' ' + obj[0].ItemAttributes[0].PackageDimensions[0].Weight[0].$.Units;
}
function getDimensions(obj){
  var Height = obj[0].ItemAttributes[0].PackageDimensions[0].Height[0]._ + ' ' + obj[0].ItemAttributes[0].PackageDimensions[0].Height[0].$.Units;
  var Width =obj[0].ItemAttributes[0].PackageDimensions[0].Width[0]._ + ' ' + obj[0].ItemAttributes[0].PackageDimensions[0].Width[0].$.Units;
  var Length =obj[0].ItemAttributes[0].PackageDimensions[0].Length[0]._ + ' ' + obj[0].ItemAttributes[0].PackageDimensions[0].Length[0].$.Units;
  return Height + ', ' + Width + ', ' + Length;
}

AWS.config.loadFromPath('./config.json');

function getReview(url) {
  var $;
  var price;
  var title;

	request(url, function(error, response, html) {
        console.log("error= " + error +" response = "+ response.statusCode);
    		if (!error && response.statusCode == 200) {
     		   $ = cheerio.load(html);
           title = $('title').text();
 		       price = ($('.a-color-prices') || $('#priceblock_ourprice') || $('#priceblock_saleprice')).text();
        	 console.log(title + ' \n' + price);
        	 return $;
    		}
	});
}

async.series([
  function setAuth(step) {
	var creds = require('./API Project-ecdd436184d5.json');    
    doc.useServiceAccountAuth(creds, step);
  },
  function getInfoAndWorksheets(step) {
    doc.getInfo(function(err, info) {
      console.log('Loaded doc: '+info.title+' by '+info.author.email);
      sheet = info.worksheets[0];
      console.log('sheet 1: '+sheet.title+' '+sheet.rowCount+'x'+sheet.colCount);
      step();  
    });
  },
  function workingWithCells(step) {
    sheet.getCells({
      'min-row': 3,
      'max-row': 10,
      'return-empty': true
    },function(err, cellss) {
		cells = cellss;
    var i=2;
    (function() {
      if (i < cells.length) {
          // scraper.init(cells[i].value, function(data){
          //     console.log(data.price || data.sale_price);
          //     // console.log(data.url);
          //     // console.log(data.price);
          // });
          getReview(cells[i].value,'#priceblock_saleprice');
          // allObj.push(getObj);
          console.log("i=" + i);
          // var asin = getASIN(cells[i].value);
          // client.itemLookup({
          //   idType: 'ASIN',
          //   itemId: asin
          // }).then(function(results) {
          //   var res = JSON.stringify(results);
          //   console.log(res);
          //   var objres = JSON.parse(res);
          //   var dim = objres[0].ItemAttributes[0].PackageDimensions;
          // }).catch(function(err) {
          //   console.log(err);
          // });
          i+=27;
          setTimeout(arguments.callee, 5000);
      } else {
          console.log('Закончили');
      }
    })();
    //  for(var i=2; i<cells.length; i+=27) {
  		// console.log('i=' + i + ' Cell R'+cells[i].row+'C'+cells[i].col+' = '+cells[i].value);
    //  }
      step();
    });
  },
  function cherioo(step) {

	step();	
	}
  ]);
