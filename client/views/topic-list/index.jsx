import React from 'react'
import PropTypes from 'prop-types'
import {
	observer,
	inject,
} from 'mobx-react'

/*是一个组件，实现每个页面有不同的title利于SEO优化*/
import Helmet from 'react-helmet'
/*--------url查询字符串转换为json--------*/
import queryString from 'query-string'

import Button from 'material-ui/Button'
import Tabs, {Tab} from 'material-ui/Tabs'
import List from 'material-ui/List'
import { CircularProgress } from 'material-ui/Progress'

import Container from '../layout/container'
import TopicListItem from './list-item'
import { tabs } from '../../until/variable-define'
import {AppState, TopicStore} from '../../store/store'
/*
const TopicList = () => {
	return [
		<Helmet key="Helmet">
			<title>This is topic-list pages</title>
			<meta name="description" content="this is topic-list description" />
		</Helmet>,
		<header key = "header">
			<h2>this is topic-list pages</h2>
		</header>,
		<section key = "section">
			<p>this is topic-list contend</p>
			<Button raised="true" color="primary">This is material-ui Button</Button>
		</section>,
		<footer key = "footer">
			页脚
		</footer>,
	]
}*/
@inject ((stores) => {
	return {
		appState: stores.appState,
		topicStore: stores.topicStore,
	}
})
@observer
export default class TopicList extends React.Component {

	static contextTypes = {
		router: PropTypes.object,
	}

	constructor(){
		super()

		this.changeTab = this.changeTab.bind(this)
		this.listItemClick = this.listItemClick.bind(this)

	}

	componentDidMount() {
		const tab = this.getTab()
		this.props.topicStore.fetchTopics(tab)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.search !== this.props.location.search) {

			this.props.topicStore.fetchTopics(this.getTab(nextProps.location.search))
		}
	}
	/*------获取路由查询参数--------*/
	getTab(search) {
		search = search || this.props.location.search
		const query = queryString.parse(search);
		return query.tab || 'all'
	}

	changeTab(e, value) {

		this.context.router.history.push({
			pathname: '/index',
			search: `?tab=${value}`
		})
	}

	listItemClick(topic) {
		this.context.router.history.push(`/detail/${topic.id}`)
	}

	render() {

		/*--------获取topicList内容-------*/
		const {
			topicStore,
		} = this.props;
		const topicList = topicStore.topics;
		const syncingTopics = topicStore.syncing;

		const tab = this.getTab()
		/*const topic = {
			title: 'This is title',
			username: "怀念不能",
			reply_count: 30,
			visit_count: 66,
			create_at: "2018-4-3",
			tab: "share",
		}*/

		return (
			<div>
				<Helmet key="Helmet">
					<title>This is topic-list pages</title>
					<meta name="description" content="this is topic-list description" />
				</Helmet>
				<Tabs value= {tab} onChange={this.changeTab}>
					{
						Object.keys(tabs).map((t) => (
							<Tab key={t} label={tabs[t]} value={t} />
						))
					}
				</Tabs>
				<List>
					{
						topicList.map(topic => <TopicListItem key={topic.id} onClick={() => this.listItemClick(topic)} topic= {topic} /> )
					}
				
				</List>
				{
					syncingTopics ? (
						<div 
							style={{
								display: 'flex',
								justifyContent: 'space-around',
								padding: '40px 0'
							}}>
							<CircularProgress color="inherit" size={100} />
						</div> 
					) :
					null
				}
			</div>

		)
	}
}
TopicList.propTypes = {
	appState: PropTypes.instanceOf(AppState),
	topicStore: PropTypes.instanceOf(TopicStore),
	location: PropTypes.object.isRequired,
}