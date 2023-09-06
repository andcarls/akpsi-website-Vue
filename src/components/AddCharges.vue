<template>
    <h1 @click="addCharges = !addCharges" style="text-decoration: underline;">Adding Charges</h1>
    <div v-if="addCharges">
        <!-- 1. Get all brothers (filter out alumni) -->
        <!-- 2. same input box as before, but with dropdown menu
    see https://github.com/shentao/vue-multiselect-->
        <!-- <multiselect v-model="selectedUsers" :options="brothers"></multiselect> -->
        <h2>Select Brothers*</h2>
        <p>{{ selectedUsers.length }} Selected</p>
        <VueMultiselect v-model="selectedUsers" :options="brothers" :multiple="true" :close-on-select="false"
            :preserve-search="true" track-by="user_id" placeholder="Pick some" :custom-label="nameWithEmail"
            group-values="options" group-label="groupLabel" :group-select="true">
        </VueMultiselect>
        <!-- <VueMultiselect v-model="selectedUsers" :options="brothers2" :multiple="true" track-by="user_id"
            placeholder="Pick some" :custom-label="nameWithEmail">
        </VueMultiselect> -->
        <h2>Select Event*</h2>
        <VueMultiselect v-model="selectedEvent" :options="events" placeholder="Pick one" label="event_name">
        </VueMultiselect>
        <h2>Enter Amount*</h2>
        <input type="number" v-model="amount" placeholder="Enter Amount">
        <h2>Enter Due Date</h2>
        <input type="date" v-model="due_date">
        <h2>Enter Notes</h2>
        <textarea v-model="notes" rows="2" cols="30"></textarea>
        <br>
        <button @click="submitCharges">Submit</button>
        <p v-if="success">Successfully Inserted Charges</p>
    </div>
</template>
<!-- <style src=></style> -->


<script>
import VueMultiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.css';
import { supabase } from '@/lib/supabase';
export default {
    name: 'AddCharges',
    async beforeMount() {
        await this.fetchBrothers();
        await this.fetchEvents();
    },
    data() {
        return {
            addCharges: false,
            success: false,
            selectedUsers: [],
            selectedEvent: null,
            amount: null,
            due_date: null,
            notes: null,
            events: [],
            brothers: [
                {
                    groupLabel: 'Select All Brothers',
                    options: [
                    ]
                }
            ],
            brothers2: [],
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
            this.brothers2 = this.brothers[0].options;
            console.log(this.brothers2.length);
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
            // console.log(this.$data);
            let data = [];
            for (const brother of this.selectedUsers) {
                data.push(
                    {
                        user_id: brother.user_id,
                        event_id: this.selectedEvent ? this.selectedEvent.event_id : null,
                        amount: this.amount,
                        due_date: this.due_date,
                        notes: this.notes
                    }
                );
            }
            const { error } = await supabase
                .from('user_charges')
                .insert(data);
            if (error) {
                alert(error.message);
            }
            else {
                this.success = true;
                this.clearData();
            }
        },
        clearData() {
            this.selectedUsers = null,
                this.selectedEvent = null,
                this.amount = null,
                this.due_date = null,
                this.notes = null;
        },
        validateSubmission() {
            if (!this.selectedUsers || this.selectedUsers.length === 0
                || !this.selectedEvent || this.amount === null) {
                alert('Please fill in required information (marked with *)');
                return false;
            }
            console.log(this.$data);
            let confirmMsg = 'Brothers ';
            this.selectedUsers.forEach((brother) =>
                confirmMsg = confirmMsg + brother.first_name + ' ' + brother.last_name + ', '
            )
            confirmMsg = confirmMsg + 'will be charged ' + this.amount;
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