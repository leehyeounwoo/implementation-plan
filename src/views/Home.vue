<template>
	<div>
		<v-data-table
			:headers="headers"
			:items="$store.state.comments"
			item-key="page"
			show-expand=""
			class="elevation-1"
			:search="search"
			disable-pagination
			:hide-default-footer="true"
		>
			<template v-slot:top>
				<v-layout wrap align-center>
					<v-flex lg9 xs12>
						<v-text-field v-model="search" label="검색" class="mx-4" prepend-inner-icon="mdi-magnify"></v-text-field>
					</v-flex>
					<v-flex lg3 xs12>
						<div class="text-right mr-4">
							<v-btn block color="primary" @click=";(dialog = true), add_plan()">수행계획 추가</v-btn>
						</div>
					</v-flex>
				</v-layout>
			</template>
			<template v-slot:no-data>
				<div>답글이 없습니다!</div>
			</template>
			<template v-slot:[`item.api`]="{ item }">
				<v-layout>
					<div class="answer-title">{{ item.api }}</div>
				</v-layout>
			</template>
			<template v-slot:[`item.content`]="{ item }">
				<v-layout>
					<div class="answer-title">{{ item.function }}</div>
				</v-layout>
			</template>
			<template v-slot:[`item.actions`]="{ item }">
				<div>
					<v-icon small class="mr-2" @click="editDialog(item.id)">
						mdi-pencil
					</v-icon>
					<v-icon small @click="deleteItem(item.id)">
						mdi-delete
					</v-icon>
				</div>
			</template>
		</v-data-table>
		<v-dialog v-model="dialog" max-width="750px" persistent>
			<v-card>
				<v-card-title>
					<span class="headline">수행계획 생성</span>
					<v-spacer></v-spacer>
					<v-card-actions>
						<v-btn color="error" @click="dialog = false">취소</v-btn>
						<v-btn color="primary" @click="create_plan">생성</v-btn>
						<v-btn icon large color="primary" @click="plus"><v-icon>mdi-plus</v-icon></v-btn>
					</v-card-actions>
				</v-card-title>

				<v-card-text>
					<v-container class="pa-0">
						<v-row>
							<v-col cols="12">
								<v-text-field v-model="type" label="구분" outlined></v-text-field>
								<v-combobox v-model="depth" label="뎁스" multiple outlined chips class="deps"></v-combobox>
								<v-row>
									<v-col cols="6">
										<v-text-field v-model="gui" type="number" label="GUI(%)" outlined></v-text-field>
									</v-col>
									<v-col cols="6">
										<date_picker :date_picker="date_picker1" />
									</v-col>
								</v-row>
								<v-row>
									<v-col cols="6">
										<v-text-field v-model="publ" type="number" label="퍼블리싱(%)" outlined></v-text-field>
									</v-col>
									<v-col cols="6">
										<date_picker :date_picker="date_picker2" />
									</v-col>
								</v-row>
								<v-row>
									<v-col cols="6">
										<v-text-field v-model="abil" type="number" label="기능개발(%) 숫자만 입력" outlined></v-text-field>
									</v-col>
									<v-col cols="6">
										<date_picker :date_picker="date_picker3" />
									</v-col>
								</v-row>

								<v-textarea class="api" outlined label="API현황" v-model="api"></v-textarea>

								<v-textarea class="content" outlined label="제공기능" v-model="content"></v-textarea>
							</v-col>

							<v-col cols="12">
								<div class="text-center">
									<v-pagination v-model="page" :length="pageCount" circle v-on:input="page_Lookup"></v-pagination>
								</div>
							</v-col>
						</v-row>
					</v-container>
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>

					<v-btn color="error" @click="dialog = false">취소</v-btn>
					<v-btn color="primary" @click="create_plan">생성</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="dialog1" max-width="700px" persistent>
			<v-card>
				<v-card-title>
					<span class="headline">수행계획 수정</span>
					<v-spacer></v-spacer>
					<!-- <v-btn icon large color="primary" @click="plus"><v-icon>mdi-plus</v-icon></v-btn> -->
				</v-card-title>

				<v-card-text>
					<v-container class="pa-0">
						<v-row>
							<v-col cols="12">
								<v-text-field v-model="type" label="구분" outlined></v-text-field>
								<v-text-field v-model="depth" label="뎁스" outlined></v-text-field>
								<v-text-field v-model="gui" label="GUI" outlined></v-text-field>
								<v-text-field v-model="publ" label="퍼블리싱" outlined></v-text-field>
								<v-text-field v-model="abil" label="기능개발" outlined></v-text-field>
								<v-text-field v-model="api" label="API현황" outlined></v-text-field>
								<v-text-field v-model="content" label="제공기능" outlined></v-text-field>
							</v-col>
						</v-row>
					</v-container>
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="error" @click="modify(id)">log</v-btn>
					<v-btn color="error" @click="cancel_modify">취소</v-btn>
					<v-btn color="primary" @click="create_plan">수정</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<!-- <date_picker :date_picker="dateDialog1" :Ok="OK1" />
		<date_picker :date_picker="dateDialog2" :Ok="OK2" />
		<date_picker :date_picker="dateDialog3" :Ok="OK3" /> -->
		<!-- <dateDialog :dateDialog="dateDialog1" :Ok="OK1" />
		<dateDialog :dateDialog="dateDialog2" :Ok="OK2" />
		<dateDialog :dateDialog="dateDialog3" :Ok="OK3" /> -->
	</div>
