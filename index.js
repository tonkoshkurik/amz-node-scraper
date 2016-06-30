var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var GoogleSpreadsheet = require('google-spreadsheet');
var async = require('async');
var cells;
var doc = new GoogleSpreadsheet('1jhQ_2gULNnl6lLX01dGfXfcaGr-tyoZylDThW04E6co');
var sheet;

function getReview(url,element) {
	request(url, function(error, response, html) {
    		if (!error && response.statusCode == 200) {
     		   var $ = cheerio.load(html);
 		       $(element).each(function(i, element) {
 		           var el = $(this);
 		           var price = el.text();
			   console.log(price);
			   return price;
 		       });
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
      'max-row': 3,
      'return-empty': true
    },function(err, cellss) {
		cells = cellss;
    //  for(var i=0; i<cells.length; i++) {
		//console.log('i=' + i + ' Cell R'+cells[i].row+'C'+cells[i].col+' = '+cells[i].value);
		//console.log(typeof cells[i].value);
    //  }
      step();
    });
  },
  function cherioo(step) {
	console.log(cells[2]);
	getReview(cells[2].value,'#priceblock_saleprice');
//	cheerioReq(cells[4].value, (err, $) => {	
//		console.log($("#acrCustomerReviewText").text());
//	});
	step();	
	}
  ]);