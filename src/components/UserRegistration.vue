<template>
    <h1 @click="show = !show" style="text-decoration: underline;">Adding Users</h1>
    <div v-if="show">
        <p>Check especially email correctness, as it is relevant to authentication and must be changed within a user's
            profile (one by one, that is - see subtext under "Edit Tables").</p>
        <p>Tab to add additional rows.</p>
        {{ newUsers }}
        <div v-for="(user, key) in newUsers" :key="key">
            <input v-model="user.first_name" placeholder="First Name" required>
            <input v-model="user.last_name" placeholder="Last Name" required>
            <input v-model="user.email" placeholder="Email" required>
            <input v-model="user.grad_year" placeholder="Graduation Year" @keydown.tab="addRow(key)" required>
        </div>
        <br />
        <label>Service Key</label>
        <input type="text" placeholder="Enter Your Service Key" v-model="serviceKey">
        <br />
        <button @click="addUsers">Save</button>
        {{ successMsg }}
    </div>
</template>

<script>
import { createClient } from '@supabase/supabase-js';
export default {
    data() {
        return {
            newUsers: [
                {
                }
            ],
            show: false,
            serviceKey: null,
            successMsg: null,
        }
    },
    methods: {
        addRow(key) {
            if (key === this.newUsers.length - 1) {
                this.newUsers.push({});
            }
        },
        checkNewUsers() {
            this.newUsers.forEach(user => {
                if (!user.first_name || !user.last_name || !user.email || !user.grad_year) {
                    console.log(user);
                    return false;
                }
                if (user.first_name == "" || user.last_name == "" || user.email == "" || user.gradYear == "") {
                    return false;
                }
            });
            return true;
        },
        async addUsers() {
            // Error check
            if (!this.checkNewUsers()) {
                alert('Fill out all information for each user. Check console for incomplete row');
                return;
            }
            if (!confirm('Are you sure? Have you double checked emails?')) {
                return;
            }
            const supabase = createClient('https://ahuptqdhadtbesxvhuzz.supabase.co', this.serviceKey, {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            });
            const { data: masterPass } = await supabase.from('private').select('value').eq('key', 'MASTER_PASSWORD').single();

            // eslint-disable-next-line
            const adminAuthClient = supabase.auth.admin;

            console.log(this.newUsers);
            for (let i = 0; i < this.newUsers.length; ++i) {
                const { data, error } = await supabase.auth.admin.createUser({
                    email: this.newUsers[i].email,
                    email_confirm: true,
                    password: masterPass.value,
                })
                if (error) {
                    alert(error.message);
                    console.log(error);
                    alert('user regisration failed at: ' + this.newUsers[i].email);
                    return;
                }
                else {
                    console.log(data);
                    let user = {
                        user_id: data.user.id,
                        email: data.user.email,
                        first_name: this.newUsers[i].first_name,
                        last_name: this.newUsers[i].last_name,
                        graduation_year: this.newUsers[i].grad_year
                    }
                    console.log(user);
                    const { error } = await supabase.from('user_information')
                        .insert(user);
                    console.log(error);
                    if (error) {
                        alert(error.message);
                        alert('failed on user: ' + data.user.email)
                        console.log(error);
                        return;
                    }
                    this.successMsg += this.newUsers[i].email;
                    this.successMsg += ', ';
                }
            }

            this.newUsers = [
                {
                }
            ];
        }
    },
    name: 'UserRegistration',
}
</script>