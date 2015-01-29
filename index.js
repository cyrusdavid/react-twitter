'use strict'

var app = require('./app.js').server
var port = process.env.PORT || 8080

app.listen(port, function() {
  console.log(`listening on ${port}.`)
})
