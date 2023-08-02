<template>
    <h1 v-if="!tableData">Congratulations! You're debt free.</h1>
    <table v-if="tableData">
        <tr>
            <th v-for="(head, key) in Object.keys(tableData[0])" :key="key">
                {{ head }}
            </th>
        </tr>
        <tr v-for="(charge, key) in tableData" :key="key">
            <td v-for="(val, key) in charge" :key="key">
                {{ val }}
            </td>
        </tr>
    </table>
</template>

<script>
export default {
    name: 'TableVue',
    props: ['data'],
    data() {
        return {
            debt: true,
        }
    },
    computed: {
        tableData: {
            get() {
                return this.data;
            }
        },
    },
}
</script>

<style scoped>
table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
    margin: 5px;
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