const https = require('https')
const fs = require('fs')
const { URLSearchParams } = require('url');
const url = require('url');
const path = require('path')
/* GET home page. */
var key = 'AIzaSyAvZS0WP2y0M9Yczpi8F-4JeagLnFCDMwU'

function youtube(req, res) {
  var search = url.parse(req.url).search
  var pathname = url.parse(req.url).pathname.split('/').pop()
  let lo = search + `&key=${key}`
  var option = url.resolve(`youtube/v3/${pathname}`, lo)
  var options = {
    hostname: "www.googleapis.com",
    path: option,
    port: 443,
    method: 'GET'
  }
  console.log('youtube', option)
  let requ = https.request(options, function (reqRes) {
    console.log('youtube', reqRes)
  })
}

module.exports = youtube;
