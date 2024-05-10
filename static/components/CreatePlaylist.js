export default {
    template: `<div>
    <Layout>
    <div class="content-container">
      <h1 class="display-5 mb-5" style="color:#db7093">Create Playlist</h1>
      <div class="container">
        <form>
          <div class="mb-3">
            <label for="playlistName" class="form-label">Playlist Name</label>
            <input type="text" class="form-control" id="playlistName" v-model="playlist.name" required>
          </div>
          <div class="mb-3">
            <label for="selectedSongs" class="form-label">Select Songs</label>
            <ul class="list-group">
              <li v-for="song in songs" :key="song.id" class="list-group-item">
                <input type="checkbox" :value="song.id">
                {{ song.name }} (ID: {{ song.id }})
              </li>
            </ul>
          </div>
          <button type="submit" class="btn" style="background-color:#db7093" @click="createPlaylist">Create Playlist</button>
        </form>
      </div>
    </div>
  </Layout>
    </div>`,
    data () {
        return {
            songs: [],
            role: localStorage.getItem('role'),
            authToken : localStorage.getItem('auth-token'),
            playlist: {
                name: null
            }
          };
    },
    methods: {
        async createPlaylist() {
            const res = await fetch('/api/createPlaylist', {
                method: 'POST',
                headers: {
                    'Authentication-Token': this.authToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.playlist)
            })

            const data = await res.json()
            if (res.ok) {
                this.$router.push('/')
                alert(data.message)
            }
        }
    },
    async mounted () {
        const res = await fetch(`/api/music`, {
            headers: {
                "Authentication-Token": this.authToken,
            }
        })
        if (res.ok) {
            const data = await res.json().catch((e) => {})
            this.songs = data
        } else {
            this.error = res.status
        }
    }
}