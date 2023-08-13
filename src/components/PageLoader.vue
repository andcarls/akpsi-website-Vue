<template>
    <!-- <div class="page-loader">
        <div class="cube"></div>
        <div class="cube"></div>
        <div class="cube"></div>
        <div class="cube"></div>
    </div> -->
    <div class="page-loader">
        <div class="loader">
            <div class="img"></div>
        </div>

    </div>
</template>

<script>
export default {
    name: 'PageLoader',
    // data() {
    //     return {
    //     }
    // }
}
</script>
<style>
.page-loader {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #333;
    z-index: 999;
}

.loader {
    position: absolute;
    /* width: 20vw; */
    /* height: 20vw; */
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-top-color: #0A66C2;
    /* background-color: red; */
    animation: spin 1.5s linear infinite;
}

.img {
    content: "";
    position: absolute;
    /* top: 3vw; */
    /* left: 3vw; */
    top: 18px;
    left: 18px;
    /* width: 14vw; */
    /* height: 14vw; */
    width: 84px;
    height: 84px;
    border-radius: 50%;
    background: url('../assets/AKPsi-Mobile_compressed.png') no-repeat center center;
    background-size: 100%;
    animation: spin 2s infinite ease-in-out;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>

<style lang="scss" scoped>
$colors: #8cc271, #69beeb, #f5aa39, #e9643b;



.cube {
    width: 40px;
    height: 40px;
    margin-right: 10px;

    @for $i from 1 through length($colors) {
        &:nth-child(#{$i}) {
            background-color: nth($colors, $i);
        }
    }

    &:first-child {
        animation: left 1s infinite;
    }

    &:last-child {
        animation: right 1s infinite .5s;
    }

}

@keyframes left {
    40% {
        transform: translateX(-60px);
    }

    50% {
        transform: translateX(0);
    }
}

@keyframes right {
    40% {
        transform: translateX(60px);
    }

    50% {
        transform: translateX(0);
    }
}
</style>