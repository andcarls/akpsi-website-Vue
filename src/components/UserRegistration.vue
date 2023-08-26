<template>
    <p>Check especially email correctness, as it is relevant to authentication.</p>
    <p>Tab to add additional rows.</p>
    {{ newUsers }}
    <div v-for="(user, key) in newUsers" :key="key">
        <input v-model="user.first_name" placeholder="First Name">
        <input v-model="user.last_name" placeholder="Last Name">
        <input v-model="user.email" placeholder="Email">
        <input v-model="user.grad_year" placeholder="Graduation Year" @keydown.tab="addRow(key)">
    </div>
    <br />
    <button @click="addUsers">Save</button>
</template>

<script>
export default {
    data() {
        return {
            newUsers: [
                {
                    first_name: null,
                    last_name: null,
                    email: null,
                    grad_year: null
                }
            ],

        }
    },
    methods: {
        addRow(key) {
            if (key === this.newUsers.length - 1) {
                this.newUsers.push({});
            }
        },
        addUsers() {
            if (!confirm('Are you sure? Have you double checked emails?')) {
                return;
            }
            console.log(this.newUsers);
            this.newUsers = [
                {
                    first_name: null,
                    last_name: null,
                    email: null,
                    grad_year: null
                }
            ]
        }
    },
    name: 'UserRegistration',
}
</script>