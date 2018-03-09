import { withRouter } from 'next/router'
import { withStyles } from "material-ui/styles"
import { drawerWidth } from "../styles"
import Link from 'next/link'

import Drawer from "material-ui/Drawer"
import Divider from 'material-ui/Divider';
import List from 'material-ui/List';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import HomeIcon from 'material-ui-icons/Home';
import SearchIcon from "material-ui-icons/Search"
import InfoIcon from "material-ui-icons/Info"
import MoreIcon from "material-ui-icons/More"

const styles = theme => ({
    drawerPaper: {
        position: 'relative',
        width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
})

const Navigation = ({ classes, router: { pathname } }) => {
    return (
        <Drawer
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
            anchor="left"
        >
            <div className={classes.toolbar} />
            <Divider />
            <List>
                <ListItem button>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <Link prefetch href='/' >
                                <a>Home</a>
                            </Link>
                        }
                    />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <SearchIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <Link prefetch href='/search' >
                                <a>Search</a>
                            </Link>
                        }
                    />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <InfoIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <Link prefetch href='/about' >
                                <a>About</a>
                            </Link>
                        }
                    />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <MoreIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <Link prefetch href='/materialui' >
                                <a>MaterialUi Example</a>
                            </Link>
                        }
                    />
                </ListItem>
            </List>
        </Drawer>

        //   <Link prefetch href='/about'>
        //     <a className={pathname === '/about' ? 'is-active' : ''}>About</a>
        //   </Link>
        //   <Link prefetch href='/search'>
        //     <a className={pathname === '/search' ? "is-active" : ""}>Search</a>
        //   </Link>
        //   <Link prefetch href='/materialui'>
        //     <a className={pathname === '/materialui' ? "is-active" : ""}>Material Example</a>
        //   </Link>
    )
}

export default withStyles(styles)(withRouter(Navigation))