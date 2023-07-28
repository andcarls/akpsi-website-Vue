<template>
    <label>
        {{ label }} <br>
        <input :type="inputType" v-model="inputValue" :placeholder="label" /> <br>
    </label>
</template>

<script>
export default {
    name: 'customInput',
    props: ['label', 'type', 'modelValue'],
    computed: {
        inputValue: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit('update:modelValue', value);
            }
        },
        inputType: {
            get() {
                return this.type;
            }
        }
    }
}
</script>

<style src="../home.css" scoped></style>
