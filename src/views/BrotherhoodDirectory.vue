<template>
    <PageLoader v-if="dataIsLoading"></PageLoader>
    <div v-if="!dataIsLoading" id="app" v-cloak>
        <NavBar></NavBar>
        <h1 style="text-align: center;">Brotherhood Directory</h1>
        <TableVue :data="brotherInfo" :emptyMessage="'Hmmm... We don\'t have any data'"></TableVue>
    </div>
</template>

<script>
import PageLoader from '@/components/PageLoader.vue';
import NavBar from '../components/NavBar.vue';
import { supabase } from '@/lib/supabase';
import TableVue from '@/components/TableVue.vue';
export default {
    name: 'BrotherhoodDirectory',
    methods: {
        async loadBDatabase() {
            let data;
            try {
                // Get brotherhood data, sorted by last name
                const { data: queryData, error } = await supabase
                    .from('user_information')
                    .select(`
                    first_name,
                    last_name,
                    school_email,
                    phone,
                    graduation_year
                    `)
                    .order('last_name');
                if (error) { throw error; }
                else { data = queryData }
            }
            catch (error) {
                alert(error.message);
            }
            finally {
                if (data.length != 0) {
                    let currDate = new Date();
                    let gradYear;
                    if (currDate.getMonth() > 6) {
                        gradYear = currDate.getFullYear();
                    }
                    else {
                        gradYear = currDate.getFullYear() - 1;
                    }
                    this.brotherInfo = data
                        .filter(item => item.graduation_year > gradYear)
                        .map(item => ({
                            'Name': item.first_name || item.last_name ? item.first_name + ' ' + item.last_name : '...',
                            'Email': item.school_email ? item.school_email : '...',
                            'Phone': item.phone ? item.phone : '...',
                            'Grad year': item.graduation_year ? item.graduation_year : '...',
                        }));
                }
            }
            console.log(this.brotherInfo);
        }
    },
    data() {
        return {
            dataIsLoading: true,
            brotherInfo: null,
        }
    },
    async beforeMount() {
        await this.loadBDatabase();
        this.dataIsLoading = false;
    },
    components: {
        NavBar,
        PageLoader,
        TableVue
    }
}
</script>
