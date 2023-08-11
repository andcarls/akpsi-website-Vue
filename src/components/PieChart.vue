<template>
    <div>
        <Pie :data="chartData" :options="options" v-if="chartData" />
    </div>
</template>

<style scoped>
div {
    /* width: 50vh;
    position: relative; */
}
</style>

<script>
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js'
import { Pie } from 'vue-chartjs'
import * as chartConfig from './chartConfig.ts'
import { Colors } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend, Colors)

export default {
    name: 'PieChart',
    components: {
        Pie
    },
    props: ['pieData'],
    beforeMount() {
        console.log('before mounting pie chart');
    },
    computed: {
        chartData: {
            get() {
                return this.pieData;
            }
        }
    },
    data() {
        return chartConfig;
    }
}


</script>