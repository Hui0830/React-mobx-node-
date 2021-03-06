import React, {Component} from 'react'

import axios from 'axios'
/*eslint-disable*/
export default class TestApi extends Component {

	getTopics() {
		axios.get ('api/topics')
			.then(resp => {
				console.log(resp)
			}).catch(err => {
				console.log(err)
			})
	}

	login() {
		axios.post('/api/user/login',{
			accessToken: '465f8425-caf7-4b45-9103-0df413e00d12'
		}).then(resp => {
			console.log(resp)
		}).catch(err => {
				console.log(err)
		})
	}

	markAll() {
		axios.post('/api/messages/mark_all?needAccessToken=true')
			.then(resp => {
				console.log(resp)
			}).catch(err => {
				console.log(err)
			})
	}

	render() {
		return (
			<div>
				<button onClick = {this.getTopics} >topics</button>
				<button onClick = {this.login} >login</button>
				<button onClick = {this.markAll} >markAll</button>
			</div>
		)
	}
}
/*eslint-ensable*/