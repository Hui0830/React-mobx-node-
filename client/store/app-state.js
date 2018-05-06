import {
	observable,
	computed,
	autorun,
	action
} from 'mobx'
import axios from 'axios'
import { post, get } from '../until/http'

export default class AppState {

	@observable user = {
	  isLogin: false,
	  info: {},
	  detail: {
	    syncing: false,
	    recent_topics: [],
	    recent_replies: [],
	  },
	  collections: {
	    syncing: false,
	    list: [],
	  },
	}


	@action login(accessToken) {
		return new Promise ((resolve, reject) => {
			post('user/login', {}, {
				accessToken,
			}).then((resp) => {
				if (resp.success) {
					this.user.isLogin = true;
					this.user.info = resp.data;
					resolve()
				} else {
					reject(resp)
				}
			}).catch(reject)
		})

	}


	@action getUserDetail(loginname) {
	  this.user.detail.syncing = true
	  return new Promise((resolve, reject) => {
	    axios.get(`/api/user/${loginname}`)
	      .then(resp => {
	        if (resp.status === 200 && resp.data.success) {
	          this.user.detail.recent_replies = resp.data.data.recent_replies
	          this.user.detail.recent_topics = resp.data.data.recent_topics
	          resolve()
	        } else {
	          reject(resp.data.msg)
	        }
	        this.user.detail.syncing = false
	      }).catch(err => {
	        reject(err.message)
	        this.user.detail.syncing = false
	      })
	  })
	}

	@action getUserCollection(loginname) {
	  this.user.collections.syncing = true
	  return new Promise((resolve, reject) => {
	    axios.get(`/api/topic_collect/${loginname}`)
	      .then(resp => {
	        if (resp.status === 200 && resp.data.success) {
	          this.user.collections.list = resp.data.data
	          resolve()
	        } else {
	          reject(resp.data.msg)
	        }
	        this.user.collections.syncing = false
	      }).catch(err => {
	        reject(err.message)
	        this.user.collections.syncing = false
	      })
	  })
	}

}
