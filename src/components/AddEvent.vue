<template>
    <h1 @click="show = !show" style="text-decoration: underline;">Add Event</h1>
    <div v-if="show">
        <h3>Event Name*</h3>
        <input type="text" v-model="name" placeholder="Event Name">
        <h3>Event Date</h3>
        <input type="date" v-model="date">
        <h3>Event Description</h3>
        <textarea name="description" cols="30" rows="3" v-model="description" placeholder="Event Description"></textarea>
        <br>
        <button @click="handleSubmit">Save</button>
        <p style="color:forestgreen"> {{ success }}</p>
    </div>
</template>

<script>
import { supabase } from '@/lib/supabase';
export default {
    name: 'AddEvent',
    data() {
        return {
            show: false,
            name: null,
            description: null,
            date: null,
            success: null,
        }
    },
    methods: {
        async handleSubmit() {
            this.success = null;
            if (!this.name || this.name == '') {
                alert('Please enter an event name.');
                return;
            }
            const { data, error } = await supabase.from('events').insert(
                {
                    event_name: this.name,
                    event_date: this.date,
                    event_description: this.description
                }
            ).select();
            console.log(data, error);
            if (error) {
                alert('error');
                alert(error.message);
            }
            else {
                this.success = JSON.stringify(data[0]) + 'inserted';
                this.name = null;
                this.date = null;
                this.description = null;
            }
        }
    }
}
</script>