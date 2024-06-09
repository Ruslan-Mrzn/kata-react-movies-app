import React, { Component } from 'react'

import './App.css'
import api from '../../utils/api'
import MovieCard from '../MovieCard/MovieCard'
export default class App extends Component {
  constructor() {
    super()
    this.state = {
      searchedMovies: null,
      ratedMovies: null,
    }
    this.guestId = JSON.stringify(localStorage.getItem('guestId'))
  }

  async componentDidMount() {
    if (!this.guestId) {
      try {
        const { guest_session_id } = await api.getGuestId()
        console.log(guest_session_id)
        localStorage.setItem('guestId', JSON.stringify(guest_session_id))
        this.guestId = guest_session_id
      } catch (err) {
        console.error(err)
      }
    }
    try {
      const movies = await api.getRatedMovies(this.guestId)
      this.setState({ ratedMovies: movies })
      console.log(movies)
    } catch (error) {
      this.guestId = null
      console.error(error)
    }
    console.log('App mounted!')
  }
  render() {
    // const { fetchResult } = this.state
    return (
      <div>
        <MovieCard description={''} />
        {/* {console.log(fetchResult)} */}
      </div>
    )
  }
}
