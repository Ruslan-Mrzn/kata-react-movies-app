import React, { Component } from 'react'

import './MoviesList.css'
export default class MoviesList extends Component {
  render() {
    const { children } = this.props
    return <ul className="movies-list">{children}</ul>
  }
}
