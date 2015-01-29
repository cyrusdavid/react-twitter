'use strict'

var app = require('express')()
var socketIo = require('socket.io')
var http = require('http')
var React = require('react')
var Twit = require('twit')
var FIFO = require('fifo-array')
var twitter = new Twit({
  'consumer_key': process.env.CONSUMER_KEY,
  'consumer_secret': process.env.CONSUMER_SECRET,
  'access_token': process.env.ACCESS_TOKEN,
  'access_token_secret': process.env.ACCESS_TOKEN_SECRET
})
var tweets = new FIFO(5)
var st = { path: __dirname + '/dist', url: '/assets' }
var track = 'github,node.js,nodejs,#nodejs,#github,#javascript'
var io, server

;require('node-jsx')
  .install({ extension: '.jsx' })

app
  .disable('x-powered-by')
  .set('views', __dirname + '/views')
  .set('view engine', 'html')
  .engine('html', require('consolidate').dot)

app
  .get('/', function(req, res) {
    res.render('index', {
      title: 'Twitter Stream',
      track: track,
      state: JSON.stringify(tweets),
      stream: React.renderToString(
        React.createElement(require('./components/stream.jsx'), {
          tweets: tweets
        })
      )
    })
  })

if (app.get('env') === 'development') {
  st.cache = false
}

app
  .use(require('st')(st))

twitter.stream('statuses/filter', {
  track: track }
)
.on('tweet', function(tweet) {
  tweets.unshift(tweet)
  io.emit('tweet', tweet)
})

server = http.createServer(app)
io = socketIo(server)

exports.server = server
exports.app = app

