<template>
    <!-- Lazy but fun unauthorized access redirect -->
    <div v-if="!isAdmin" style="text-align: center; background-color: black; height: 100vh;">
        <h1 style="color: white;margin: 0; padding: 0;">You don't belong here.</h1>
        <img src="../../assets/Unauthorized_access.jpg" style="width: 100%" />
    </div>
    <div v-else>
        <p>
            Notes: I don't provide delete functionality on tables.
            Deleting data can have unexpected results and create errors.
            You may delete data within the Supabase interface, but think hard about if you really should do it.
            Any data linked to that row may throw an error.
        </p>
        <p>
            This is basically a laundry list of mass functions you may want, as well as edit functionality on tables.
            You can add users, add debts, add events, etc.
            Pretty simple stuff.
            Also, I intend to include mass mailing for reminders.
        </p>
        <h1>Adding Users</h1>
        <UserRegistration></UserRegistration>




    </div>
</template>

<script>
import { supabase } from '@/lib/supabase';
import UserRegistration from '@/components/UserRegistration.vue';
// import PageLoader from '@/components/PageLoader.vue';
export default {
    name: 'AdminDashboard',
    data() {
        return {
            isLoading: true,
            isAdmin: false,
            eventsData: null,
            chargesData: null,
            userData: null
        }
    },
    async beforeMount() {
        let admin = await this.checkAdmin();
        if (!admin) {
            return;
        }
        this.isAdmin = true;
        this.eventsData = await this.fetchEvents();
        this.chargesData = await this.fetchChargesData();
        this.userData = await this.fetchUserInformation();
        console.log(this.$data);
        this.isLoading = false;
    },
    methods: {
        async checkAdmin() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user.email == 'vp.finance@akpsi-phi.com' || user.email == 'andcarls@umich.edu') {
                return true;
            }
            return false;
        },
        async fetchEvents() {
            const { data, error } = await supabase.from('events').select('*');
            if (error) {
                alert(error.message);
            }
            else {
                return data;
            }
        },
        async fetchChargesData() {
            const { data, error } = await supabase.from('user_charges').select('*');
            if (error) {
                alert(error.message);
            }
            else {
                return data;
            }
        },
        async fetchUserInformation() {
            const { data, error } = await supabase.from('user_information').select('*');
            if (error) {
                alert(error.message);
            }
            else {
                return data;
            }
        }
    },
    components: {
        UserRegistration
    }
}
</script>