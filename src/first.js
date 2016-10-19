var Crawler = require("crawler");
var url = require('url');
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var process = require('process');
// var util = require('util');
var sleep = require('./sleep.js');

var arguments = process.argv.splice(2);
var name = arguments[0] || "毛衣";

var fileName = path.join(__dirname + "/../data/"+ name + '_' + moment().format('YYYY-MM-DD') + '.md');

var header = '\n ## ' + name + '\n 网址 | 商品名称 | 店铺名称 | 地址 | 联系方式 \n ----- | ---- | ------- | ---- \n';
fs.appendFile(fileName, header, function(error) {
});

var c = new Crawler({
  // maxConnections : 1000,
  // priorityRange: 1000
});

var tem = '  |  ';
var search = function(search, page) {
  page = page || 1;
  return "http://www.sjq.cn/search-index-0-" + encodeURI(search) + "-0-0-0-0-" + "page";
};

function statistics (error, result, $) {
  if (result.body) {
    var goodName = $($('.pro-name')[0]).text();
    var storeName = $($('.store-name').find('.name')[0]).text();
    var address = $($('.addr')[0]).text();
    var tel = $($('.info-tel').find('.content')[0]).text() || '空';
    // util.getGoodsName(result.body, 'pro-name');
    data = result.uri + tem + goodName + tem + storeName + tem + address + tem  + tel + tem + "\n";
    fs.appendFile(fileName, data, function(error) {
    });
  }
}

function cb (error, result, $) {
  if (error) {
    console.log(error);
  }

  var targets = {};
  $('a').each(function(index, a) {
    var target = $(a).attr('href');
    reg = /^http:\/\/www.sjq.cn\/goods-\d+.html$/;
    if (reg.test(target) && !targets[target]) {
      targets[target] = 1;
      c.queue({
        uri: target,
        callback: statistics
      });
    }
  });
  console.log(targets);
}

c.queue({
  uri: search(name.trim()),
  callback: cb
});
