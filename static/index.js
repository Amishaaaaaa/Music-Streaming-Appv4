import router from "./router.js"
import Navbar from "./components/Navbar.js"

new Vue({
    el: "#app",
    template: `<div>
    <Navbar :key='has_changed'/>
    <router-view class="m-3"/></div>`,
    router,
    components: {
        Navbar,
    },
    data: {
        has_changed: true,
    },
    watch: {
        $route(to, from) {
             this.has_changed = !this.has_changed
        },
    },
})