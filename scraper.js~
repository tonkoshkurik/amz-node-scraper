var fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio');

request("https://www.amazon.com/AVAWO-Accessories-Carrying-Action-Cameras/dp/B00VV7JMSC/ref=sr_1_27?ie=UTF8&qid=1459469899&sr=8-27&keywords=case+for+gopro", function(error, response, html) {
    if (!error && response.statusCode == 200) {
        var $ = cheerio.load(html);
        $('#acrCustomerReviewText').each(function(i, element) {
            var el = $(this);
            var price = el.text();
            console.log(price);
        })
    }
});

