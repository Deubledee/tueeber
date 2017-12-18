const url = require('url')
const querystring = require('querystring');
var youtubeNode = require("youtube-node")
var youTubesearch = new youtubeNode();
/* GET home page. */
var key = 'AIzaSyAvZS0WP2y0M9Yczpi8F-4JeagLnFCDMwU'

function youtube(req, res) {
  const myURL = querystring.parse(url.parse(req.url).query, null, null)
  var pathname = url.parse(req.url).pathname.split('/').pop()  
  youTubesearch.setKey(key);
  youTubesearch.search(myURL.q, myURL.maxResults, function (error, result) {
    if (error) {
      console.log(error);
    }
    else {      
      res.send(result)
    }
  });
}
module.exports = youtube;
