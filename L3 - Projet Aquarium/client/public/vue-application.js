/* PONCIN Séverin & PTACEK Charles */
const Home = window.httpVueLoader('./components/Home.vue')
const Register = window.httpVueLoader('./components/Register.vue')
const Login = window.httpVueLoader('./components/Login.vue')

const Aquarium = window.httpVueLoader('./aquarium/components/Aquarium.vue')
const Fishs = window.httpVueLoader('./aquarium/components/Fishs.vue')
const Backgrounds = window.httpVueLoader('./aquarium/components/Backgrounds.vue')

const router = new VueRouter({
    routes: [
        { path: '/', component: Home },
        { path: '/register', component: Register },
        { path: '/login', component: Login },
        { path: '/aquarium', component: Aquarium },
        { path: '/fishs', component: Fishs },
        { path: '/backgrounds', component: Backgrounds },
        { path: '/*', redirect: { path: '/login' } }
    ]
})

var app = new Vue({
    router,
    el: '#app',
    data: {
        user: undefined,
        fishs: [],
        backgrounds: [],
        background: {
            id: -1,
            url: "./aquarium/img/background.jpg"
        }
    },
    methods: {
        async deleteUser() {
            await axios.delete('/api/me')
            this.user = undefined
            this.$router.push('/');
        },
        async loginUser(user) {
            const res = await axios.post('/api/login', user);
            this.user = res.data;
            this.getFishs();
            this.getBackgrounds();
            this.getCurrentBackground();
            this.$router.push('/aquarium');
        },
        async registerUser(user) {
            await axios.post('/api/register', user);
            this.$router.push('/login');
        },
        async createFish(fish) {
            const result = await axios.post('/api/fish', fish);
            this.fishs.unshift(result.data);
        },
        async deleteFish(fishId) {
            const result = await axios.delete('/api/fish/' + fishId);
            const index = this.fishs.findIndex(fish => fish.fishid === fishId)
            this.fishs.splice(index, 1)
        },
        async modifyFish(fromFish, toFish) {
            const result = await axios.put('/api/fish/' + fromFish.fishid, toFish);
            fromFish.name = result.data.name;
            fromFish.color = result.data.color;
            fromFish.speed = result.data.speed;
            fromFish.size = result.data.size;
            fromFish.url = result.data.url;
            fromFish.flip = result.data.flip;
        },
        async getFishs() {
            const res = await axios.get('/api/fishs');
            this.fishs = res.data;
        },
        async getBackgrounds() {
            const res = await axios.get('/api/backgrounds');
            this.backgrounds = res.data;
        },
        async getCurrentBackground() {
            const res = await axios.get('/api/background/' + this.user.backgroundid);
            this.background = res.data;
        },
        async sendBackground(value) {
            if (value === undefined || value === '')
                return;
            const res = await axios.post('/api/background', ((typeof value === 'string') ? { url: value } : value));
            if (res.data.url !== undefined)
                this.backgrounds.unshift(res.data);
        },
        async setCurrentBackground(backgroundid) {
            if (backgroundid === undefined)
                return
            const result = await axios.put('/api/background/' + backgroundid);
            let background = this.backgrounds.find(background => background.backgroundid === result.data);
            if (background)
                this.background = background;
        },
        async deleteBackground(backgroundid) {
            const res = await axios.delete('/api/background/' + backgroundid);
            const index = this.backgrounds.findIndex(background => background.backgroundid === backgroundid)
            this.backgrounds.splice(index, 1)
        }
    },
    async mounted() {
        axios.get('/api/me').then(res => {
            this.user = res.data;
            if (this.user) {
                this.getFishs()
                this.getBackgrounds()
                this.getCurrentBackground()
            }
        }).catch(err => console.log("Your are not login"))
    }
})