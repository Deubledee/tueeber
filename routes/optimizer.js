const url = require('url')
const querystring = require('querystring');

function optimizer(req, res) {
        const myURL = querystring.parse(url.parse(req.url).query, null, null)
        var pathname = url.parse(req.url).pathname.split('/').pop()
        console.log('req', myURL)
        // var arr = { 'result': 'result' }
        res.format({
                'application/json': function () {
                        res.send({
                                message: myURL.url,
                                index: myURL.index,
                                id: myURL.id
                        });
                }
        })
        //  res.send(JSON.stringify(arr))
}
module.exports = optimizer;