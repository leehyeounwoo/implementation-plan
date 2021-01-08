import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		comments: [
			{ page: '1', type: 'type', depth: 'depth', gui: 'gui', publ: 'publ', abil: 'abil', api: 'api', content: 'content' },
			{ page: '2', type: 'type', depth: 'depth', gui: 'gui', publ: 'publ', abil: 'abil', api: 'api', content: 'content' },
			{ page: '3', type: 'type', depth: 'depth', gui: 'gui', publ: 'publ', abil: 'abil', api: 'api', content: 'content' },
			{ page: '4', type: 'type', depth: 'depth', gui: 'gui', publ: 'publ', abil: 'abil', api: 'api', content: 'content' },
		],
	},
	mutations: {},
	actions: {},
	modules: {},
})
