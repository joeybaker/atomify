var st = require('st')
  , http = require('http')
  , js = require('atomify-js')
  , css = require('atomify-css')
  , open = require('open')

module.exports = function (args) {

  var mount = st(args.serve.st || process.cwd())
    , port = args.serve.port || 1337
    , launch = args.serve.open
    , path = args.serve.path || ''
    , url = args.serve.url || 'http://localhost:' + port + path

  http.createServer(function(req, res) {

    switch (req.url) {
      case args.js.alias || args.js.entry:
        js(args.js, responder('javascript', res))
        break

      case args.css.alias || args.css.entry:
        css(args.css, responder('css', res))
        break

      default:
        mount(req, res)
        break
    }

  }).listen(port)

  if (launch) open(url)
}

function responder (type, res) {
  return function (err, src) {
    if (!res.headersSent) res.setHeader('Content-Type', 'text/' + type)
    res.end(src)
  }
}