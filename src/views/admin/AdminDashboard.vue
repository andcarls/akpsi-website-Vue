<template>
    <!-- Lazy but fun unauthorized access redirect -->
    <div v-if="!isAdmin" style="text-align: center; background-color: black; height: 100vh;">
        <h1 style="color: white;margin: 0; padding: 0;">You don't belong here.</h1>
        <img src="../../assets/Unauthorized_access.jpg" style="width: 100%" />
    </div>
    <div v-else style="width: 100%" class="outer-container">
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
        <AddEvent></AddEvent>
        <AddCharges></AddCharges>
        <h1 @click="showTables = !showTables" style="text-decoration: underline;">Edit Tables</h1>
        <div v-show="showTables" style="width: 100%;">
            <h2 @click="showEvents = !showEvents" style="text-decoration: underline;">Events</h2>
            <EditableTableVue :data="eventsData" @update-cell="updateEvent" @refresh-table="refreshEvent" v-if="showEvents">
            </EditableTableVue>
            <h2 @click="showUserInfo = !showUserInfo" style="text-decoration: underline;">User Info</h2>
            <p v-if="showUserInfo">All user info is shown -- brothers and alumni. You may see cols on brothers not yet
                filled out relevant to alumni. This is simply hidden data until graduation.
            </p>
            <p v-if="showUserInfo">
                Email is linked to authentication. For this reason, only users can change their email via their profile.
                If they no longer have access to thei r email, you or they are able to login via password on the admin
                dashboard --
                master password should be shared with you. They will then just need to type in the correct URL link (e.g.
                .../Finances), and then they can continue to edit their data.
            </p>
            <EditableTableVue :data="userData" @update-cell="updateUserInfo" @refresh-table="refreshUserInfo"
                v-if="showUserInfo"></EditableTableVue>
            <h2 @click="showUserCharges = !showUserCharges" style="text-decoration: underline;">User Charges</h2>
            <EditableTableVue :data="chargesData" @update-cell="updateCharges" @refresh-table="refreshCharges"
                v-if="showUserCharges">
            </EditableTableVue>
            <button v-if="showUserCharges" @click="toggleShowPaid">Toggle Paid</button>
        </div>
        <h1 @click="showMarkChargesPaid = !showMarkChargesPaid" style="text-decoration: underline;">Mark Charges Paid</h1>

        <h1 @click="showSendEmailReminders = !showSendEmailReminders" style="text-decoration: underline;">Send Email
            Reminders</h1>


    </div>
</template>

<style scoped></style>

<script>
import { supabase } from '@/lib/supabase';
import UserRegistration from '@/components/UserRegistration.vue';
import AddCharges from '@/components/AddCharges.vue';
import AddEvent from '@/components/AddEvent.vue';
import EditableTableVue from '@/components/EditableTableVue.vue';
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
            showTables: false,
            showEvents: false,
            showUserInfo: false,
            showUserCharges: false,
            chargesPaid: false,
            showMarkChargesPaid: false,
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
        this.chargesPaid = this.chargesData.filter(item => {
            return !item.paid;
        });
        this.userData = await this.fetchUserInformation();
        this.isLoading = false;
    },
    methods: {
        toggleShowPaid() {
            let temp = this.chargesData;
            this.chargesData = this.chargesPaid;
            this.chargesPaid = temp;
        },
        async checkAdmin() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user.email == 'vp.finance@akpsi-phi.com' || user.email == 'andcarls@umich.edu') {
                return true;
            }
            return false;
        },
        async fetchEvents() {
            const { data, error } = await supabase.from('events').select('*').order('event_id');
            if (error) {
                alert(error.message);
            }
            else {
                return data;
            }
        },
        async fetchChargesData() {
            const { data, error } = await supabase.from('user_charges').select(`
            *,
            user_information (
                first_name,
                last_name,
                email
            ),
            events (
                event_name
            )
                `)
                .order('id');
            if (error) {
                alert(error.message);
            }
            else {
                return data.map(row => {
                    const newRow = {
                        event_name: null,
                        user_name: null,
                        user_email: null,
                        ...row,
                    };
                    if (newRow.events && newRow.events.event_name) {
                        newRow.event_name = newRow.events.event_name;
                    }
                    if (newRow.user_information) {
                        if (newRow.user_information.first_name && newRow.user_information.last_name) {
                            newRow.user_name = newRow.user_information.first_name + " " + newRow.user_information.last_name;
                        }
                        if (newRow.user_information.email) {
                            newRow.user_email = newRow.user_information.email;
                        }
                    }


                    delete newRow.events;
                    delete newRow.user_information;
                    return newRow;
                });
            }
        },
        async fetchUserInformation() {
            const { data, error } = await supabase.from('user_information').select('*').order('last_name');
            if (error) {
                alert(error.message);
            }
            else {
                return data;
            }
        },
        async updateEvent(data, item) {
            const { error } = await supabase.from('events')
                .update(data)
                .eq('event_id', item.event_id);
            if (error) {
                alert('Error' + error.message);
                alert('Please refresh table to ensure properly updated data.');
            }
        },
        async refreshEvent() {
            this.eventsData = await this.fetchEvents();
        },
        async updateUserInfo(data, item) {
            if (Object.keys(data)[0] == "email") {
                alert('only users can change their email via their profile. If they no longer have access to their email, you or they are able to login via password on the admin dashboard -- master password should be shared with you. They will then just need to type in the correct URL link (e.g. .../Finances), and then they can continue to edit their data.');
                return;
            }
            const { error } = await supabase.from('user_information')
                .update(data)
                .eq('user_id', item.user_id);
            if (error) {
                alert('Error' + error.message);
                alert('Please refresh table to ensure properly updated data.');
            }
        },
        async refreshUserInfo() {
            this.userData = await this.fetchUserInformation();
        },
        async refreshCharges() {
            this.chargesData = await this.fetchChargesData();
            this.chargesPaid = this.chargesData.filter(item => {
                return !item.paid;
            });
        },
        async updateCharges(data, item) {
            const { error } = await supabase.from('user_charges')
                .update(data)
                .eq('id', item.id);
            if (error) {
                alert('Error' + error.message);
                alert('Please refresh table to ensure properly updated data.');
            }
        },
    },
    components: {
        UserRegistration,
        AddCharges,
        AddEvent,
        EditableTableVue
    }
}
</script>

<style scoped>
.outer-container {
    padding: 20px;
    height: 100vh;
}
</style>