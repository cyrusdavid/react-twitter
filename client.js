'use strict'

var React = require('react')

var Stream = require('./components/stream.jsx')

var tweets = JSON.parse(document.getElementById('initial-state').innerHTML)

React.render(
  <Stream tweets={tweets} />,
  document.getElementById('react-app')
)
