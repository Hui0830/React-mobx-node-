import React from 'react'

import {
	Route,
	Redirect,
	Switch
} from "react-router-dom"

import TopicList from '../views/topic-list/index'
import TopicDetail from '../views/topic-detail/index'
import UserLogin from '../views/user/login'
import UserInfo from '../views/user/info'
import TeseApi from '../views/test/api-test'

export default () => (
<Switch>
	<Route path = "/"  exact render = {() => <Redirect to = "/index" />} key = "first"   />
	<Route path= "/index" component = {TopicList} key = "list" exact />
	<Route path="/detail/:id" component = {TopicDetail} key = "detail" />
	<Route path="/test" component = {TeseApi} key = "test" />
	<Route path="/user/login" component = {UserLogin} key = 'login' />
	<Route path="/user/info" component = {UserInfo} key = 'info' />
</Switch>
)