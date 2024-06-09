import React, { Component } from 'react'
import { Rate } from 'antd'

import api from '../../utils/api'
import { getDescriptionText } from '../../utils/utils'
// import { formatDistanceToNow } from 'date-fns'
import './MovieCard.css'
export default class MovieCard extends Component {
  constructor() {
    super()
  }
  componentDidMount() {
    getDescriptionText(this.descriptionRef)
  }
  render() {
    const { movieId, guestId, description } = this.props
    return (
      <li className="movies-item">
        <div className="movie">
          <div className="movie__img-wrapper">
            <img className="movie__img" />
          </div>
          <div className="movie__header"></div>
          <div className="movie__description-container">
            <p ref={(ref) => (this.descriptionRef = ref)} className="movie__description">
              {description}
            </p>
          </div>
          <div className="movie__rate">
            <Rate
              count={10}
              defaultValue={0}
              allowHalf={true}
              onChange={(value) => {
                api.addRating(movieId, guestId, value)
              }}
            />
          </div>
        </div>
      </li>
    )
  }
}
