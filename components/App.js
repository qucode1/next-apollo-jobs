import { withStyles } from "material-ui/styles"
import withRoot from "../lib/withRoot"
import { Fragment } from 'react'

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
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  }
})

const App = ({ children, classes }) => (
  <div className={classes.appFrame} >
    <Header />
    <Hidden smDown>
      <Navigation />
    </Hidden>
    <main className={classes.content}>
      {children}
    </main>
  </div>
)

export default withRoot(withStyles(styles)(App))