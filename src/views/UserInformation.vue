<template>
    <NavBar></NavBar>
    <UserInformationEditor></UserInformationEditor>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import UserInformationEditor from '../components/UserInformationEditor.vue'

export default {
    name: 'UserInformation',
    components: { UserInformationEditor, NavBar }
}
</script>