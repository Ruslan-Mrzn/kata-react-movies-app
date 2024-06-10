import React, { Component } from 'react'
import './SearchMovie.css'
export default class SearchMovie extends Component {
  render() {
    const { searchMovies } = this.props
    return <input onChange={searchMovies} type="text" className="search" placeholder="Type to search..." />
  }
}
