export default {
    template: `
    <div>
    <p style="font-size: 30px; color: #db7093">Admin Dashboard<p>
    <div> Welcome {{dataa[0].username}}! </div>
    <br>
    <button v-if="userRole == 'admin'" @click="albums" style="border-radius:20px; padding:10px; background-color:#db7093">Album Management</button>
    <button @click="songs" style="border-radius:20px; padding:10px; background-color:#db7093">Song Management</button>
    <br><br>
    <div> <button @click='downloadSong' style="border-radius:20px; padding:10px; background-color:#db7093"> Download Songs Data </button>
    <span v-if='isWaiting'> Waiting... </span></div>
    <div style="display:flex; justify-content:center"><h2 style="font-size: 30px; color: #db7093">App Statistics</h2></div><br>
    <div v-if="song.length>0 || album.length>0 || user.length>0"><center>
    <p style="font-size:20px">Total users: {{ this.total_users-1 }}</p>
    <p style="font-size:20px">Total active creators: {{ this.total_creators }}</p>
    <p style="font-size:20px">Total unapproved creators: {{ this.unapproved_creators }}</p>
    <p style="font-size:20px">Total songs: {{ this.song.length }}</p>
    <p style="font-size:20px">Total albums: {{ this.album.length }}</p></center></div>
    </div>`,
    data() {
        return {
            isWaiting: false,
            token: localStorage.getItem('auth-token'),
            userRole: localStorage.getItem('role'),
            dataa: null,
            song: null,
            album: null,
            user: null,
            total_users: 0,
            total_creators: 0,
            unapproved_creators: 0
        }
    },
    methods: {
        async songs() {
            this.$router.push("/songManagement");
        },
        async albums() {
            this.$router.push("/albumManagement");
        },
        async downloadSong() {
            this.isWaiting = true
            const res = await fetch('/download-csv')
            const data = await res.json()
            if (res.ok) {
                const taskId = data["task-id"]
                const intv = setInterval(async () => {
                    const csv_res = await fetch(`/get-csv/${taskId}`)
                    if (csv_res.ok) {
                        this.isWaiting = false
                        clearInterval(intv)
                        window.location.href = `/get-csv/${taskId}`
                    }
                }, 1000)
            }
        }
    },
    async mounted () {
        const res1 = await fetch('/user-info', {
            headers: {
                'Authentication-Token': this.token
            },
        })
        const response = await res1.json();
        this.dataa = response;

        const res2 = await fetch('/api/music', {
                headers: {
                    'Authentication-Token': this.token
                }     
        })
        const data = await res2.json();
        this.song = data; 

        const res3 = await fetch('/api/album', {
            headers: {
                'Authentication-Token': this.token
            }
        })
        const album_data = await res3.json();
        this.album = album_data

        const res4 = await fetch('/users', {
            headers: {
                'Authentication-Token': this.token
            }
        })
        const user_data = await res4.json();
        this.user = user_data
        let lengthh = this.user.length
        for (let i=0; i < lengthh; i++) {
            if (this.user[i].is_creator == false) {
                this.total_users = this.total_users + 1
            }
            else if (this.user[i].is_creator == true && this.user[i].active == true) {
                this.total_creators = this.total_creators + 1
            }
            else if (this.user[i].is_creator == true && this.user[i].active == false) {
                this.unapproved_creators = this.unapproved_creators + 1
            }
        }
    }
}