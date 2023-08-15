
<!-- template -->
<template>
    <transition name="nested" v-show="showLogin">
        <form @submit.prevent="handleSubmit" class="login-form">
            <h2 class="inner">Welcome</h2>
            <customInput class="inner" :label="customInputs[0].label" :placeHolder="customInputs[0].placeHolder"
                :type="customInputs[0].type" v-model="customInputs[0].value" :disabled="isDisabled" />
            <p style="color: white; font-size: larger; background-color: #ae00009b; width:fit-content; margin-left: auto; margin-right: auto; padding: 1px 3px;"
                v-show="error">
                <strong>
                    Error: {{ errorMessage }}
                </strong>
            </p>
            <button v-show="!showCode || error">Get Login Code</button>
            <customInput class="inner" v-if="!error && showCode" :label="customInputs[1].label"
                :placeHolder="customInputs[1].placeHolder" :type="customInputs[1].type" v-model="customInputs[1].value">
            </customInput>
            <button v-show="showCode && !error">Log In</button>
        </form>
    </transition>
</template>

<script>
import customInput from './customInput'
export default {
    name: 'loginForm',
    props: ['show', 'errorStatus', 'errorMessage', 'verifyOTP', 'disabled'],
    computed: {
        isDisabled: {
            get() {
                return this.disabled;
            }
        },
        showLogin: {
            get() {
                return this.show;
            }
        },
        error: {
            get() {
                return this.errorStatus;
            }
        },
        errorMsg: {
            get() {
                return this.errorMessage;
            }
        },
        showCode: {
            get() {
                return this.verifyOTP;
            }
        }
    }
    , data: function () {
        return {
            customInputs: [
                {
                    label: 'Email',
                    placeHolder: 'Email',
                    type: 'email',
                    value: '',
                },
                {
                    label: 'Login Code',
                    placeHolder: 'Enter your OTP',
                    type: 'text',
                    value: ''
                },
            ],
        }
    }
    ,
    components: {
        customInput,
    },
    methods: {
        handleSubmit() {
            if (this.error || !this.showCode) {
                this.$emit('send-OTP', this.customInputs[0].value);
            }
            if (!this.error && this.showCode) {
                this.$emit('verify-OTP', [this.customInputs[0].value, this.customInputs[1].value]);
            }
            // console.log(this.customInputs[0].label + ": " + this.customInputs[0].value);
        }
    }
}
</script>

<style src="../home.css" scoped></style>
