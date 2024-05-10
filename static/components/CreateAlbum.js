export default {
    template:`
    <div>
    <label for="name">Album Name</label>
    <input id="name" type="text" v-model="album.name">
    <br>
    <label for="date">Release Date</label>
    <input id="date" type="text" v-model="album.release_date">
    <br>
    <button @click="createAlbum" style="border-radius:20px; padding:10px; background-color:#db7093">Create Album</button>
    </div>
    `,
    data() {
        return {
            album: {
                name: null,
                release_date: null,
            },
            token: localStorage.getItem('auth-token'),
        }
    },

    methods: {
        async createAlbum() {
            const res = await fetch('/api/album', {
                method: 'POST',
                headers: {
                    'Authentication-Token': this.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.album),
            })

            const data = await res.json()
            if (res.ok) {
                this.$router.push("/")
                alert(data.message)
            }
        }
    }
}