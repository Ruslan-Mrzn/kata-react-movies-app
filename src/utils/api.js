class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl
    this._headers = options.headers
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json()
    }
    return Promise.reject(`Ошибка: ${res.status}`)
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

  getSearchedMovies() {
    return fetch(`${this._baseUrl}search/movie?query=return`, {
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
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NDkyY2QwMjFmZjBlZGFlNTBmN2JiNzUyYzI4MTY4ZCIsInN1YiI6IjY2NWRjMjU4YTQyMTNiOWQ5MTc5OTNlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.thEvtOl9L9eLVvISRwUMSSazkdCz_zioll_vA05HhK8',
  },
})

export default api
