<template>
    <body>
        <!-- v-cloak to hide while loading -->
        <div id="app" v-cloak>
            <header>
                <nav>
                    <ul>
                        <li>
                            <img src="../assets/AKPsi-coat-of-arms.png" alt="AKPsi Letters">
                        </li>
                        <li>
                            AKPsi-Phi Brotherhood Access
                        </li>
                        <li>
                            <button @click="toggleLogin" class="login-button"
                                :class="{ 'button-off': !buttonStatus }">Login</button>
                        </li>
                    </ul>
                </nav>
            </header>
            <!-- TODO: add in transition -->
            <!-- <loginForm :show="showLogin" @submit-login="handleLogin"></loginForm> -->
            <fullLoginForm @submit-full-login="supabaseLogin" :show="showLogin" :errorStatus="loginError"
                :errorMessage="errorMessage">
            </fullLoginForm>
            <!-- <div>
                <button @click="getUser" class="login-button">Get Current User</button>
                <button @click="goToDashboard" class="login-button">Go To Dashboard</button>
                <button @click="signOut" class="login-button">Sign out</button>
            </div> -->
        </div>
    </body>
</template>
<style src="../home.css"></style>

<script>
// @ is an alias to /src

// import loginForm from '../components/loginForm'
import fullLoginForm from '../components/fullLoginForm'
import { supabase } from '../lib/supabase'
import { auth_isLoggedIn, auth_signOut } from '../lib/auth'
export default {
    name: 'LoginPage',
    data() {
        return {
            showLogin: false,
            buttonStatus: true,
            loginError: false,
            errorMessage: ''
        }
    },
    mounted() {
        console.log('mounted');
        this.showLogin = true;
    },
    methods: {
        async getUser() {
            auth_isLoggedIn();
        },
        async signOut() {
            auth_signOut();
        },
        toggleLogin() {
            this.showLogin = !this.showLogin;
            this.buttonStatus = !this.buttonStatus;
        },
        goToDashboard() {
            this.$router.push('/Dashboard');
        },
        async handleLogin(value) {
            let type = this.checkPhoneOrEmail(value);
            console.log(type);
            if (type == 'phone') {
                this.otpLogin(value);
            }
            else if (type == 'email') {
                this.magicLogin(value);
            }
            else {
                this.loginError = true;
                this.errorMessage = "Improperly formatted email or phone";
                this.supabaseLogin();
                // console.log('invalid email or phone');
            }
        },
        checkPhoneOrEmail(value) {
            // Regular expression for matching phone numbers
            const phoneRegex = /^(\+\d{1,3})?(\s?\d{2,4}){3}$/;

            // Regular expression for matching emails
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (phoneRegex.test(value)) {
                return 'phone';
            } else if (emailRegex.test(value)) {
                return 'email'
            } else {
                return 'error';
            }
        },
        async otpLogin(value) {
            console.log(value);
            try {
                const { data, error } = await supabase.auth.signInWithOtp({
                    phone: value,
                });
                if (error) {
                    this.loginError = true;
                    console.log('OTP phone verification failed');
                    throw error;
                }
                else {
                    console.log('Successful OTP login', data);
                    //this.goToDashboard();
                }
            } catch (error) {
                alert(error.error_description || error.message);
            }



        },
        async magicLogin(value) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: value,
            });

            if (error) {
                this.loginError = true;
                console.log('magic email login error');
            }
            else {
                console.log('Successful magic link login', data);
                //this.goToDashboard();
            }

        },
        async supabaseLogin(inputs) {
            this.loginError = false;
            this.errorMessage = '';
            let type = this.checkPhoneOrEmail(inputs[0].value);
            if (type == "error") {
                this.loginError = true;
                this.errorMessage = 'Check Email Formatting';
                return;
            }
            try {
                const { error } = await supabase.auth.signInWithPassword({
                    email: inputs[0].value,
                    password: inputs[1].value,
                })
                if (error) {
                    this.loginError = true;
                    this.errorMessage = error.message;
                } else {
                    this.goToDashboard();
                }
            } catch (error) {
                console.log('Error signing in:', error.message);
            }
        },
        async testSup() {
            for (let i = 0; i < 3; ++i) {
                await supabase
                    .from('countries')
                    .insert([
                        { id: 5 + i, name: 'penis' },
                    ])
                    .select()
            }

        }
    },
    components: {
        // loginForm,
        fullLoginForm
    }
}
</script>
  