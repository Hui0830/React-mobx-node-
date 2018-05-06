import React from 'react'
import PropTypes from 'prop-types'
import marked from 'marked'

import Avatar from 'material-ui/Avatar'
import { withStyles } from 'material-ui/styles'

import { replyStyle } from './styles'
import dataFormat from '../../until/data-format'

const Reply = ({ reply, classes }) => {
	return (

		<div className={classes.root}>
			<div className={classes.left}>
				<Avatar src={reply.author.avatar_url} />
			</div>

			<div className={classes.right}>
				<span>
					{`${reply.author.loginname}: ${dataFormat(reply.create_at, 'yyyy年mm月dd日-hh:mm:ss')}`}
				</span>
				<p dangerouslySetInnerHTML={{__html: marked(reply.content)}} />
			</div>
		</div>
	)
}

Reply.propTypes = {
	reply: PropTypes.object.isRequired,
	classes: PropTypes.object.isRequired,
}

export default withStyles(replyStyle)(Reply)