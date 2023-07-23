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
            <loginForm :show="showLogin" @submit-login="handleLogin"></loginForm>
            <div>
                <button @click="supabaseLogin" class="login-button" :class="{ 'button-off': !buttonStatus }">Login</button>
            </div>
        </div>
    </body>
</template>
<style src="../home.css"></style>

<script>
// @ is an alias to /src

import loginForm from '../components/loginForm'
import { supabase } from '../lib/supabase'

export default {
    name: 'HomePage',
    data() {
        return {
            showLogin: false,
            buttonStatus: true,
            loginError: false,
        }
    },
    methods: {
        toggleLogin() {
            this.showLogin = !this.showLogin;
            this.buttonStatus = !this.buttonStatus;
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
            const { error } = await supabase.auth.signInWithOtp({
                phone: value,
            });

            if (error) {
                this.loginError = true;
                console.log('OTP phone verification failed');
            }
        },
        async magicLogin(value) {
            const { error } = await supabase.auth.signInWithPassword({
                email: value,
            });

            if (error) {
                this.loginError = true;
                console.log('magic email login error');
            }
        },
        async supabaseLogin() {
            try {
                // const { data, error } = await _supabase.auth.signInWithOtp({
                // phone: '+16304143808',
                // });
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: 'andcarls@umich.edu',
                    password: 'RgJFfSIH^gQ8$&GI$',
                })
                if (error) {
                    // Handle error, such as displaying an error message
                    console.log('Errr signing in:', error.message);
                } else {
                    // User successfully signed in
                    console.log('User signed in:', data.user);
                    // Perform any actions you need after successful sign-in
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
        loginForm
    }
}
</script>
  