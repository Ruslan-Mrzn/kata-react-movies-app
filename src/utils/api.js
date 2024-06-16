class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl
    this._headers = options.headers
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json()
    }
    return Promise.reject(res)
  }

  getGuestId() {
    return fetch(`${this._baseUrl}authentication/guest_session/new`, {
      method: 'GET',
      headers: this._headers,
    }).then(this._checkResponse)
  }

  getRatedMovies(guestId) {
    return fetch(`${this._baseUrl}guest_session/${guestId}/rated/movies`, {
      method: 'GET',
      headers: this._headers,
    }).then(this._checkResponse)
  }

  getRatedMoviesFromPage(guestId, pageNumber) {
    return fetch(`${this._baseUrl}guest_session/${guestId}/rated/movies?page=${pageNumber}`, {
      method: 'GET',
      headers: this._headers,
    }).then(this._checkResponse)
  }

  getSearchedMovies(query) {
    return fetch(`${this._baseUrl}search/movie?query=${query}`, {
      method: 'GET',
      headers: this._headers,
    }).then(this._checkResponse)
  }

  getPaginationMovies(query, pageNumber) {
    return fetch(`${this._baseUrl}search/movie?query=${query}&page=${pageNumber}`, {
      method: 'GET',
      headers: this._headers,
    }).then(this._checkResponse)
  }

  getGenres() {
    return fetch(`${this._baseUrl}genre/movie/list`, {
      method: 'GET',
      headers: this._headers,
    }).then(this._checkResponse)
  }

  addRating(movieId, guestId, value) {
    return fetch(`${this._baseUrl}movie/${movieId}/rating?guest_session_id=${guestId}`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({ value: value }),
    }).then(this._checkResponse)
  }
}

const api = new Api({
  baseUrl: 'https://api.themoviedb.org/3/',
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNTM3MDYxOGY2MjMyYmE2ODA1NTcyZjQyMTMwYzY0NSIsInN1YiI6IjY2NWRjMjU4YTQyMTNiOWQ5MTc5OTNlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.oLITDeOYv6q1oNcvknTAATCq8wzRxVUslwHqZtnzyYs',
  },
})

export default api
