import React from 'react'

import PropTypes from 'prop-types'

import {
	Link,
	withRouter
} from 'react-router-dom'

import Routes from '../config/router'

import MainAppBar from './layout/app-bar'
import Container from './layout/container'
  
class App extends React.Component{

	constructor(props){
		super(props);

		
	}

	ComponentDidMount() {
		console.log(createStoreMap)
	}

/*	asyncBootstrap() {
		return new Promise((resolve) => {
			setTimeout (() => {
				this.props.appState.count = 3
				resolve(true)
			}, 10)
		})
	}*/

	render(){

		return[
			<MainAppBar location={this.props.location} key="MainAppBar" />,
			<Container key =" primary">
				<Routes key = "router" />
			</Container>,
		]
	}
}
export  default withRouter (App)
