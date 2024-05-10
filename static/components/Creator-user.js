import UserDashboard from "./UserDashboard.js"
import Album from "./Album.js";
import Song from "./Song.js";

export default {
    template: `
    <div class="home">
      <UserDashboard />
      <br>
      <div class="search-container" style="display:flex; justify-content: centre">
      <input type="text" id="search" style="border-radius:20px" v-model="searchQuery" placeholder="Enter Song">
      <button class="btn" @click="searchSong" style="border-radius:20px; padding:10px; background-color:#db7093">Search</button>
      <div v-for="searchSong in searchSongs">{{searchSong.name}}</div>
      </div>
      <div style="display:flex; justify-content: space-around">
      <div v-if="songs.length">
        <h2 style="color:#db7093">Songs</h2>
        <Song />
      </div>
      <div v-if="songs.length">
      <button @click="createPlaylist" style="border-radius:20px; padding:10px; background-color:#db7093"> Create Playlist </button>
      <br><br>
      <div style="font-size: 20px; background-color: pink; padding:10px;border-radius:10px">
      <h4 style="color:#db7093">Here are your playlists</h4>
      <div v-if="playlists" v-for="playlist in playlists">{{ playlist.name }}</div>
      </div>
      <div v-if="albums.length">
        <h2 style="color:palevioletred">Albums</h2>
        <Album />
      </div>
      </div>
    </div>
    `,
    data() {
        return {
          userRole: localStorage.getItem('role'),
          authToken: localStorage.getItem('auth-token'),
          songs: [],
          albums: [],
          playlists: [],
          searchQuery: '',
          searchSongs: [],
        };
      },
    components: {
        UserDashboard,
        Album,
        Song
      },
      methods: {
        async createPlaylist() {
          this.$router.push('/createPlaylist');
        },
  
        async searchSong() {
          const searchQuery = this.searchQuery;
          this.searchSongs = this.songs.filter(song => song.name.toLowerCase().includes(searchQuery.toLowerCase()));
          console.log(this.searchSongs)
        }
      },
      async mounted() {
        const res1 = await fetch('/api/music', {
          headers: {
            "Authentication-Token": this.authToken
          }
        });
        const data = await res1.json();
        // console.log(data);
        if (res1.ok) {
          this.songs = data;
        } else {
          alert(data.message);
        }
  
        const res2 = await fetch('/api/album', {
          headers: {
            "Authentication-Token": this.authToken
          }
        });
        const data2 = await res2.json()
        if (res2.ok) {
          this.albums = data2;
        } else {
          alert(this.message);
        }
  
        const res3 = await fetch('/api/createPlaylist', {
          headers: {
            "Authentication-Token": this.authToken
          }
        });
        const data3 = await res3.json()
        if (res1.ok) {
          this.playlists = data3;
        } else {
          alert(this.message);
        }
      },
}