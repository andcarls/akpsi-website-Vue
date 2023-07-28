<template>
    <div id="app" v-cloak>
        <h1>Dashboard Page</h1>
        <button @click="signOut">Sign Out</button>
        <p>Welcome: {{ userName }}</p>
    </div>
</template>

<script>
import { auth_signOut } from '../lib/auth';
export default {
    name: 'UserDashboard',
    methods: {
        async signOut() {
            const signedOut = await auth_signOut();
            if (signedOut) {
                this.$router.push('/');
            }
        }
    },
    computedValues: {

    }
}
</script>