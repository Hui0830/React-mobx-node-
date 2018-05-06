import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import ListItem from 'material-ui/List/ListItem'
import ListItemAvatar from 'material-ui/List/ListItemAvatar'
import ListItemText from 'material-ui/List/ListItemText'
import Avatar from 'material-ui/Avatar'
import HomeIcon from 'material-ui-icons/Home'
import { withStyles } from 'material-ui/styles'

import {
	topicPrimaryStyle,
	topicSecondaryStyles,
} from './style'
import { tabs } from '../../until/variable-define'
import dataFormat from '../../until/data-format'

const Primary = ({ classes, topic }) => {

	const classNames = classnames({
		[classes.tab]: true,
		[classes.top]: topic.top,
	})
	return (

		<span className={ classes.root }>
			<span className={ classNames }>{topic.top ? '置顶' : tabs[topic.tab]}</span>
			<span className= { classes.title }>{topic.title}</span>
		</span>
	)
}
const Secondary = ({ classes, topic }) => {
	return(

		<span className={ classes.root }>
			<span className={ classes.username }>{topic.author.loginname}</span>
			<span className={ classes.count }>
				<span className={ classes.accentColor }> {topic.reply_count} </span>
				<span>/</span>
				<span> {topic.visit_count} </span>
			</span>
			<span>
				创建时间：{dataFormat(topic.create_at,'yyyy年mm月dd日——hh:mm:ss')}
			</span>
		</span>
	)
}
Primary.propTypes = {
	topic: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
}
Secondary.propTypes = {
	topic: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
}

const StylePrimary = withStyles(topicPrimaryStyle)(Primary);
const StyleSecondary = withStyles(topicSecondaryStyles)(Secondary)

 const TopicListItem = ({onClick, topic}) => (

	<ListItem button onClick={onClick}>
		<ListItemAvatar>
			<Avatar src={topic.author.avatar_url} />
		</ListItemAvatar>
		<ListItemText 
			primary={<StylePrimary topic={topic} />}
			secondary={<StyleSecondary topic={topic} />}
		 />
	</ListItem>
)

 TopicListItem.propTypes = {
 	onClick: PropTypes.func.isRequired,
 	topic: PropTypes.object.isRequired,
 }
 export default TopicListItem