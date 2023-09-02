<template>
    <NavBar></NavBar>
    <div class="outer">
        <div class="inner">
            <UserInformationEditor></UserInformationEditor>

            <p>To update email, name, or graduation year, please contact your VP Finance</p>
        </div>

    </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import UserInformationEditor from '../components/UserInformationEditor.vue'

export default {
    name: 'UserInformation',
    components: { UserInformationEditor, NavBar }
}
</script>

<style scoped>
div .outer {
    padding: 15px;
    width: 100%;

}

div .inner {
    margin: 10px auto;
}
</style>