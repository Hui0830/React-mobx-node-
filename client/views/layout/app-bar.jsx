import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import {
	inject,
	observer
} from 'mobx-react'

import AppBar from 'material-ui/AppBar'
import ToolBar from 'material-ui/ToolBar'
import Button from 'material-ui/Button'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'
import HomeIcon from 'material-ui-icons/Home'

const styles = {
	root: {
		width: '100',
	},
	flex: {
		flex: 1,
	}
}
@inject ((stores) => {
	return {
		appState: stores.appState,
		user: stores.appState.user,
	}
}) @observer
class MainAppBar extends React.Component {
	static contextTypes = {
		router: PropTypes.object
	}
	constructor() {
		super()

		this.onHomeIconClick = this.onHomeIconClick.bind(this)
		this.loginButtonClick = this.loginButtonClick.bind(this)
		this.createButtonClick= this.createButtonClick.bind(this)
	}

	onHomeIconClick() {
		this.context.router.history.push('/index')
	}

	loginButtonClick() {
	  const { location } = this.props

	  if (location.pathname !== '/user/login') {
	    if (this.props.user.isLogin) {
	      this.context.router.history.push('/user/info')
	    } else {
	      this.context.router.history.push({
	        pathname: '/user/login',
	        search: `?from=${location.pathname}`,
	      })
	    }
	  }
	}

	createButtonClick() {

	}

	render() {
		const { classes } = this.props
		const {
			user,
		} = this.props
		return(
			<div className={classes.root}>
				<AppBar position="fixed">
					<ToolBar>
						<IconButton color="secondary" onClick={this.onHomeIconClick}>
							<HomeIcon />
						</IconButton>
						<Typography type="title" color="secondary" className={classes.flex}>
							JNode
						</Typography>
						<Button raised="true" color="default" onClick={this.createButtonClick}>
							新建话题
						</Button>
						<Button color="secondary" onClick={this.loginButtonClick}>
							{
								user.isLogin ? user.info.loginname : "登录"
							}
						</Button>
					</ToolBar>
				</AppBar>
			</div>
		)
	}
}
MainAppBar.wrappedComponent.propTypes = {
	appState: PropTypes.object.isRequired,
}
MainAppBar.propTypes = {
	classes: PropTypes.object.isRequired,
}
export default withStyles(styles)(MainAppBar)