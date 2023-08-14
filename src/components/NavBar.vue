<template>
    <nav>
        <ul>
            <div class="logo">
                <img class="logo" src="../assets/AKPsi-coat-of-arms.png" alt="AKPsi Letters">
            </div>
            <!-- Desktop view -->
            <li class="desktop">
                <router-link to="/Finances">Finances</router-link>
            </li>
            <li class="desktop">
                <router-link to="/BrotherhoodDirectory">Brotherhood Directory</router-link>
            </li>
            <li class="desktop">
                <router-link to="/AlumniDirectory">Alumni Directory</router-link>
            </li>
            <!-- Mobile View -->
            <!-- <ul class="mobile">
                <li class="mobile">
                    Finances
                </li>
                <li class="mobile">
                    Brotherhood Directory
                </li>
                <li class="mobile">
                    Alumni Directory
                </li>
            </ul> -->
            <div class="sign-out">
                <button class="sign-out" @click="signOut">Sign Out</button>
            </div>
        </ul>
    </nav>
</template>
<script>
import { auth_signOut } from '../lib/auth';
export default {
    name: 'NavBar',
    props: ['financeMode', 'brotherhoodMode', 'alumniMode'],
    methods: {
        async signOut() {
            await auth_signOut();
            this.$router.push('/');
        },
        toggleFinance() {
            console.log('update this bitch');
            this.$emit('financeMode');
        }
    }
}
</script>



<style scoped>
nav {
    background-color: #0A66C2;
    margin: 0;
    padding: 0;
    text-align: center;
}

nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    flex-wrap: wrap;
    display: flex;
    justify-content: space-between;
    /* flex-wrap: wrap; */
    margin: 0px 3px;
}

nav ul li {
    margin: auto;
    padding: 5px;
    font-family: 'Times New Roman', Times, serif;
    font-size: larger;
    color: white;
}

nav ul li a {
    font-family: 'Times New Roman', Times, serif;
    color: white;
    text-decoration: none;
    padding: 10px;
}

nav ul li:hover {
    text-decoration: underline;
    cursor: pointer;
}

.logo img {
    height: 80px;
    padding: 5px;
    margin-left: none;
}

.sign-out button {
    margin-right: none;
    margin-top: 30px;
    margin-bottom: auto;
    background-color: white;
    color: black;
    border: 0;
    border-radius: 100px;
    cursor: pointer;
    font-family: Georgia, 'Times New Roman', Times, serif;
    /* font-weight: bolder; */
    font-size: large;
    line-height: 20px;
    height: 40px;
    /* width: 52.95px; */
    width: fit-content;
    overflow: hidden;
    padding: 0px 20px;
}


.sign-out button:hover {
    background-color: rgb(190, 190, 190);
}

.sign-out button:active {
    background: rgb(108, 108, 108);
}

.views {
    background-color: red;
    display: flex;
    flex-wrap: wrap;
}

.mobile {
    display: none;
}

/* RESPONSIVE RULES */
/* @media screen and (max-width: 547px) {
    .mobile {
        display: flex;
    }

    .desktop {
        display: none;
    }
} */
</style>