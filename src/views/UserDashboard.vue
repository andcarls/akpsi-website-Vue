<template>
    <PageLoader v-if="dataIsLoading"></PageLoader>
    <div id="app" v-if="!dataIsLoading">
        <navBar></navBar>
        <p style="text-align: center;">Welcome, {{ userName }}</p>
        <div v-if="needsUpdate">
            <h2>We noticed your profile hasn't been updated in {{ lastUpdated }} months</h2>
            <UserInformationEditor></UserInformationEditor>
        </div>
        <div v-if="financesMode">
            <div class="pie-chart-outer">
                <div class="pie-chart-inner">
                    <PieChart></PieChart>
                </div>
            </div>
            <TableVue :data="charges"></TableVue>
        </div>
        <div v-if="bDirectoryMode">

        </div>
        <div v-if="aDirectoryMode">

        </div>
    </div>
</template>

<script>
import { supabase } from '@/lib/supabase';
import { auth_signOut } from '../lib/auth';
import UserInformationEditor from '../components/UserInformationEditor.vue';
import NavBar from '../components/NavBar.vue'
import PieChart from '../components/PieChart.vue'
import TableVue from '../components/TableVue.vue'
import PageLoader from '../components/PageLoader.vue';
export default {
    name: 'UserDashboard',
    data() {
        return {
            session: '',
            userInformation: null,
            userName: '',
            needsUpdate: false,
            lastUpdated: 0,
            financesMode: true,
            charges: null,
            tableHeaders: {
                event_name: 'Event', event_date: 'Event Date', amount: 'Amount Due', due_date: 'Due Date', notes: 'Notes'
            },
            bDirectoryMode: false,
            aDirectoryMode: false,
            dataIsLoading: true,
        }
    },
    methods: {
        async signOut() {
            const signedOut = await auth_signOut();
            if (signedOut) {
                this.$router.push('/');
            }
        },
        async fetchSessionUserInfo() {
            const { data } = await supabase.auth.getSession();
            this.session = data.session;
            let { data: result } = await supabase
                .from('user_information')
                .select('last_updated, first_name, last_name, uniqname, graduation_year, college, industry')
                .eq('user_id', this.session.user.id)
                .single();
            this.userInformation = result;
            this.userName = this.userInformation.first_name;
            // Check last profile update -- if >= 4 months, return true
            // For profile to be reupdated
            let lastUpdate = new Date(this.userInformation.last_updated);
            let today = new Date();
            const yearsDiff = today.getFullYear() - lastUpdate.getFullYear();
            const monthsDiff = today.getMonth() - lastUpdate.getMonth();
            if (yearsDiff * 12 + monthsDiff >= 4) {
                this.lastUpdated = yearsDiff * 12 + monthsDiff;
                return true;
            }
            else {
                return false;
            }
        },
        async fetchFinanceInfo() {
            let currTime = Date.now();
            let finalTime = currTime + 500;
            let data;
            try {
                const { data: queryData, error } = await supabase
                    .from('user_charges')
                    .select(`
                    amount,
                    paid,
                    due_date,
                    notes,
                    events (event_name, event_date)
                `);
                if (error) {
                    throw error;
                }
                data = queryData;
            }
            catch (error) {
                alert(error.message);
            }
            finally {
                if (data.length != 0) {
                    this.charges = data.map(item => ({

                        'Event': item.events.event_name ? item.events.event_name : 'n/a',
                        'Event Date': item.events.event_date ? item.events.event_date : '...',
                        'Amount Due': item.amount ? item.amount : 'n/a',
                        'Due Date': item.due_date ? item.due_date : '...',
                        'Notes': item.notes ? item.notes : '...',
                    }));
                }
                while (currTime < finalTime) {
                    currTime = Date.now();
                }
                console.log(this.charges);
                this.dataIsLoading = false;
            }

            // this.charges = data;

            // this.charges = data.map(item => {
            //     const { events, ...rest } = item; // Destructure events from the object
            //     return { ...rest, ...events }; // Spread the remaining properties and events
            // });
        }
    },
    async beforeMount() {
        this.needsUpdate = await this.fetchSessionUserInfo();
        this.financesMode = !this.needsUpdate;
        this.fetchFinanceInfo();
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
    width: 100vw;
    text-align: center;
}

.pie-chart-inner {
    width: 70vw;
    /* justify-content: center; */
    /* text-align: center; */
    display: inline-block;
    margin: 0 auto;
}
</style>

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