</template>
<script>
// import Vue from 'vue'

import { date_picker } from '@/components'

export default {
	components: { date_picker },

	data() {
		return {
			date: new Date().toISOString().substr(0, 10),
			date_picker1: {
				value: [],
				dialog: false,
			},
			date_picker2: {
				value: [],
				dialog: false,
			},
			date_picker3: {
				value: [],
				dialog: false,
			},
			// dateDialog1: {
			// 	value: [],
			// 	dialog: false,
			// },
			// dateDialog2: {
			// 	value: [],
			// 	dialog: false,
			// },
			// dateDialog3: {
			// 	value: [],
			// 	dialog: false,
			// },
			test: [
				{
					type: '',
					depth: [],
					gui: '',
					public: '',
					abil: '',
					api: '',
					function: '',
				},
			],
			page: 1,
			pageCount: 1,
			dialog: false,
			dialog1: false,
			search: '',
			content: '',
			api: '',
			abil: '',
			publ: '',
			gui: '',
			depth: [],
			type: '',
			dataPerPage: 7,
			dateRangeText1: '',
			dateRangeText2: '',
			dateRangeText3: '',
			headers: [
				{ text: '구분', align: 'start', value: 'type', width: 100 },
				{ text: '뎁스', align: 'start', value: 'depth', width: 100 },
				{ text: 'GUI', align: 'start', value: 'gui', width: 100 },
				{ text: '퍼블리싱', align: 'start', value: 'publ', width: 100 },
				{ text: '기능개발', align: 'start', value: 'abil', width: 100 },
				{ text: 'API 현황', align: 'start', value: 'api', width: 150 },
				{ text: '제공기능', align: 'start', value: 'content', width: 150 },
				{ text: '액션', value: 'actions', sortable: false, width: 100 },
			],
		}
	},

	created() {
		this.plan_look()
	},

	watch: {
		type() {
			this.test[this.page - 1].type = this.type
		},
		depth() {
			this.test[this.page - 1].depth = this.depth
		},
		gui() {
			this.test[this.page - 1].gui = this.gui
		},
		publ() {
			this.test[this.page - 1].publ = this.publ
		},
		abil() {
			this.test[this.page - 1].abil = this.abil
		},
		api() {
			this.test[this.page - 1].api = this.api
		},
		content() {
			this.test[this.page - 1].content = this.content
		},
	},
	methods: {
		onlyOneP(val) {
			return val.substring(0, val.indexOf('</p>'))
		},
		plan_look() {
			this.$http.get('http://192.168.0.25:2002' + '/plans').then(result => {
				console.log(result)
				this.$store.state.comments = result.data
			})
		},
		// OK1(dates) {
		// 	this.dateRangeText1 = dates.join(' ~ ')
		// 	this.dateDialog1.dialog = false
		// },
		// OK2(dates) {
		// 	this.dateRangeText2 = dates.join(' ~ ')
		// 	this.dateDialog2.dialog = false
		// },
		// OK3(dates) {
		// 	this.dateRangeText3 = dates.join(' ~ ')
		// 	this.dateDialog3.dialog = false
		// },
		modify() {
			console.log(this.id)
			// this.$store.state.comments.splice(
			// 	this.$store.state.comments.indexOf(comend_id),
			// 	1,
			// 	((this.$store.state.comments[comend_id - 1].type = this.type),
			// 	(this.depth = this.$store.state.comments[comend_id - 1].depth = this.depth),
			// 	(this.gui = this.$store.state.comments[comend_id - 1].gui = this.gui),
			// 	(this.publ = this.$store.state.comments[comend_id - 1].publ = this.publ),
			// 	(this.abil = this.$store.state.comments[comend_id - 1].abil = this.abil),
			// 	(this.api = this.$store.state.comments[comend_id - 1].api = this.api),
			// 	(this.content = this.$store.state.comments[comend_id - 1].content = this.content)),
			// )
		},
		cancel() {
			this.id = this.id -= 1
			this.dialog = false
			this.type = ''
			this.depth = ''
			this.gui = ''
			this.publ = ''
			this.abil = ''
			this.api = ''
			this.content = ''
		},
		cancel_modify() {
			this.dialog1 = false

			this.type = ''
			this.depth = ''
			this.gui = ''
			this.publ = ''
			this.abil = ''
			this.api = ''
			this.content = ''
		},
		deleteItem(id) {
			console.log(this.$store.state.comments[id])
			// this.$store.state.comments.splice(this.$store.state.comments.indexOf(id), 1)
			// this.$store.state.comments.splice(this.$store.state.comments.indexOf, id, 1)
			// this.$store.state.comments.splice(id, 1)
			// console.log(id)
		},
		editDialog(id) {
			this.dialog1 = true
			console.log(this.$store.state.comments)
			console.log(id)
			if (this.$store.state.comments[id - 1]) {
				this.id = this.$store.state.comments[id - 1].id
				this.type = this.$store.state.comments[id - 1].type
				this.depth = this.$store.state.comments[id - 1].depth
				this.gui = this.$store.state.comments[id - 1].gui
				this.publ = this.$store.state.comments[id - 1].publ
				this.abil = this.$store.state.comments[id - 1].abil
				this.api = this.$store.state.comments[id - 1].api
				this.content = this.$store.state.comments[id - 1].content
			} else {
				this.type = ''
				this.depth = ''
				this.gui = ''
				this.publ = ''
				this.abil = ''
				this.api = ''
				this.content = ''
			}
		},
		// log() {
		// 	for (this.i = 0; this.i < this.pageCount; this.i += 1) {
		// 		// console.log(this.i)
		// 		this.$store.state.comments.push(this.test[this.i])
		// 	}
		// 	console.log(this.$store.state.comments)
		// 	this.dialog = false
		// 	this.test = [
		// 		{
		// 			id: this.id + 1,
		// 			type: '',
		// 			depth: '',
		// 			gui: '',
		// 			publ: '',
		// 			abil: '',
		// 			api: '',
		// 			content: '',
		// 		},
		// 	]
		// 	this.pageCount = 1
		// 	this.page = 1
		// 	this.type = ''
		// 	this.depth = ''
		// 	this.gui = ''
		// 	this.publ = ''
		// 	this.abil = ''
		// 	this.api = ''
		// 	this.content = ''
		// 	console.log(this.id)
		// },

		save() {
			// this.$store.state.comments = this.test
			// this.$store.state.comments.push(this.test)
			// this.test.push({
			// type: this.type,
			// depth: this.depth,
			// gui: this.gui,
			// publ: this.publ,
			// abil: this.abil,
			// api: this.api,
			// content: this.content,
			// })
		},
		add_plan() {
			// this.type = ''
			// this.depth = ''
			// this.gui = ''
			// this.publ = ''
			// this.abil = ''
			// this.api = ''
			// this.content = ''
		},
		plus() {
			this.pageCount = this.pageCount += 1
			this.page = this.pageCount
			this.test.push({
				type: this.type,
				depth: this.depth,
				gui: this.gui,
				public: this.publ,
				abil: this.abil,
				api: this.api,
				function: this.content,

				// type: this.type,
				// depth: this.depth,
				// gui: this.gui,
				// public: this.publ,
				// abil: this.abil,
				// api: this.api,
				// function: this.content,
				// id: this.id,
				// type: '',
				// depth: '',
				// gui: '',
				// publ: '',
				// abil: '',
				// api: '',
				// content: '',
			})

			this.type = ''
			this.depth = ''
			this.gui = ''
			this.publ = ''
			this.abil = ''
			this.api = ''
			this.content = ''
			// this.test.push({
			// 	// Vue.set(this.test.type, this.page - 1, this.type)
			// 	type: '',
			// 	depth: '',
			// 	gui: '',
			// 	public: '',
			// 	abil: '',
			// 	api: '',
			// 	function: '',
			// })
		},
		page_Lookup() {
			if (this.test[this.page - 1]) {
				this.type = this.test[this.page - 1].type
				this.depth = this.test[this.page - 1].depth
				this.gui = this.test[this.page - 1].gui
				this.publ = this.test[this.page - 1].publ
				this.abil = this.test[this.page - 1].abil
				this.api = this.test[this.page - 1].api
				this.content = this.test[this.page - 1].content
			} else {
				this.type = ''
				this.depth = ''
				this.gui = ''
				this.publ = ''
				this.abil = ''
				this.api = ''
				this.content = ''
				//----------------------------------------------
				// console.log(this.test[this.page - 1])
				// this.type = this.test[this.page - 1].type
				// this.depth = this.test[this.page - 1].depth
				// this.gui = this.test[this.page - 1].gui
				// this.publ = this.test[this.page - 1].publ
				// this.abil = this.test[this.page - 1].abil
				// this.api = this.test[this.page - 1].api
				// this.content = this.test[this.page - 1].content

				// this.test[this.page - 1].splice({
				// 	type: this.type,
				// 	depth: this.depth,
				// 	gui: this.gui,
				// 	publ: this.publ,
				// 	abil: this.abil,
				// 	api: this.api,
				// 	content: this.content,
				// })

				// console.log(this.test[this.page - 1])
				//----------------------------------------------
			}
		},
		create_plan() {
			console.log(this.pageCount)
			for (let i = 1; i < this.pageCount; i += 1) {
				console.log('sss')
				const body = {
					type: this.test[i - 1].type,
					depth: this.test[i - 1].depth,
					gui: this.test[i - 1].gui,
					public: this.test[i - 1].publ,
					abil: this.test[i - 1].abil,
					api: this.test[i - 1].api,
					function: this.test[i - 1].content,
				}
				this.$http.post('http://192.168.0.25:2002' + '/plans', body).then(res => {
					console.log(res.data)
					console.log('sss')
					console.log(body)
					this.plan_look()
				})
			}

			// {
			// 	type: this.type,
			// 	depth: this.depth,
			// 	gui: this.gui,
			// 	public: this.publ,
			// 	abil: this.abil,
			// 	api: this.api,
			// 	function: this.content,
			// }
			// this.$http.post('http://192.168.0.25:2002' + '/plans', body).then(res => {
			// 	console.log(res.data)
			// 	console.log('sss')
			// 	console.log(body)
			// 	this.plan_look()
			// })
			this.dialog = false
			this.type = ''
			this.depth = ''
			this.gui = ''
			this.publ = ''
			this.abil = ''
			this.api = ''
			this.content = ''
			// console.log(this.test)
			// this.$store.state.comments = this.test
			// this.$store.state.comments.push(this.test)
			// this.$store.state.comments.push({
			// 	type: this.type,
			// 	depth: this.depth,
			// 	gui: this.gui,
			// 	publ: this.publ,
			// 	abil: this.abil,
			// 	api: this.api,
			// 	content: this.content,
			// })
			// console.log(this.page, this.type, this.depth, this.gui, this.publ, this.abil, this.api, this.content)
			// this.type = ''
			// this.depth = ''
			// this.gui = ''
			// this.publ = ''
			// this.abil = ''
			// this.api = ''
			// this.content = ''
			// this.$store.state.comments.type = this.type
			// this.$store.state.comments.depth = this.depth
			// console.log(this.$store.state.comments)
		},
	},
}
</script>
<style lang="scss">
.api .v-input__slot,
.content .v-input__slot {
	height: 90px;
}
.deps .v-input__slot {
	height: 56px;
	// margin: 0px;
}
.answer {
	margin: 15px 0;
	height: auto;
	width: 100%;
	text-overflow: ellipsis;
	word-break: break-all;
	overflow-y: auto;
}
.answer-title {
	margin-top: 2px;
	display: inline-block;
	max-width: 200px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
