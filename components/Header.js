import { withStyles } from 'material-ui/styles';

import { drawerWidth } from "../styles"

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
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

const Header = ({ classes }) => (
  <header>
    <AppBar position="absolute" className={classes.appBar} >
      <Toolbar>
        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="title" color="inherit" className={classes.flex}>
          Job Agency CMS
        </Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>

  </header>
)

export default withStyles(styles)(Header)
