export default {
    template: `
    <div>
    <p style="font-size: 20px" v-if="role=='Admin'">Album Management</p>
    <div style="background-color: pink;border-radius:20px; padding:20px">
    <div v-if="albums.length > 0" v-for="album in albums">
        <div>
            <h4 style="color:#db7093"> Album name: {{ album.name }}</h4>
            <div> Released Date: {{ album.release_date }}</div>
            <button v-if="!album.is_approved && role === 'admin'" class="btn btn-success" @click="approveAlbum(album.id)"> Approve </button>
            <button v-if="!album.is_approved && role === 'admin'" class="btn btn-danger" @click="rejectAlbum(album.id)"> Flag </button>
        </div>
    </div>
    </div>
</div>
    `,
    props: ['album'],
    data () {
        return {
            albums: [],
            role: localStorage.getItem('role'),
            authToken: localStorage.getItem('auth-token'),
            error: null,
            loading: true
        }
    },
    props: ['album'],
    methods : {
        async approveAlbum(albumId) {
            const res = await fetch(`/album/${albumId}/approve`, {
                headers: {
                    "Authentication-Token": this.authToken,
                }
            })
            const data = await res.json()
            if (res.ok) {
                this.$router.go(0)
                alert(data.message)
            } else {
                alert(data.message)
            }
        },
        async rejectAlbum(albumId) {
            const res = await fetch(`/album/${albumId}/reject`, {
                headers: {
                    'Authentication-token': this.authToken,
                }
            })
            const data = await res.json()
            if (res.ok) {
                this.$router.go(0)
                alert(data.message)
            } else {
                alert(data.message)
            }
        }
    },
    async mounted () {
        const res = await fetch(`/api/album`, {
            headers: {
                "Authentication-Token": this.authToken,
            }
        })
        if (res.ok) {
            const data = await res.json();
            this.albums = data;
        } else {
            this.error = res.status;
        }
    }
}