<template>
	<div>
		<v-data-table
			:headers="headers"
			:items="$store.state.comments"
			item-key="page"
			show-expand=""
			class="elevation-1"
			:search="search"
			:items-per-page="10"
			:footer-props="{
				itemsPerPageOptions: [10, 20, 30],
			}"
		>
			<template v-slot:top>
				<v-layout wrap align-center>
					<v-flex lg9 xs12>
						<v-text-field v-model="search" label="검색" class="mx-4" prepend-inner-icon="mdi-magnify"></v-text-field>
					</v-flex>
					<v-flex lg3 xs12>
						<div class="text-right mr-4">
							<v-btn block color="primary" @click="dialog = true">수행계획 추가</v-btn>
						</div>
					</v-flex>
				</v-layout>
			</template>
			<template v-slot:no-data>
				<div>답글이 없습니다!</div>
			</template>
		</v-data-table>
		<v-dialog v-model="dialog" max-width="700px">
			<v-card>
				<v-card-title>
					<span class="headline">수행계획 생성</span>
					<v-spacer></v-spacer>
					<v-btn icon large color="primary" @click="plus"><v-icon>mdi-plus</v-icon></v-btn>
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
								<v-text-field v-model="액션" label="액션" outlined></v-text-field>
							</v-col>
							<v-col cols="12">
								<div class="text-center">
									<v-pagination v-model="page" :length="pageCount" circle @click="page_Lookup()"></v-pagination>
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
	</div>
</template>
<script>
export default {
	components: {},

	data() {
		return {
			page: 1,
			pageCount: 1,
			dialog: false,
			search: '',
			headers: [
				{ text: '구분', align: 'start', value: 'type' },
				{ text: '뎁스', align: 'start', value: 'depth' },
				{ text: 'GUI', align: 'start', value: 'gui' },
				{ text: '퍼블리싱', align: 'start', value: 'publ' },
				{ text: '기능개발', align: 'start', value: 'abil' },
				{ text: 'API 현황', align: 'start', value: 'api' },
				{ text: '제공기능', align: 'start', value: 'content' },
				{ text: '액션', value: 'actions', sortable: false },
			],
		}
	},
	methods: {
		plus() {
			this.pageCount = this.pageCount += 1
			console.log(this.page)
		},
		page_Lookup() {
			console.log(this.page)
		},
		create_plan() {
			console.log(this.page, this.type, this.depth, this.gui, this.publ, this.abil, this.api, this.content)
		},
	},
}
</script>
<style lang="scss">
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
	max-width: 450px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
