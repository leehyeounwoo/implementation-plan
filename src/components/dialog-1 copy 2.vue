<template>
	<v-row>
		<v-col cols="12">
			<v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
				<template v-slot:activator="{ on, attrs }">
					<v-text-field v-model="test" label="기간" prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on"></v-text-field>
				</template>

				<v-date-picker v-model="dates" range>
					<v-spacer></v-spacer>
					<v-btn text color="primary" @click=";(menu2 = false), cancel()">
						Cancel
					</v-btn>
					<v-btn text color="primary" @click="Ok()">
						OK
					</v-btn></v-date-picker
				>
			</v-menu>
		</v-col>
	</v-row>
</template>
<script>
export default {
	props: {
		date_picker: Object,
	},
	data: () => ({
		menu2: false,
		test: [],
		dates: ['2019-09-10', '2019-09-20'],
	}),
	computed: {
		// dateRangeText() {
		// 	return this.dates.join(' ~ ')
		// },
	},
	methods: {
		Ok() {
			this.test = this.dates.join(' ~ ')
			this.menu2 = false
		},
		cancel() {
			this.test = ''
			this.menu2 = false
		},
	},
}
</script>
