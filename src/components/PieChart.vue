<template>
    <div class="pie-chart-container" style="height: 500px;  position: relative;">
        <Pie :data="data" :options="options" />
    </div>
</template>


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