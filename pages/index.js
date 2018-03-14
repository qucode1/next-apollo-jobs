import { Component, Fragment } from "react"

import App from '../components/App'
import withData from '../lib/withData'

import Auth from "../components/Auth"
import User from '../components/User'

const auth = new Auth()

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inBrowser: false
    }
  }
  componentDidMount() {
    this.setState({
      inBrowser: true
    })
  }
  render() {
    return (
      <App>
        {this.state.inBrowser
          ? auth.isAuthenticated()
            ? <User />
            : <h3>You are not authenticated!</h3>
          : <h3>Loading...</h3>
        }
      </App>
    )
  }
}

export default withData(Index)
