import React, { Component } from 'react'
import { Rate } from 'antd'
import { format } from 'date-fns'

import api from '../../utils/api'
import { getDescriptionText } from '../../utils/utils'
import { GenresConsumer } from '../../contexts/genresContext'

import './MovieCard.css'
import noImage from './no-image.jpg'
export default class MovieCard extends Component {
  constructor() {
    super()
  }
  componentDidMount() {
    getDescriptionText(this.descriptionRef)
  }
  render() {
    const {
      movieId,
      selfRating,
      guestId,
      description,
      movieGenres,
      title,
      releaseDate = null,
      refetchRatedMovies,
      poster,
      rating,
    } = this.props
    return (
      <GenresConsumer>
        {(genres) => (
          <li className="movies-item">
            <div className="movie">
              <div className="movie__img-wrapper">
                <img className="movie__img" src={poster ? `https://image.tmdb.org/t/p/original${poster}` : noImage} />
              </div>
              <div className="movie__header">
                <h2 className="movie__title">{title}</h2>
                <p className="movie__released">{releaseDate && format(new Date(releaseDate), 'MMMM d, yyyy')}</p>
                <ul className="movie__genres-list">
                  {movieGenres &&
                    movieGenres.map((genreId, idx) => (
                      <li key={idx} className="movie__genre">
                        <span>{genres && genres.find(({ id }) => id === genreId).name}</span>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="movie__description-container">
                <p ref={(ref) => (this.descriptionRef = ref)} className="movie__description">
                  {description}
                </p>
              </div>
              <div className="movie__rate">
                <Rate
                  count={10}
                  defaultValue={selfRating}
                  allowHalf={true}
                  onChange={async (value) => {
                    await api.addRating(movieId, guestId, value)
                    await refetchRatedMovies()
                  }}
                />
              </div>
              <span className="movie__rating">{rating.toFixed(1)}</span>
            </div>
          </li>
        )}
      </GenresConsumer>
    )
  }
}
