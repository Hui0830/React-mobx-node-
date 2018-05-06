import {
	observable,
	toJs,
	computed,
	action,
	extendObservable,
} from 'mobx'

import { topicSchema,replySchema } from '../until/variable-define'
import { get } from '../until/http'

const createTopic = (topic) => {
	return Object.assign({}, topicSchema, topic)
}

const createReply= (reply) => {
	return Object.assign({}, replySchema, reply)
}

class Topic {
	constructor(data) {
		extendObservable(this, data)
	}

	@observable syncing = false
	@observable createdReplies = []
	@action doReply(content) {
		return new Promise((resolve, reject) => {
			post(`/topic/${this.id}/replies`, {
				needAccessToken: true,
			}, {content})
			.then((resp) => {
				if (resp.success) {
					this.createdReplies.push(createReply({
						id: resp.data.reply_id,
						content,
						create_at: Date.now(),
					}))
					resolve()
				} else {
					reject(resp)
				}
			})
			.catch(reject) 
		})
	}
}


export default class TopicStore {

	@observable topics
	@observable syncing
	@observable details

	constructor({ syncing = false, topics = [], details = [] } = {}) {
		this.syncing = syncing;
		this.topics = topics.map(topic => new Topic(createTopic(topic)));
		this.details = topics.map(topic => new Topic(createTopic(topic)));

	}

	addTopic(topic) {
		this.topics.push(new Topic(createTopic(topic)))
	}

	@computed get detailsMap() {
		return this.details.reduce((res, detail) => {
			res[detail.id] = detail;
			return res
		},{})
	}

	@action fetchTopics(tab) {
		return new Promise((resolve, reject) => {
			this.syncing = true;
			this.topics = [];
			get('topics', {
				madrender: false,
				tab,

			}).then((resp) => {
				if (resp.success) {
					resp.data.forEach((topic) => {
						this.addTopic(topic)
					})
					
					resolve()
				}else {
					reject()
				}
				this.syncing = false;
			}).catch((err) => {
				reject(err)
				this.syncing = false;
			})
		})
	}

	/*------详情数据获取-----*/
	@action getTopicDetail(id) {
		return new Promise((resolve, reject) => {
			if (this.detailsMap[id]) {
				resolve(this.detailMap[id])
			} else {
				get(`/topic/${id}`, {
					madrender: false,
				}).then(resp => {
					if (resp.success) {
						const topic = new Topic(createTopic(resp.data));
						this.details.push(topic);
						resolve(topic);
					}else {
						reject()
					}
				}).catch(reject)
			}
		})
	}
}