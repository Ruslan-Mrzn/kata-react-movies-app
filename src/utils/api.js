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

  getTestData() {
    return fetch(this._baseUrl, {
      method: 'GET',
      headers: this._headers,
    }).then(this._checkResponse)
  }
}

const api = new Api({
  baseUrl: 'https://api.themoviedb.org/3/search/movie?query=return',
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NDkyY2QwMjFmZjBlZGFlNTBmN2JiNzUyYzI4MTY4ZCIsInN1YiI6IjY2NWRjMjU4YTQyMTNiOWQ5MTc5OTNlNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.thEvtOl9L9eLVvISRwUMSSazkdCz_zioll_vA05HhK8',
  },
})

export default api
