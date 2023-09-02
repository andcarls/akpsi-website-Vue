<template>
    <PageLoader v-if="dataIsLoading"></PageLoader>
    <!-- {{ financesMode }}
    {{ bDirectoryMode }}
    {{ aDirectoryMode }} -->
    <div id="app" v-if="!dataIsLoading">
        <navBar v-if="!needsUpdate"></navBar>
        <p style="text-align: center;">Welcome, {{ userName }}</p>
        <div v-if="needsUpdate" class="profile-updater">
            <h2>We noticed your profile hasn't been updated in {{ lastUpdated }} months</h2>
            <UserInformationEditor @success="refreshPage"></UserInformationEditor>
        </div>
        <div v-if="!needsUpdate">
            <div class="pie-chart-outer" v-if="charges">
                <div class="pie-chart-inner">
                    <PieChart :pieData="pieChartData" v-if="!dataIsLoading"></PieChart>
                </div>
            </div>
            <TableVue :data="charges" :emptyMessage="`Congratulations! You're debt free.`"></TableVue>
            <p class="show-paid" @click="this.showPaidCharges = !this.showPaidCharges"
                v-if="paidCharges && !this.showPaidCharges" style="width:fit-content;">Show Paid Charges</p>
            <p class="show-paid" @click="this.showPaidCharges = !this.showPaidCharges"
                v-if="paidCharges && this.showPaidCharges" style="width:fit-content;">Hide Paid Charges</p>
            <TableVue :data="paidCharges" v-if="showPaidCharges">
            </TableVue>
        </div>
        <div class="reimbursement-form" v-if="!needsUpdate">
            <a href="https://forms.gle/ms4Bqp18g6U8riv67" target="_blank" rel="noopener noreferrer">Reimbursement Request
                Form</a>
        </div>
    </div>
</template>

<script>
import UserInformationEditor from '../components/UserInformationEditor.vue';
import NavBar from '../components/NavBar.vue'
import PieChart from '../components/PieChart.vue'
import TableVue from '../components/TableVue.vue'
import PageLoader from '../components/PageLoader.vue';
export default {
    name: 'UserFinances',
    computed: {
        userName: {
            get() {
                return this.$store.getters.getUserName;
            }
        },
        needsUpdate: {
            get() {
                return this.$store.getters.getNeedsUpdate;
            }
        },
        lastUpdated: {
            get() {
                return this.$store.getters.getLastUpdated;
            }
        },
        charges: {
            get() {
                return this.$store.getters.getCharges;
            }
        },
        paidCharges: {
            get() {
                return this.$store.getters.getPaidCharges;
            }
        }
    },
    data() {
        return {
            showPaidCharges: false,
            dataIsLoading: true,
            pieChartData: {
                labels: [],
                datasets: [
                    {
                        data: [],
                    }
                ]
            },
        }
    },
    methods: {
        async fillPieChart() {
            if (this.charges) {
                this.charges.forEach((element) => {
                    this.pieChartData.labels.push(element.Event);
                    this.pieChartData.datasets[0].data.push(element['Amount Due']);
                })
            }
        },
        refreshPage() {
            location.reload();
        }
    },

    async beforeMount() {
        // Initial data fetching
        await this.$store.dispatch('fetchFinanceData');
        await this.$store.dispatch('fetchUserData');
        this.financesMode = !this.$store.getters.getNeedsUpdate;
        await this.fillPieChart();
        this.dataIsLoading = false;
    },
    async mounted() {
        await this.$store.dispatch('loadAll');
    },
    components: {
        UserInformationEditor,
        NavBar,
        PieChart,
        TableVue,
        PageLoader
    }


}
</script>

<style>
[v-cloak] {
    display: none;
}

body {
    padding: 0;
    margin: 0;
}

.pie-chart-outer {
    width: 100%;
    text-align: center;
}

.pie-chart-inner {
    width: 70%;
    max-width: 500px;
    /* justify-content: center; */
    /* text-align: center; */
    display: inline-block;
    margin: 0 auto;
}
</style>

<style scoped>
.show-paid {
    margin-left: 2.5%;
    color: rgb(145, 145, 145);
    font-size: small;
}

.show-paid:hover {
    cursor: pointer;
    text-decoration: underline;
    color: rgb(91, 91, 91);
}

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

div .reimbursement-form {
    all: revert;
    /* background-color: red; */
    text-align: right;
    width: 95%;
    margin: 5px auto;

}

div .reimbursement-form a {
    color: black;
    /* padding: 18.762px; */
}
</style>

<style scoped>
div .profile-updater {
    padding: 30px;
}
</style>