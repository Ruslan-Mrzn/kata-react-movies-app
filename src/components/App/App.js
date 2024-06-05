import React, { Component } from 'react'

import api from '../../utils/api'
import './App.css'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      fetchResult: null,
    }
  }

  async componentDidMount() {
    const res = await api.getTestData()
    console.log(res)
    this.setState({
      fetchResult: res,
    })
  }
  render() {
    const { fetchResult } = this.state
    return (
      <div>
        Ready for develop
        {console.log(fetchResult)}
      </div>
    )
  }
}
