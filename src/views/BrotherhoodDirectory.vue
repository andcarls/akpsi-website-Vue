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
// import { supabase } from '@/lib/supabase';
import TableVue from '@/components/TableVue.vue';
export default {
    name: 'BrotherhoodDirectory',
    methods: {
        async loadBDatabase() {
            await this.$store.dispatch('fetchBData');
        }
    },
    computed: {
        brotherInfo: {
            get() {
                return this.$store.getters.getBData;
            }
        }
    },
    data() {
        return {
            dataIsLoading: true,
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
