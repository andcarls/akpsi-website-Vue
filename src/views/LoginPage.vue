<template>
    <PageLoader v-if="loading"></PageLoader>
    <html class="login-page" v-show="!loading">

    <body class="login-page">
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
            <loginForm @send-OTP="getOTP" @verify-OTP="verifyOTP" :show="showLogin" :errorStatus="loginError"
                :errorMessage="errorMessage" :verifyOTP="verifyMode" :disabled="verifyMode">
            </loginForm>
            <!-- <div>
                <button @click="getUser" class="login-button">Get Current User</button>
                <button @click="goToDashboard" class="login-button">Go To Dashboard</button>
                <button @click="signOut" class="login-button">Sign out</button>
            </div> -->
        </div>
    </body>

    </html>
</template>
<style src="../home.css" scoped></style>

<script>
// @ is an alias to /src

// import loginForm from '../components/loginForm'
// import fullLoginForm from '../components/fullLoginForm'
import loginForm from '@/components/loginForm.vue'
import { supabase } from '../lib/supabase'
import { auth_isLoggedIn, auth_signOut } from '../lib/auth'
import PageLoader from '@/components/PageLoader.vue'
export default {
    name: 'LoginPage',
    data() {
        return {
            showLogin: false,
            buttonStatus: true,
            loginError: false,
            errorMessage: '',
            verifyMode: false,
            loading: false
        }
    },
    mounted() {
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
        async goToDashboard() {
            console.log('to dashboard!');
            this.$router.go('/Finances');
        },
        // async handleLogin(value) {
        //     let type = this.checkPhoneOrEmail(value);
        //     console.log(type);
        //     if (type == 'phone') {
        //         this.otpLogin(value);
        //     }
        //     else if (type == 'email') {
        //         this.magicLogin(value);
        //     }
        //     else {
        //         this.loginError = true;
        //         this.errorMessage = "Improperly formatted email or phone";
        //         this.supabaseLogin();
        //         // console.log('invalid email or phone');
        //     }
        // },
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
        // async otpLogin(value) {
        //     console.log(value);
        //     try {
        //         const { data, error } = await supabase.auth.signInWithOtp({
        //             phone: value,
        //         });
        //         if (error) {
        //             this.loginError = true;
        //             console.log('OTP phone verification failed');
        //             throw error;
        //         }
        //         else {
        //             console.log('Successful OTP login', data);
        //         }
        //     } catch (error) {
        //         alert(error.error_description || error.message);
        //     }



        // },
        // async magicLogin(value) {
        //     const { data, error } = await supabase.auth.signInWithPassword({
        //         email: value,
        //     });

        //     if (error) {
        //         this.loginError = true;
        //         console.log('magic email login error');
        //     }
        //     else {
        //         console.log('Successful magic link login', data);
        //     }

        // },
        async getOTP(input) {
            this.loginError = false;
            this.errorMessage = '';
            let type = this.checkPhoneOrEmail(input);
            if (type == "error") {
                this.loginError = true;
                this.errorMessage = 'Check Email Formatting';
                return;
            }
            this.loading = true;
            try {
                // const { error } = await supabase.auth.signInWithPassword({
                //     email: inputs[0].value,
                //     password: inputs[1].value,
                // })
                const { error } = await supabase.auth.signInWithOtp({
                    email: input,
                    options: {
                        shouldCreateUser: false,
                    }
                });
                if (error) {
                    this.loginError = true;
                    this.errorMessage = error.message;
                } else {
                    this.verifyMode = true;
                }
            } catch (error) {
                console.log('Error signing in:', error.message);
            }
            this.loading = false;
        },
        async verifyOTP(inputs) {
            this.loginError = false;
            this.errorMessage = '';
            let type = this.checkPhoneOrEmail(inputs[0]);
            if (type == "error") {
                this.loginError = true;
                this.errorMessage = 'Check Email Formatting';
                return;
            }
            this.loading = true;
            try {
                const { error } = await supabase.auth.verifyOtp({
                    email: inputs[0],
                    token: inputs[1],
                    type: 'email'
                });
                if (error) {
                    this.loginError = true;
                    this.errorMessage = error.message;
                }
                else {
                    // console.log(data);
                    this.loading = false;
                    this.goToDashboard();
                }
            }
            catch (error) {
                console.log('error', error.message);
            }
            this.loading = false;

        }
    },
    components: {
        loginForm,
        PageLoader
    }
}
</script>
  
<style scoped>
body {
    background-image: url(../assets/akpsi-members-photo.jpeg);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    min-height: 100vh;
    min-width: 100%;
}
</style>