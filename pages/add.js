import { Component } from "react"

import App from '../components/App'
import withData from '../lib/withData'

import AddData from '../components/AddData'
import Auth from "../components/Auth"
import { isAbsolute } from 'path';

const auth = new Auth()

class Add extends Component {
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
        {
          this.state.inBrowser
            ? auth.isAuthenticated()
              ? <AddData />
              : <h3>You are not authenticated!</h3>
            : <h3>Loading...</h3>
        }
      </App>
    )
  }
}

export default withData(Add)
