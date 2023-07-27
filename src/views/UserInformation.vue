<template>
    <!-- <form class="form-widget" @submit.prevent="updateProfile"> -->
    <div>
        <label for="email">Email</label>
        <input id="email" type="text" :value="email" disabled />
    </div>
    <div>
        <label for="phone">Phone</label>
        <input type="phone" v-model="phone">
    </div>
    <div>
        <label for="firstName">First Name</label>
        <input type="text" :value="firstName" disabled>
    </div>
    <div>
        <label for="lastName">Last name</label>
        <input type="text" :value="lastName" disabled>
    </div>
    <div>
        <label for="uniqname">uniqname</label>
        <input type="text" v-model="uniqname">
    </div>
    <div>
        <label for="gradYear">Graduation Year</label>
        <input type="text" v-model="gradYear">
    </div>
    <div>
        <label for="college">College(s)</label>
        <input type="text" v-model="college">
    </div>
    <div>
        <label for="industry">Industry(s)</label>
        <input type="text" v-model="industry">
    </div>
    <div>
        <button class="button block" @click="signOut">Sign Out</button>
    </div>
    <!-- </form> -->
</template>

<script>
import { supabase } from '../lib/supabase'
export default {
    name: 'UserInformation',
    data() {
        return {
            session: null,
            email: '',
            phone: '',
            firstName: '',
            lastName: '',
            uniqname: '',
            gradYear: '',
            college: '',
            industry: '',
        }
    },
    methods: {
        async getProfile() {
            const { data } = await supabase.auth.getSession();
            this.session = data.session;
            this.email = this.session.user.email;
            this.phone = this.session.user.phone;

            try {
                let { data: result } = await supabase
                    .from('user_information')
                    .select('first_name, last_name, uniqname, graduation_year, college, industry')
                    .eq('user_id', data.session.user.id)
                    .single();
                console.log(result);
                if (result) {
                    this.firstName = result.first_name;
                    this.lastName = result.last_name;
                    this.uniqname = result.uniqname;
                    this.gradYear = result.graduation_year;
                    this.college = result.college;
                    this.industry = result.industry;
                }
            }
            catch (error) {
                alert(error.message);
            }
        }
    },
    beforeMount() {
        this.getProfile();
    }
}
</script>