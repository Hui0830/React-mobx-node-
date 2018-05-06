export const topicPrimaryStyle = (theme) => {
	return {
		root: {
			display: 'flex',
			aliginItems: 'center',
		},
		title: {
			color: '#555',
		},
		tab: {
			backgroundColor: theme.palette.primary[500],
			textAligin: 'center',
			display: 'inline-block',
			padding: '0 6px',
			color: '#fff',
			bordeRadius: 3,
			marginRight: 10,
			fontSize: "12px",
		},
		top: {
			backgroundColor: theme.palette.accent[500],
		}

	}
}

export const topicSecondaryStyles = (theme) => {
	return {
		root: {
			display: 'flex',
			aliginItems: 'center',
			paddingTop: 3,
		},
		count: {

			textAligin: 'center',
			marginRight: 20,

		},
		username: {
			marginRight: 20,
			color: '#9e9e9e',
		},
		accentColor: {
			color: theme.palette.accent[300]
		}

	}
}