import React from 'react'
import ReactDOM from 'react-dom'
import {
	BrowserRouter
} from 'react-router-dom'

import {
	Provider
} from 'mobx-react'

import {
	MuiThemeProvider,
	createMuiTheme,
} from 'material-ui/styles'
import { lightBlue, pink } from 'material-ui/colors';

import App from './App.jsx'
import {AppState, TopicStore} from '../store/store'



const initialState = window.__INITIAL__STATE__ || {} //eslint-disable-line

/*------主题创建---------*/
const theme = createMuiTheme ({
	palette: {
		primary: lightBlue,
		accent: pink,
		type: "light"
	}
})
const createApp = (TheApp) => {

	return class Main extends React.Component {
	  // Remove the server-side injected CSS.
	  componentDidMount() {
	    const jssStyles = document.getElementById('jss-server-side');
	    if (jssStyles && jssStyles.parentNode) {
	      jssStyles.parentNode.removeChild(jssStyles);
	    }
	  }

	  render() {
	    return <TheApp />
	  }
	}
}

const appState = new AppState(initialState.appState);
const topicStore = new TopicStore(initialState.topicStore);

const root=document.getElementById('root')
const render = (Component) => {
	ReactDOM.render(
		<Provider appState = {appState} topicStore={topicStore} >
			<BrowserRouter>
				<MuiThemeProvider theme={theme}>
					<Component />
				</MuiThemeProvider>
			</BrowserRouter>
		</Provider>,
		root
	)
}

render(createApp(App))