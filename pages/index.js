import { Component, Fragment } from "react"

import App from '../components/App'
import withData from '../lib/withData'

import Auth from "../components/Auth"
import Me from '../components/Me'

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
            ? <Me />
            : <h3>You are not authenticated!</h3>
          : <h3>Loading...</h3>
        }
      </App>
    )
  }
}

export default withData(Index)
