<template>
    <PageLoader v-if="dataIsLoading"></PageLoader>
    <div v-if="!dataIsLoading" id="app" v-cloak>
        <NavBar></NavBar>
        {{ testingData }}
        <h1 style="text-align: center;">Alumni Directory</h1>
        <TableVue :data="alumniInfo" :emptyMessage="'Hmmm... We don\'t have any data'"></TableVue>
    </div>
</template>

<script>
import PageLoader from '@/components/PageLoader.vue';
import NavBar from '../components/NavBar.vue';
// import { supabase } from '@/lib/supabase';
import TableVue from '@/components/TableVue.vue';
export default {
    name: 'AlumniDirectory',
    methods: {
        async loadADatabase() {
            await this.$store.dispatch('fetchAData');
        }
    },
    data() {
        return {
            dataIsLoading: true,
        }
    },
    async beforeMount() {
        await this.loadADatabase();
        this.dataIsLoading = false;
    },
    computed: {
        alumniInfo: {
            get() {
                return this.$store.getters.getAData;
            }
        }
    },
    components: {
        NavBar,
        PageLoader,
        TableVue
    }
}
</script>
