<template>
    <nav>
        <div class="logo">
            <img class="logo" src="../assets/AKPsi-coat-of-arms.png" alt="AKPsi Letters">
        </div>
        <ul>
            <!-- Desktop view -->
            <li class="desktop">
                Finances
            </li>
            <li class="desktop">
                Brotherhood Directory
            </li>
            <li class="desktop">
                Alumni Directory
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
        </ul>
        <div class="sign-out">
            <button class="sign-out" @click="signOut">Sign Out</button>
        </div>
    </nav>
</template>
<script>
import { auth_signOut } from '../lib/auth';
export default {
    name: 'NavBar',
    methods: {
        async signOut() {
            await auth_signOut();
            this.$router.push('/');
        }
    }
}
</script>

<style scoped>
nav {
    background-color: #0A66C2;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    text-align: center;
}

nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    flex-wrap: wrap;
    display: flex;
}

nav ul li {
    margin: auto;
    padding: 5px;
    font-family: 'Times New Roman', Times, serif;
    font-size: larger;
    color: white;
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
    /* line-height: 20px; */
    height: 40px;
    width: 52.95px;
    /* overflow: hidden; */
    padding: 0px 20px;
}


.sign-out:hover {
    background-color: #16437E;
    color: #ffffff;
}

.sign-out:active {
    background: #09223b;
    color: rgb(255, 255, 255, .7);
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