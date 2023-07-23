
<!-- template -->
<template>
    <transition name="nested">
        <form @submit.prevent="handleSubmit" v-show="showLogin" class="login-form">
            <h1 class="inner">Sign In</h1>
            <customInput v-for="(inpObj, i) in customInputs" :key="i" class="inner" :label="inpObj.label"
                :type="inpObj.type" v-model="inpObj.value" />
            <button>Sign In</button>
        </form>
    </transition>
</template>

<script>
import customInput from './customInput'
export default {
    name: 'loginForm',
    props: ['show'],
    computed: {
        showLogin: {
            get() {
                return this.show;
            }
        }
    }
    , data: function () {
        return {
            customInputs: [
                {
                    label: 'Phone # or Email',
                    type: 'text',
                    value: '',
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
            this.$emit('submit-login', this.customInputs[0].value);
            // console.log(this.customInputs[0].label + ": " + this.customInputs[0].value);
        }
    }
}
</script>