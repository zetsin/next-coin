import React from 'react'
import Link from 'next/link'
import { withStyles } from 'material-ui/styles'

import Drawer from 'material-ui/Drawer'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import Hidden from 'material-ui/Hidden'
import Divider from 'material-ui/Divider'
import MenuIcon from 'material-ui-icons/Menu'
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table'
import Paper from 'material-ui/Paper'

import withRoot from '../src/withRoot'
import coins from '../data/coins'

import { CCTX } from '../models'

const drawerWidth = 240

const styles = theme => ({
  root: {
    width: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  appBar: {
    position: 'fixed',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  drawerHeader: {
    justifyContent: 'center'
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64,
      marginLeft: drawerWidth
    },
  },
  itemSelected: {
    background: theme.palette.grey[300]
  },
  paper: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
})

class Component extends React.Component {
  state = {
    mobileOpen: false,
    title: ''
  }

  onDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen })
  }

  render() {
    const { classes, theme, router, cctx } = this.props

    const drawer = (
      <div>
        <Toolbar className={classes.drawerHeader}>
          <Typography type="headline" color="secondary" noWrap>
            {this.state.title}
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {coins.map(key => (
            <Link key={key} href={`?coin=${key}`}>
              <ListItem button component="a" className={router.query.coin === key ? classes.itemSelected : ''}>
                <ListItemText primary={key} />
              </ListItem>
            </Link>
          ))}
        </List>
      </div>
    )

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.onDrawerToggle}
                className={classes.navIconHide}
              >
                <MenuIcon />
              </IconButton>
              <Typography type="title" color="inherit" noWrap>
                {router.query.coin}
              </Typography>
            </Toolbar>
          </AppBar>
          <Hidden mdUp>
            <Drawer
              type="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={this.state.mobileOpen}
              classes={{
                paper: classes.drawerPaper,
              }}
              onClose={this.onDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden smDown implementation="css">
            <Drawer
              type="permanent"
              open
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <main className={classes.content}>
            <Paper className={classes.paper}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    {Object.keys(cctx.tickers[0] || {}).map((key, index) => (
                      <TableCell key={index} numeric>{key}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cctx.tickers.map((item, index) => (
                    <TableRow key={index}>
                      {Object.keys(item).map((key, index) => (
                        <TableCell key={index} numeric>{item[key]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </main>
        </div>
      </div>
    )
  }

  componentDidMount() {
    const { router, dispatch } = this.props

    this.setState({
      title: document.title
    })

    dispatch(CCTX.fetchTickers(router.query.coin))

    setInterval(() => {
      console.log(router.query.coin)
    }, 1000)
  }

  componentWillReceiveProps() {
    const { router, dispatch } = this.props

    // dispatch(CCTX.fetchTickers(router.query.coin))
  }
}

export default withRoot(withStyles(styles, { withTheme: true })(Component))
