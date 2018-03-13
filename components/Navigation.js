import { Component, Fragment } from "react"
import Router, { withRouter } from 'next/router'
import { withStyles } from "material-ui/styles"
import { drawerWidth } from "../styles"
import Link from 'next/link'

import Hidden from 'material-ui/Hidden';
import Drawer from "material-ui/Drawer"
import Divider from 'material-ui/Divider';
import List from 'material-ui/List';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import HomeIcon from 'material-ui-icons/Home';
import SearchIcon from "material-ui-icons/Search"
import InfoIcon from "material-ui-icons/Info"
import MoreIcon from "material-ui-icons/More"


const styles = theme => ({
    activeBgColor: {
        backgroundColor: theme.palette.action.active,
        "&:hover": {
            backgroundColor: theme.palette.action.active,
        }
    },
    activeTextColor: {
        color: theme.palette.getContrastText(theme.palette.action.active),
    },
    drawerPaper: {
        width: drawerWidth,
        [theme.breakpoints.up('md')]: {
            position: 'relative',
        }
    },
    toolbar: theme.mixins.toolbar,
})


class Navigation extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { classes, router: { pathname } } = this.props
        const nav = (
            <List
                component="nav"
            >
                <Link prefetch href='/'>
                    <ListItem
                        classes={pathname === "/" && { root: classes.activeBgColor }}
                        button
                    >
                        <ListItemIcon
                            classes={pathname === "/" && { root: classes.activeTextColor }}
                        >
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText
                            classes={pathname === "/" && { primary: classes.activeTextColor }}
                            primary={
                                <a>Home</a>
                            }
                        />
                    </ListItem>
                </Link>

                <Link prefetch href='/search'>
                    <ListItem
                        button
                        classes={pathname === "/search" && { root: classes.activeBgColor }}
                    >
                        <ListItemIcon
                            classes={pathname === "/search" && { root: classes.activeTextColor }}
                        >
                            <SearchIcon />
                        </ListItemIcon>
                        <ListItemText
                            classes={pathname === "/search" && { primary: classes.activeTextColor }}
                            primary={
                                <a>Search</a>
                            }
                        />

                    </ListItem>
                </Link>

                <Link prefetch href='/about'>
                    <ListItem
                        button
                        classes={pathname === "/about" && { root: classes.activeBgColor }}
                    >
                        <Fragment>
                            <ListItemIcon
                                classes={pathname === "/about" && { root: classes.activeTextColor }}
                            >
                                <InfoIcon />
                            </ListItemIcon>
                            <ListItemText
                                classes={pathname === "/about" && { primary: classes.activeTextColor }}
                                primary={
                                    <a>About</a>
                                }
                            />
                        </Fragment>
                    </ListItem>
                </Link>

                <Link prefetch href='/materialui'>
                    <ListItem
                        button
                        classes={pathname === "/materialui" && { root: classes.activeBgColor }}
                    >
                        <Fragment>
                            <ListItemIcon
                                classes={pathname === "/materialui" && { root: classes.activeTextColor }}
                            >
                                <MoreIcon />
                            </ListItemIcon>
                            <ListItemText
                                classes={pathname === "/materialui" && { primary: classes.activeTextColor }}
                                primary={
                                    <a>MaterialUi</a>
                                }
                            />
                        </Fragment>
                    </ListItem>
                </Link>
            </List>
        )
        return (
            <Fragment>
                <Hidden smDown>
                    <Drawer
                        variant="permanent"
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        anchor="left"
                    >
                        <div className={classes.toolbar} />
                        <Divider />
                        {nav}

                    </Drawer>
                </Hidden>
                <Hidden mdUp>
                    <Drawer
                        variant="temporary"
                        anchor="left"
                        open={this.props.open}
                        onClose={this.props.handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper
                        }}
                        ModalProps={{
                            keepMounted: true
                        }}
                    >
                        {nav}
                    </Drawer>
                </Hidden>
            </Fragment>
        )
    }
}

export default withStyles(styles)(withRouter(Navigation))