import { Component, Fragment } from 'react'
import withRoot from "../lib/withRoot"
import { withStyles } from "material-ui/styles"

import Hidden from 'material-ui/Hidden';

import Header from "./Header"
import Navigation from "./Navigation"

const styles = theme => ({
  "@global": {
    body: {
      margin: 0
    }
  },
  appFrame: {
    display: "flex",
    width: "100%",
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  }
})

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this)
  }
  handleDrawerToggle = () => {
    this.setState(state => ({
      open: !state.open
    }))
  }
  render() {
    const { children, classes } = this.props
    return (
      <div className={classes.appFrame} >
        <Header handleDrawerToggle={this.handleDrawerToggle} />
        <Navigation open={this.state.open} handleDrawerToggle={this.handleDrawerToggle} />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {children}
        </main>
      </div>
    )
  }
}
export default withRoot(withStyles(styles)(App))