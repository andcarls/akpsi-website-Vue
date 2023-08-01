<template>
    <div>
        <Pie :data="data" :options="options" />
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
    data() {
        return chartConfig
    }
}


</script>