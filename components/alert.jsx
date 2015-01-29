var React = require('react');

var Alert = module.exports = React.createClass({

  render: function() {
    var className = 'alert ' + (this.props.count ? '' : 'hide');
    return (
      <li className={className}><a href="#" onClick={this.props.onclickHandler}>There {this.props.count === 1 ? 'is ' + this.props.count + ' new tweet': 'are ' + this.props.count + ' new tweets'}!</a></li>
    );
  }

});
