export default {
    template: `
    <div>
    <div>
    <label for="name">Album Name</label>
    <input id="name" type="text" v-model="album.name" />
    </div>
    <div>
    <label for="date">Release Date</label>
    <input id="date" type="text" v-model="album.release_date" />
    </div>
    <button @click="updateAlbum" style="border-radius:20px; padding:10px; background-color:#db7093">Update Album</button>
    </div>
    `,
    data () {
        return {
            val: null,
            album : {
                id: null,
                name: null,
                release_date: null
            },
            token: localStorage.getItem('auth-token'),
        }
    },
    methods: {
        async updateAlbum() {
            const albumData = {
                id: parseInt(this.val),
                name: this.album.name,
                release_date: this.album.release_date
            };
            const res = await fetch ('/api/updateAlbum', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token,
                },
                body :JSON.stringify(albumData)
            })
            const data = await res.json();
            if (res.ok) {
                this.$router.push("/")
                alert('Album Updated')
            } else {
                alert(data.message)
            }
        }
    },

    async mounted() {
        this.val = this.$route.params.id;
    }
}