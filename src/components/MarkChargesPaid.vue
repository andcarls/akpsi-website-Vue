<template>
    <h1 @click="addCharges = !addCharges" style="text-decoration: underline;">Mark Charges Paid</h1>
    <div v-if="addCharges">
        <!-- 1. Get all brothers (filter out alumni) -->
        <!-- 2. same input box as before, but with dropdown menu
    see https://github.com/shentao/vue-multiselect-->
        <!-- <multiselect v-model="selectedUsers" :options="brothers"></multiselect> -->
        <h2>Select Brothers*</h2>
        <VueMultiselect v-model="selectedUsers" :options="brothers" :multiple="true" :close-on-select="false"
            :clear-on-select="true" :preserve-search="true" track-by="name" placeholder="Pick some"
            :custom-label="nameWithEmail" group-values="options" group-label="groupLabel">
        </VueMultiselect>
        <h2>Select Event*</h2>
        <VueMultiselect v-model="selectedEvent" :options="events" placeholder="Pick one" label="event_name">
        </VueMultiselect>
        <br>
        <button @click="submitCharges">Submit</button>
        <p>{{ success }}</p>
        <p v-if="success">Successfully Marked Charges Paid</p>
    </div>
</template>
<!-- <style src=></style> -->


<script>
import VueMultiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css';
import { supabase } from '@/lib/supabase';
export default {
    name: 'MarkChargesPaid',
    async beforeMount() {
        await this.fetchBrothers();
        await this.fetchEvents();
    },
    data() {
        return {
            addCharges: false,
            success: null,
            selectedUsers: null,
            selectedEvent: null,
            events: [],
            brothers: [
                {
                    groupLabel: 'Select All Brothers',
                    options: [
                    ]
                }
            ]
        }
    },
    methods: {
        nameWithEmail({ first_name, last_name, email }) {
            return `${first_name} ${last_name} (${email})`;
        },
        async fetchBrothers() {
            let { data } = await supabase.from('user_information').select(`user_id, first_name, last_name, email, graduation_year`);
            let currDate = new Date();
            let gradYear;
            if (currDate.getMonth() > 6) {
                gradYear = currDate.getFullYear();
            }
            else {
                gradYear = currDate.getFullYear() - 1;
            }
            this.brothers[0].options = data.filter(user => user.graduation_year > gradYear);
        },
        async fetchEvents() {
            let { data } = await supabase.from('events').select('*');
            this.events = data;
        },
        async submitCharges() {

            this.success = false;
            if (!this.validateSubmission()) {
                return;
            }
            for (const brother of this.selectedUsers) {
                const { data, error } = await supabase
                    .from('user_charges')
                    .update({ paid: true })
                    .match({ user_id: brother.user_id, event_id: this.selectedEvent.event_id })
                    .select('paid');
                if (error) {
                    alert(error.message);
                }
                else {
                    this.success += brother.first_name + ' paid: ' + data + ", ";
                }
            }
            this.clearData();

        },
        clearData() {
            this.selectedUsers = null,
                this.selectedEvent = null;
        },
        validateSubmission() {
            if (!this.selectedUsers || this.selectedUsers.length === 0
                || !this.selectedEvent) {
                alert('Please fill in required information (marked with *)');
                return false;
            }
            console.log(this.$data);
            let confirmMsg = 'Brothers ';
            this.selectedUsers.forEach((brother) =>
                confirmMsg = confirmMsg + brother.first_name + ' ' + brother.last_name + ', '
            )
            confirmMsg = confirmMsg + 'have paid ';
            if (this.selectedEvent) {
                confirmMsg = confirmMsg + ' for ' + this.selectedEvent.event_name;
            }
            return confirm(confirmMsg);
        }
    },
    components: {
        VueMultiselect
    }
}
</script>