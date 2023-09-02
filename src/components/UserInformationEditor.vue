<template>
    <form @submit.prevent="updateProfile">
        <div>
            <label for="firstName">First Name</label>
            <br>
            <input type="text" :value="firstName" placeholder="First Name" disabled>
        </div>
        <div>
            <label for="lastName">Last name</label>
            <br>

            <input type="text" :value="lastName" placeholder="Last Name" disabled>
        </div>
        <div>
            <label for="email">Email</label>
            <br>

            <input id="email" type="email" :value="email" placeholder="Email" disabled />
        </div>
        <div>
            <label for="gradYear">Graduation Year</label>
            <br>

            <input type="number" v-model="gradYear" disabled placeholder="Graduation Year">
        </div>
        <div>
            <label for="phone">Phone</label>
            <br>

            <input type="phone" v-model="phone" required placeholder="Phone Number">
        </div>
        <div>
            <label for="college">College(s)</label>
            <br>

            <input type="text" v-model="college" required placeholder="College(s)">
        </div>
        <div>
            <label for="industry">Major(s)</label>
            <br>

            <input type="text" v-model="major" required placeholder="Major(s)">
        </div>
        <div>
            <label for="industry">Minor(s)</label>
            <br>

            <input type="text" v-model="minor" placeholder="Minor(s)">
        </div>
        <div>
            <label for="industry">Club(s)</label>
            <br>

            <input type="text" v-model="clubs" placeholder="Club(s)">
        </div>
        <div>
            <label for="industry">Internship(s)</label>
            <br>

            <input type="text" v-model="internships" placeholder="Internship(s)">
        </div>
        <div>
            <label for="industry">Full Time Position</label>
            <br>

            <input type="text" v-model="full_time" placeholder="Full Time Position">
        </div>
        <div>
            <label for="industry">Personal Email</label>
            <br>

            <input type="text" v-model="personal_email" placeholder="Personal Email">
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
            major: '',
            minor: '',
            clubs: '',
            internships: '',
            full_time: '',
            personal_email: '',
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
            // this.phone = this.session.user.phone;

            try {
                let { data: result } = await supabase
                    .from('user_information')
                    .select(`first_name, 
                            last_name, 
                            uniqname, 
                            graduation_year, 
                            phone,
                            college, 
                            major,
                            minor,
                            clubs,
                            internships,
                            full_time,
                            personal_email`)
                    .eq('user_id', data.session.user.id)
                    .single();
                if (result) {
                    this.firstName = result.first_name;
                    this.lastName = result.last_name;
                    this.uniqname = result.uniqname;
                    this.gradYear = result.graduation_year;
                    this.phone = result.phone;
                    this.college = result.college;
                    this.major = result.major;
                    this.minor = result.minor;
                    this.clubs = result.clubs;
                    this.internships = result.internships;
                    this.full_time = result.full_time;
                    this.personal_email = result.personal_email;
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
                        last_updated: 'now()',
                        phone: this.phone,
                        college: this.college,
                        major: this.major,
                        minor: this.minor,
                        clubs: this.clubs,
                        internships: this.internships,
                        full_time: this.full_time,
                        personal_email: this.personal_email
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
            // try {
            //     const { error } = await supabase.auth.updateUser({ phone: this.phone });
            //     if (error) {
            //         throw error;
            //     }
            // }
            // catch (error) {
            //     this.updateError += error.message;
            // }

            if (this.updateError == '') {
                this.updateResult = 'Profile Sucessfully Updated';
                this.$emit('success');
            }
            this.loading = false;
        },
    },

    beforeMount() {
        this.getProfile();
    }
}
</script>

<style scoped>
form {
    border-radius: 5px;
    background-color: #f2f2f2;
    padding: 30px;
    margin-left: 2 0px;
    width: 40%;
}

div {
    margin: 5px 0px;
}

input {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

input[type=submit] {
    width: 100%;
    background-color: #0A66C2;
    color: white;
    padding: 14px 20px;
    margin: 8px 0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

input[disabled] {
    border: none;
}
</style>