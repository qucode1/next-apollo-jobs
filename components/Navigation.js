import { Component, Fragment } from "react"
import Router, { withRouter } from 'next/router'
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

class CustomLink extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        Router.prefetch(`/${this.props.route}`)
    }
    render() {
        return (
            <Fragment>
                {this.props.name || this.props.route}
            </Fragment>
        )
    }
}

class Navigation extends Component {
    constructor(props) {
        super(props)
        this.handleRoutes = this.handleRoutes.bind(this)
    }
    handleRoutes = (route) => {
        this.props.router.push(`${route}`)
    }
    render() {
        const { classes, router: { pathname } } = this.props
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
                    <ListItem
                        button
                        onClick={e => this.handleRoutes("/")}
                    >
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <CustomLink route="/" name="home" />
                            }
                        />
                    </ListItem>
                    <ListItem
                        button
                        onClick={e => this.handleRoutes("/search")}
                    >
                        <ListItemIcon>
                            <SearchIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <CustomLink route="search" />
                            }
                        />

                    </ListItem>
                    <ListItem
                        button
                        onClick={e => this.handleRoutes("/about")}
                    >
                        <ListItemIcon>
                            <InfoIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <CustomLink route="about" />
                            }
                        />

                    </ListItem>
                    <ListItem
                        button
                        onClick={e => this.handleRoutes("/materialui")}
                    >
                        <ListItemIcon>
                            <MoreIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <CustomLink route="materialui" />
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
}

export default withStyles(styles)(withRouter(Navigation))