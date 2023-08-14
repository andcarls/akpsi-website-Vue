<template>
    <h1 style="text-align: center;" v-if="!tableData">{{ emptyMsg }}</h1>
    <div class="table-container" v-if="tableData">
        <div class="search-bar">
            <customInput v-model="search" :placeHolder="'Search'" type="text"></customInput>
        </div>
        <table>
            <tr>
                <th v-for="(head, key) in Object.keys(tableData[0])" :key="key">
                    {{ head }}
                </th>
            </tr>
            <tr v-for="(item, key) in filteredData" :key="key">
                <td v-for="(val, key) in item" :key="key">
                    <!-- {{ val }} -->
                    <span v-html="highlightMatch(val)"></span>
                </td>
            </tr>
        </table>
    </div>
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
        filteredData: {
            get() {
                return this.data.filter(row => {
                    for (const col in row) {
                        if (row[col].toString().toLowerCase().includes(this.search.toLowerCase())) {
                            return true;
                        }
                    }
                    return false;
                })
            }
        },
        emptyMsg: {
            get() {
                return this.emptyMessage;
            }
        }
    },
    methods: {
        highlightMatch(text) {
            const regex = new RegExp(`(${this.search})`, 'gi');
            return text.toString().replace(regex, '<span class="highlight" style="background-color: #ebeb0096;">$1</span>');
        }
    },
    components: {
        customInput
    }
}
</script>

<style scoped>
.table-container {
    width: 95%;
    margin: 5px auto;
}

table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
    width: 100%;
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

div .search-bar {
    display: flex;
    justify-content: right;
    margin-bottom: 8px;
}
</style>