var React = require('react');
var tweet = require('twitter-text');

var Tweet = module.exports = React.createClass({

  render: function() {
    var html = {
      __html: tweet.autoLink(
        tweet.htmlEscape(this.props.tweet.text),
        { targetBlank: true }
      )
    }

    return (
      <li className="tweet">
        <figure className="tweet-avatar">
          <a href={'https://twitter.com/' + this.props.tweet.user.screen_name }><img src={this.props.tweet.user.profile_image_url} /></a>
        </figure>
        <div className="tweet-body">
          <a href={'https://twitter.com/' + this.props.tweet.user.screen_name } className="tweet-user">{this.props.tweet.user.name}</a>
          <p className="tweet-text" dangerouslySetInnerHTML={html}></p>
        </div>
      </li>
    );
  }

});
