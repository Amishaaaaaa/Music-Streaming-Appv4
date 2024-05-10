export default {
    template:`
    <div style="background-color:lavenderblush; padding: 20px">
    <div v-for="(song, index) in songs" v-if="song.id==$route.params.id" style="font-size:30px">{{ song.name }}</div>
    <br><br>
    <div v-for="(song, index) in songs" v-if="song.id==$route.params.id">{{ song.lyrics }}</div>
    </div>
    `,
    data () {
        return  {
            songs: [],
            authToken: localStorage.getItem('auth-token'),
            error: null,
        }
    },
    async mounted () {
        const res = await fetch(`/api/music`, {
            headers: {
                "Authentication-Token": this.authToken,
            }
        })
        const data = await res.json().catch((e) => {})
        if (res.ok) {
            this.songs = data
        } else {
            this.error = res.status
        }
    }
}

