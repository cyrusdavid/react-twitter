var React = require('react')
var Tweet = require('./tweet.jsx')
var Alert = require('./alert.jsx')
var io = require('socket.io-client')
var FIFO = require('fifo-array')

var Stream = module.exports = React.createClass({

  getInitialState: function() {
    return {
      tweets: new FIFO(25, this.props.tweets),
      newTweets: []
    }
  },

  componentDidMount: function() {
    var socket = io()
    var self = this

    socket.on('tweet', function(tweet) {
      var tweets = self.state.newTweets
      tweets.unshift(tweet)
      self.setState({
        tweets: self.state.tweets,
        newTweets: tweets
      })
    })
  },

  loadNewTweets: function(e) {
    e.preventDefault()

    var tweets = this.state.tweets

    tweets.unshift.apply(tweets, this.state.newTweets)

    this.setState({
      tweets: tweets,
      newTweets: []
    })
  },

  render: function() {
    var renderTweet = function(tweet) {
      return (
        <Tweet tweet={tweet} key={tweet.id} />
      )
    }
    var tweets = this.state.tweets.map(renderTweet)

    return (
      <ul className="tweet-stream">
        <Alert count={this.state.newTweets.length} onclickHandler={this.loadNewTweets} />
        {tweets}
      </ul>
    )
  }

})
