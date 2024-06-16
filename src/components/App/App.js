import React, { Component } from 'react'
import { Pagination, ConfigProvider, Tabs, Spin, Alert } from 'antd'

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
      guestId: JSON.parse(localStorage.getItem('guestId')),
      searchedMovies: null,
      ratedMovies: null,
      allRatedMovies: null,
      genresContext: null,
      totalResults: null,
      totalRatedPages: null,
      totalRatedResults: null,
      searchQuery: '',
      paginatorIsFetching: false,
      currentSearchingPage: null,
      currentRatedPage: null,
      isFetching: false,
      isError: false,
      errorMessage: '',
      defaultErrorMessage: 'An error occurred while searching.\nPlease try reloading the page.',
    }
    this.searchMovies = debounce(async (evt) => {
      this.setState({ searchQuery: evt.target.value, isSearchUpdating: true })
      if (evt.target.value !== '') {
        try {
          this.setState({ isFetching: true })
          const { results, total_results, page } = await api.getSearchedMovies(evt.target.value)
          this.setState({
            searchedMovies: results,
            totalResults: total_results === 0 ? null : total_results,
            currentSearchingPage: page,
          })
          window.scroll(0, 0)
          this.state.totalResults = null
        } catch (err) {
          console.error(err)
          this.setState({ isError: true, errorMessage: err.message })
        } finally {
          this.setState({ isFetching: false })
        }
      }
    }, 1000)
    this.renderMovies = (array) =>
      array &&
      array.map(({ genre_ids, id, title, rating, overview, release_date, vote_average, poster_path }) => (
        <MovieCard
          key={id}
          movieId={id}
          guestId={this.state.guestId}
          movieGenres={genre_ids}
          title={title}
          releaseDate={release_date}
          rating={vote_average}
          poster={poster_path}
          description={overview}
          refetchRatedMovies={this.setRatedMovies}
          setRatedMovies={this.setRatedMovies}
          selfRating={rating ? rating : this.checkSelfRating(this.state.allRatedMovies, id)}
        />
      ))
    this.getMoviesFromPage = async (pageNumber) => {
      this.setState({ isFetching: true })
      window.scroll(0, 0)
      try {
        const { results, page } = await api.getPaginationMovies(this.state.searchQuery, pageNumber)
        this.setState({ searchedMovies: results, currentSearchingPage: page })
      } catch (err) {
        console.error(err)
        this.setState({ isError: true, errorMessage: err.message })
      } finally {
        this.setState({ isFetching: false })
      }
    }
    this.getRatedMoviesFromPage = async (pageNumber) => {
      this.setState({ isFetching: true })
      window.scroll(0, 0)
      try {
        const { results, page } = await api.getRatedMoviesFromPage(this.state.guestId, pageNumber)
        this.setState({ ratedMovies: results, currentRatedPage: page })
      } catch (err) {
        console.error(err)
        this.setState({ isError: true, errorMessage: err.message })
      } finally {
        this.setState({ isFetching: false })
      }
    }
    this.setRatedMovies = async () => {
      try {
        const { results, total_pages, total_results, page } = await api.getRatedMovies(this.state.guestId)
        this.setState(
          {
            ratedMovies: results,
            totalRatedPages: total_pages,
            allRatedMovies: results,
            totalRatedResults: total_results,
            currentRatedPage: page,
          },
          () => {
            if (this.state.totalRatedPages > 1) this.getAllRatedMovies(2)
          }
        )
      } catch (err) {
        console.error(err)
        this.setState({ isError: true, errorMessage: err.message })
      }
    }
    this.getAllRatedMovies = async (pageNumber) => {
      if (pageNumber <= this.state.totalRatedPages) {
        const { results } = await api.getRatedMoviesFromPage(this.state.guestId, pageNumber)
        this.setState(
          ({ allRatedMovies }) => {
            return { allRatedMovies: [...allRatedMovies, ...results] }
          },
          () => {
            console.log(this.state.allRatedMovies)
            this.getAllRatedMovies(pageNumber + 1)
          }
        )
      }
    }
    this.checkSelfRating = (ratedMovies, id) => {
      const selfRating = ratedMovies && ratedMovies.find((ratedMovie) => ratedMovie.id === id)?.rating
      return selfRating ? selfRating : 0
    }
  }

  async componentDidMount() {
    console.log('mounted id: ', this.state.guestId)
    console.log('localStorage id: ', JSON.parse(localStorage.getItem('guestId')))

    if (this.state.guestId === null) {
      console.log('need renew guest id...')
      try {
        const { guest_session_id } = await api.getGuestId()
        localStorage.setItem('guestId', JSON.stringify(guest_session_id))
        this.setState({ guestId: JSON.parse(localStorage.getItem('guestId')) }, () =>
          console.log('new guest id: ', this.state.guestId)
        )
      } catch (err) {
        console.error(err)
        this.setState({ isError: true, errorMessage: err.message })
      }
    }
    await this.setRatedMovies()
    try {
      const { genres } = await api.getGenres()
      this.setState({ genresContext: genres }, () => console.log(this.state.genresContext))
    } catch (err) {
      console.error(err)
      this.setState({ isError: true, errorMessage: err.message })
    }
    console.log('App mounted!')
  }
  render() {
    const {
      genresContext,
      isFetching,
      searchedMovies,
      totalResults,
      ratedMovies,
      currentRatedPage,
      totalRatedResults,
      errorMessage,
      defaultErrorMessage,
      isError,
    } = this.state
    return (
      <Tabs
        defaultActiveKey="search"
        centered={true}
        items={[
          {
            key: 'search',
            label: 'Search',
            children: (
              <GenresProvider value={genresContext}>
                <main>
                  <SearchMovie searchMovies={this.searchMovies} />
                  <div className="movies-wrapper">
                    {isFetching ? (
                      <Spin size="large" />
                    ) : isError ? (
                      <Alert type="error" message={errorMessage ? errorMessage : defaultErrorMessage} />
                    ) : (
                      <MoviesList>{this.renderMovies(searchedMovies)}</MoviesList>
                    )}
                  </div>
                  <ConfigProvider
                    theme={{
                      components: {
                        Pagination: {
                          itemActiveBg: '#1677ff',
                        },
                      },
                    }}
                  >
                    {totalResults && (
                      <Pagination
                        current={this.state.currentSearchingPage}
                        onChange={(page) => {
                          this.getMoviesFromPage(page)
                        }}
                        defaultCurrent={1}
                        total={totalResults}
                        pageSize={20}
                        showSizeChanger={false}
                      />
                    )}
                  </ConfigProvider>
                </main>
              </GenresProvider>
            ),
          },
          {
            key: 'rated',
            label: 'Rated',
            children: (
              <GenresProvider value={genresContext}>
                <main>
                  <div className="movies-wrapper">
                    {isFetching ? <Spin size="large" /> : <MoviesList>{this.renderMovies(ratedMovies)}</MoviesList>}
                  </div>
                  <ConfigProvider
                    theme={{
                      components: {
                        Pagination: {
                          itemActiveBg: '#1677ff',
                        },
                      },
                    }}
                  >
                    {totalRatedResults && (
                      <Pagination
                        current={currentRatedPage}
                        onChange={(page) => {
                          this.getRatedMoviesFromPage(page)
                        }}
                        defaultCurrent={1}
                        total={totalRatedResults}
                        pageSize={20}
                        showSizeChanger={false}
                      />
                    )}
                  </ConfigProvider>
                </main>
              </GenresProvider>
            ),
          },
        ]}
        onChange={() => {}}
      />
    )
  }
}
