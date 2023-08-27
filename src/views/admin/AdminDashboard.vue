<template>
    <!-- Lazy but fun unauthorized access redirect -->
    <div v-if="!isAdmin" style="text-align: center; background-color: black; height: 100vh;">
        <h1 style="color: white;margin: 0; padding: 0;">You don't belong here.</h1>
        <img src="../../assets/Unauthorized_access.jpg" style="width: 100%" />
    </div>
    <div v-else>
        <p>
            Notes: I don't provide delete functionality on some tables.
            Deleting data on tables that have linked data can have unexpected results and create errors.
            You may delete data within the Supabase interface, but think hard about if you really should do it.
            Any data linked to that row may throw an error.
            I have set it up as such:
            user_charges depends on events and auth's table users. It is set up to cascade delete if parent rows are
            deleted.
            That is, if a user is deleted, all their charges are deleted. If an event is deleted, all those charges are
            deleted.
            Similarly, user_information depends on auth's table users and is set to cascade delete.
            So, deleting a user (do so from auth is easiest) will delete all info related to them.
            In conclusion, make sure to think about the effects of deleting something. There could be a better alternative.
        </p>
        <p>
            This is basically a laundry list of mass functions you may want, as well as edit functionality on tables.
            You can add users, add debts, add events, etc.
            Pretty simple stuff.
            Also, I intend to include mass mailing for reminders.
        </p>
        <UserRegistration></UserRegistration>
        <AddCharges></AddCharges>

    </div>
</template>

<script>
import { supabase } from '@/lib/supabase';
import UserRegistration from '@/components/UserRegistration.vue';
import AddCharges from '@/components/AddCharges.vue';
// import PageLoader from '@/components/PageLoader.vue';
export default {
    name: 'AdminDashboard',
    data() {
        return {
            isLoading: true,
            isAdmin: false,
            eventsData: null,
            chargesData: null,
            userData: null,
        }
    },
    async beforeMount() {
        this.isLoading = true;
        this.isAdmin = false;
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
        UserRegistration,
        AddCharges
    }
}
</script>