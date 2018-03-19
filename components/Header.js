import { Component } from "react"
import { withStyles } from 'material-ui/styles';
import { withApollo } from "react-apollo"

import { drawerWidth } from "../styles"

import Hidden from 'material-ui/Hidden';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';


const styles = theme => ({
  flex: {
    flex: 1,
  },
  appBar: {
    [theme.breakpoints.down('sm')]: {
      zIndex: theme.zIndex.drawer + 1
    },
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    }
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      renderAuthBtn: false
    }
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
  }
  componentDidMount() {
    this.setState({
      renderAuthBtn: true
    })
  }
  login() {
    this.props.auth.login()
    this.props.client.resetStore()
  }
  logout() {
    this.props.auth.logout()
    this.props.client.resetStore()
  }
  render() {
    const { classes, handleDrawerToggle, auth: { isAuthenticated } } = this.props
    return (
      <header>
        <AppBar position="absolute" className={classes.appBar} >
          <Toolbar>
            <Hidden mdUp >
              <IconButton className={classes.menuButton} color="inherit" aria-label="toggle navigation" onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
            </Hidden>
            <Typography variant="title" color="inherit" className={classes.flex}>
              Job Agency CMS
        </Typography>
            {this.state.renderAuthBtn
              ? !isAuthenticated()
                ? <Button onClick={this.login} color="inherit">Login</Button>
                : <Button onClick={this.logout} color="inherit">Logout</Button>
              : null
            }
          </Toolbar>
        </AppBar>
      </header>
    )
  }
}

export default withApollo(withStyles(styles)(Header))
