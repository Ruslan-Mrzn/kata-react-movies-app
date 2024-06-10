import React, { Component } from 'react'

import './App.css'
import api from '../../utils/api'
import { debounce } from '../../utils/utils'
import { GenresProvider } from '../../contexts/genresContext'
import SearchMovie from '../SearchMovie/SearchMovie'
import MoviesList from '../MoviesList/MoviesList'
import MovieCard from '../MovieCard/MovieCard'
export default class App extends Component {
  constructor() {
    super()
    this.state = {
      searchedMovies: null,
      ratedMovies: null,
      genresContext: null,
    }
    this.guestId = JSON.stringify(localStorage.getItem('guestId'))
    this.searchMovies = debounce(async (evt) => {
      if (evt.target.value !== '') {
        try {
          const { results } = await api.getSearchedMovies(evt.target.value)
          this.setState({ searchedMovies: results }, () => console.log(this.state.searchedMovies))
        } catch (err) {
          console.error(err)
        }
      }
    }, 1000)
    this.renderMovies = (array) =>
      array &&
      array.map(({ genre_ids, id, title, overview, release_date, vote_average, poster_path }) => (
        <MovieCard
          key={id}
          movieId={id}
          guestId={this.guestId}
          movieGenres={genre_ids}
          title={title}
          releaseDate={release_date}
          rating={vote_average}
          poster={poster_path}
          description={overview}
        />
      ))
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
    try {
      const { genres } = await api.getGenres()
      this.setState({ genresContext: genres }, () => console.log(this.state.genresContext))
      console.log(genres)
    } catch (error) {
      console.error(error)
    }
    console.log('App mounted!')
  }
  render() {
    // const { fetchResult } = this.state
    return (
      <GenresProvider value={this.state.genresContext}>
        <SearchMovie searchMovies={this.searchMovies} />
        <MoviesList>{this.renderMovies(this.state.searchedMovies)}</MoviesList>
      </GenresProvider>
    )
  }
}
