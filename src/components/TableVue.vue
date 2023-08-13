<template>
    <h1 style="text-align: center;" v-if="!tableData">{{ emptyMsg }}</h1>
    <customInput v-model="search" :label="'Search'"></customInput>
    {{ search }}
    <table v-if="tableData">
        <tr>
            <th v-for="(head, key) in Object.keys(tableData[0])" :key="key">
                {{ head }}
            </th>
        </tr>
        <tr v-for="(item, key) in filteredData" :key="key">
            <td v-for="(val, key) in item" :key="key">
                {{ val }}
            </td>
        </tr>
    </table>
</template>

<script>
import customInput from './customInput.vue'
export default {
    name: 'TableVue',
    props: ['data', 'emptyMessage'],
    data() {
        return {
            debt: true,
            search: ''
        }
    },
    computed: {
        tableData: {
            get() {
                return this.data;
            }
        },
        emptyMsg: {
            get() {
                return this.emptyMessage;
            }
        }
    },
    components: {
        customInput
    }
}
</script>

<style scoped>
table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 95%;
    margin: 5px auto;
}

td,
th {
    border: 1px solid #c8c8c8;
    text-align: left;
    padding: 8px;
}

tr:nth-child(even) {
    background-color: #dddddd;
}
</style>