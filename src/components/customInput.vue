<template>
    <div>
        <label>
            {{ label }} <br>
        </label>

        <!-- {{ label }} <br> -->
        <input :type="inputType" v-model="inputValue" :placeholder="placeHolder" :disabled="isDisabled" /> <br>
    </div>
</template>

<script>
export default {
    name: 'customInput',
    props: ['label', 'placeHolder', 'type', 'modelValue', 'disabled'],
    computed: {
        isDisabled: {
            get() {
                return this.disabled;
            }
        },
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
