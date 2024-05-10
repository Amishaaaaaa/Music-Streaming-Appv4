export default {
    template:`
    <div>
    <div>
    <label for="name">Song Name</label>
    <input id="name" type="text" v-model="song.name" />
    </div>
    <div>
    <label for="genre">Genre</label>
    <input id="genre" type="text" v-model="song.genre" />
    </div>
    <div>
    <label for="duration">Duration</label>
    <input id="duration" type="text" v-model="song.duration" />
    </div>
    <div>
    <label for="lyrics">Lyrics</label>
    <input id="lyrics" type="text" v-model="song.lyrics" />
    </div>
    <div>
    <label for="date">Date Added</label>
    <input id="date" type="text" v-model="song.date_added" />
    </div>
    <div>
    <label for="albumId">Album:</label>
        <select v-model="song.album_id" id="albumId" required>
          <option v-for="album in albums" v-if="info[0].id==album.artist_id" :key="album.id" :value="album.id">{{ album.name }}</option>
        </select>
    </div>
    <button @click="createSong" style="border-radius:20px; padding:10px; background-color:#db7093">Create Song</button>
    </div>
    `,
    data() {
        return {
            albums: [],
            info: null,
            song: {
                name: null,
                genre: null,
                duration: null, 
                lyrics: null,
                date_added: null,
                album_id: null
            },
            token: localStorage.getItem('auth-token'),
        }
    },

    methods:{
        async createSong() {
            const res = await fetch('/api/music', {
                method: 'POST',
                headers: {
                    'Authentication-Token': this.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.song),
            })

            const data = await res.json()
            if (res.ok) {
                this.$router.push("/")
                alert(data.message)
            }
        }
    },
    async mounted() {
        const res1 = await fetch('/api/album', {
            headers: {
                'Authentication-Token': this.token,
                'Content-Type': 'application/json',
            },
        })
        const data1 = await res1.json();
        console.log(data1);
        this.albums = data1;

        const res2 = await fetch('/user-info', {
            headers: {
                'Authentication-Token': this.token
            }
        })
        const data2 = await res2.json();
        console.log("this is data2", data2[0].id);
        this.info = data2;
        console.log(this.albums[0].artist_id)
    }
}
