<template>
    <h1 style="text-align: center;" v-if="!tableData">{{ emptyMsg }}</h1>
    <div class="table-container" v-if="tableData">
        <div class="search-bar">
            <button @click="$emit('refresh-table')">Refresh Table</button>
        </div>
        <div class="search-bar">
            <customInput v-model="search" :placeHolder="'Search'" type="text"></customInput>
        </div>
        <table>
            <tr>
                <th v-for="(head, key) in Object.keys(tableData[0])" :key="key">
                    <p>
                        {{ head }}
                    </p>
                </th>
            </tr>
            <tr v-for="(item, rowInd) in filteredData" :key="rowInd">
                <td v-for="(val, colInd) in item" :key="colInd" @dblclick="editing[rowInd + '-' + colInd] = true">
                    <div>
                        <span v-html="highlightMatch(val)" v-show="!editing[rowInd + '-' + colInd]"></span>
                    </div>
                    <input type="text" v-model="item[colInd]" v-show="editing[rowInd + '-' + colInd]"
                        @keyup.enter="logUpdate(val, item, rowInd, colInd)">
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
import customInput from './customInput.vue'
export default {
    name: 'EditableTableVue',
    props: ['data', 'emptyMessage'],
    emits: ['update-cell', 'refresh-table'],
    data() {
        return {
            debt: true,
            search: '',
            disabled: {},
            editing: {
            },
            updatedData: {}
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
                // return this.data;
                return this.data.filter(row => {
                    for (const col in row) {
                        if (row[col] && row[col].toString().toLowerCase().includes(this.search.toLowerCase())) {
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
            if (text) {
                return text.toString().replace(regex, '<span class="highlight" style="background-color: #ebeb0096;">$1</span>');
            }
            return text;
        },
        logUpdate(val, item, rowInd, colInd) {
            console.log('updating' + val + item);
            let updatedItem = { [colInd]: val };
            this.$emit('update-cell', updatedItem, item);
            this.editing[rowInd + '-' + colInd] = false;
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