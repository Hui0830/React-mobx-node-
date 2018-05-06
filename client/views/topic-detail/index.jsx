import React from 'react'
import PropTypes from 'prop-types'
import marked from 'marked'
import Helmet from 'react-helmet'
import {
	inject,
	observer,
} from 'mobx-react'

import  {withStyles}  from 'material-ui/styles'
import Paper from 'material-ui/Paper'
import {CircularProgress}  from 'material-ui/Progress'
import Button from 'material-ui/Button'
import IconReply from 'material-ui-icons/Reply'

import SimperMDE from 'react-simplemde-editor'

import Container from '../layout/container'

import { topicDetailStyle } from './styles'
import  Reply from './reply'
import dataFormat from '../../until/data-format'


@inject ((stores) => {
	return {
		topicStore: stores.topicStore,
		user: stores.appState.user,
	}
}) @observer 
class TopicDetail extends React.Component{
	static contextTypes = {
		router:PropTypes.object,
	}
	constructor(props){
		super(props)

		this.state = {
			newReply: ''
		}

		this.handleNewReplyChange = this.handleNewReplyChange.bind(this)
		this.goToLogin = this.goToLogin.bind(this)
	}

	componentDidMount() {

		const id = this.props.match.params.id;
		this.props.topicStore.getTopicDetail(id);
	}

	/*-------话题创建-------*/
	handleNewReplyChange(value) {
		this.setState({
			newReply:value,
		})
	}
	/*----- 获取话题------*/
	/*getTopic() {
		const id = this.props.match.params.id
		console.log(this.props.topicStore.detailsMap[id])
		return this.props.topicStore.detailsMap[id]
	}*/
	/*-------登入并回复-------*/
	goToLogin() {
		this.context.router.history.push('/user/login')
	}

	/*--------回复---------*/
	/*doReply() {
		const topic = this.getTopic()
		topic.doReply(this.state.newReply)
		.then(() => {
			this.setState({
				newReply: '',
			}).catch((err) => {
				console.log(err)
			})
		})
	}*/

	render() {

		const {
			classes,
			user,
		} = this.props;
		const id = this.props.match.params.id
		const topic = this.props.topicStore.detailsMap[id]
		if (!topic) {
			return (
				<Container>
					<section className={classes.loadingContainer}>
						<CircularProgress color='inherit' />
					</section>
				</Container>
			)
		}

		return (
			<div>

					<Helmet>
						<title>
							{topic.title}
						</title>
					</Helmet>

					<header className={ classes.header }>
						<h3>{ topic.title }</h3>
					</header>
					<Container>
					<section className={ classes.body }>
						<p dangerouslySetInnerHTML={{__html: marked(topic.content)}} />
					</section>
					</Container>
					
					<Paper elevation={4} className={classes.replies}>
						<header className={ classes.replyHeader }>
							<span> { `${topic.reply_count} 回复` } </span>
							<span> { `最新回复：${dataFormat(topic.last_reply_at, 'yyyy年mm月dd日')} ` } </span>
						</header>
						
						{
							user.isLogin ?
							<section className={classes.replyEditor}>
								<SimperMDE 
								 onChange={this.handleNewReplyChange}
								 value={this.state.newReply}
								 options={
								 	{
								 		toolbar: false,
								 		autoFocus: false,
								 		spellChecker: false,
								 		placeHolder: '添加回复话题'
								 	}
								 } /> 
								 <Button
								 	fab
								 	color="primary"
								 	onClick={this.doReply}
								 	className={classes.replyButton}>
								 	<IconReply />
								 </Button>
							 </section> :
							 <section className={classes.notLoginButton}>
							 	<Button raised color="inherit" onClick={this.goToLogin}>
							 		登入并回复
							 	</Button>
							 </section>
						}
						
						<section>
							 {
							 	topic.replies.map(reply => <Reply reply={reply} />)
							 }
						</section>
					</Paper>
			</div>
		)
	}
}

TopicDetail.wrappedComponent.propTypes = {
	topicStore: PropTypes.object.isRequired,
	user: PropTypes.object.isRequired,
}

TopicDetail.propTypes = {
	match: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
}
export default withStyles(topicDetailStyle)(TopicDetail)