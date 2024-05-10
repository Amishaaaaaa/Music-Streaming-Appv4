export default {
    template:`
    <div>
    <div class="p-2" v-if="songs.length" v-for="song in songs">
    <div style="background-color: pink;border-radius:20px; padding:20px">
        <h4 style="color:#db7093"> Song name:  {{ song.name }} </h4>
        <p> Total Stars {{ getRating(song.id) }} </p>
        <div> Creator: {{ song.creator }} </div>
        <br>
        <button v-if="!song.is_approved && role=='admin'" class="btn btn-success" @click="approveSong(song.id)"> Approve </button>
        <button v-if="song.is_approved && role=='admin'" class="btn btn-danger" @click="rejectSong(song.id)"> Flag </button>
        <div>
        <br>
        <div style="display:flex; justify-content:center; gap:7px">
            <button @click="playsong" style="border-radius:20px; padding:10px; background-color:#db7093"> Play </button>
            <button @click="lyrics(song.id)" style="border-radius:20px; padding:10px; background-color:#db7093"> Lyrics </button>
        </div>
        <br>
    </div>
    <div v-if="userRole === 'user'">
    <input type="range" min="1" max="5" v-model="song_rating.rating">
    <button v-if="!hasRating(song.id)" @click="submitRating(song.id)" class="btn" style="border-radius:20px; padding:10px; background-color:#db7093"> Send Stars </button>
    <button v-else @click="updateRating(song.id)" class="btn" style="border-radius:20px; padding:10px; background-color:#db7093"> Send more Stars </button>
    <span class="ml-2">{{ song_rating.rating }}</span>
</div>
        </div>
    </div>
</div>

    `,
    props: ['song'],
    data() {
        return {
            userRole: localStorage.getItem('role'),
            songs: [],
            role: localStorage.getItem('role'),
            authToken : localStorage.getItem('auth-token'),
            error: null,
            ratings: [],
            song_rating: {
                song_id: null,
                rating: null,
            },
            update_rating: {
                song_id: null,
                rating: null
            }
        }
    },
    methods: {
        async approveSong(songId) {
            const res = await fetch(`/song/${songId}/approve`, {
                headers: {
                    'Authentication-Token': this.authToken,
                },
            })
            const data = await res.json()
            if (res.ok) {
                this.$router.go(0)
                alert(data.message)
            } else {
                alert(data.message)
            }
        },
        async rejectSong(songId) {
            const res = await fetch(`/song/${songId}/reject`, {
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
        },
        async lyrics(song_id) {
            const res = await fetch(`/lyrics/${song_id}`, {
                headers: {
                    "Authentication-Token": this.authToken,
                }
            })
            const data = await res.json()
            if (res.ok) {
                this.$router.push(`/lyrics/${song_id}`);
                // console.log("sent to /lyrics")
            } else {
                alert("something wrong!")
            }
        },
        getRating(songId) {
            const rating = this.ratings.find(rating => rating.song_id === songId);
            return rating ? rating.rating : 'Not rated';
        },
        hasRating(songId) {
            return this.ratings.some(rating => rating.song_id === songId);
        },
        async submitRating(songId) {
            this.song_rating.song_id = songId;
            const res = await fetch('/api/song_rating', {
                method: 'POST',
                headers : {
                    'Authentication-Token': this.authToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.song_rating)
            })
            if(res.ok) {
                alert("rating sent")
            } else {
                alert("Some error")
            }
        },
        async updateRating(songId) {
            this.update_rating.rating = this.song_rating.rating;
            this.update_rating.song_id = songId;
            const res = await fetch('/api/song_rating', {
                method: 'PUT',
                headers : {
                    'Authentication-Token': this.authToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.update_rating)
            })
            if(res.ok) {
                alert("rating updated")
            } else {
                alert("Some error")
            }
        },
        async playsong() {
            this.$router.push('/playsong')
        }
    },
    async mounted () {
        const res1 = await fetch(`/api/music`, {
            headers: { 
                "Authentication-Token": this.authToken,
            }
        })
        if (res1.ok) {
            const data = await res1.json().catch((e) => {})
            this.songs = data
        } else {
            this.error = res1.status
        }

        const res2 = await fetch('/api/song_rating', {
            headers: {
                'Authentication-Token': this.authToken
            }
        })

        if (res2.ok) {
            const data2 = await res2.json()
            console.log(data2)
            this.ratings = data2
        } else {
            console.log("something's wrong")
        }
    }
}