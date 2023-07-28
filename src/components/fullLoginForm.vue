
<!-- template -->
<template>
    <transition name="nested">
        <form @submit.prevent="handleSubmit" v-show="showLogin" class="login-form">
            <h1 class="inner">Sign In</h1>
            <customInput v-for="(inpObj, i) in customInputs" :key="i" class="inner" :label="inpObj.label"
                :type="inpObj.type" v-model="inpObj.value" />
            <p style="color: white; font-size: larger; background-color: #ae00009b; width:fit-content; margin-left: auto; margin-right: auto; padding: 1px 3px;"
                v-show="error">
                <strong>{{
                    errorMessage
                }}</strong>
            </p>
            <button>Sign In</button>
        </form>
    </transition>
</template>

<script>
import customInput from './customInput'
export default {
    name: 'fullLoginForm',
    props: ['show', 'errorStatus', 'errorMessage'],
    computed: {
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
        }
    }
    , data: function () {
        return {
            customInputs: [
                {
                    label: 'Email',
                    type: 'email',
                    value: '',
                },
                {
                    label: 'Password',
                    type: 'password',
                    value: ''
                },
            ]
        }
    }
    ,
    components: {
        customInput,
    },
    methods: {
        handleSubmit() {
            this.$emit('submit-full-login', this.customInputs);
            // console.log(this.customInputs[0].label + ": " + this.customInputs[0].value);
        }
    }
}
</script>

<style src="../home.css" scoped></style>
