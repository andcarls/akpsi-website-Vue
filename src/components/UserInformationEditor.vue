<template>
    <form @submit.prevent="updateProfile">
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
            <input type="text" v-model="uniqname" required>
        </div>
        <div>
            <label for="gradYear">Graduation Year</label>
            <input type="number" v-model="gradYear" required>
        </div>
        <div>
            <label for="college">College(s)</label>
            <input type="text" v-model="college" required>
        </div>
        <div>
            <label for="industry">Industry(s)</label>
            <input type="text" v-model="industry" required>
        </div>
        <div>
            <input type="submit" :value="loading ? 'Loading...' : 'Update Profile'">
        </div>
        <h1 v-show="loading">Loading...</h1>
        <h1 style="color:forestgreen">{{ updateResult }}</h1>
        <h1 style="color:red">{{ updateError }}</h1>
        <h1></h1>
    </form>
</template>

<script>
import { supabase } from '../lib/supabase'
export default {
    name: 'UserInformationEditor',
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
            loading: false,
            updateResult: '',
            updateError: ''
        }
    },
    methods: {
        async getProfile() {
            this.loading = true;

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
            finally {
                this.loading = false;
            }
        },
        async updateProfile() {
            this.updateResult = '';
            this.updateError = '';
            this.loading = true;
            // Update user_information table

            try {
                const { error } = await supabase
                    .from('user_information')
                    .update({
                        first_name: this.firstName,
                        last_name: this.lastName,
                        uniqname: this.uniqname,
                        graduation_year: this.gradYear,
                        college: this.college,
                        industry: this.industry
                    })
                    .eq('user_id', this.session.user.id);
                if (error) {
                    throw error;
                }
            }
            catch (error) {
                this.updateError = error.message;
            }

            // Update auth table -- phone
            try {
                const { error } = await supabase.auth.updateUser({ phone: this.phone });
                if (error) {
                    throw error;
                }
            }
            catch (error) {
                this.updateError += error.message;
            }

            if (this.updateError == '') {
                this.updateResult = 'Profile Sucessfully Updated';
            }
            this.loading = false;
        },
    },

    beforeMount() {
        this.getProfile();
    }
}
</script>