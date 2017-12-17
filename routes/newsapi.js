//const url = require('url');
const NewsAPI = require('newsapi');

/* GET home page. */
var apiKey = '16bb1647c69145dc8a5c8f18373cd2cf'
const Newsapi = new NewsAPI(apiKey);

function newsapi(req, res) {
  /* var search = url.parse(req.url).search
   var pathname = url.parse(req.url).pathname.split('/').pop()
   let lo = `/v2/${pathname}${search}&apiKey=${apiKey}`
   var option = url.resolve(`${pathname}`, search)*/
  Newsapi.v2.topHeadlines({
    sources: '',
    q: 'trump',
    category: '',
    language: 'en',
    country: ''
  }).then((response) => {
    console.log(res, response);
  });
}

module.exports = newsapi;
