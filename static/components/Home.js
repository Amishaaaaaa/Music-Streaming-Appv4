import AdminDashboard from "./AdminDashboard.js";
import UserDashboard from "./UserDashboard.js";
import CreatorDashboard from "./CreatorDashboard.js";
import Song from "./Song.js";
import Album from "./Album.js";
// import CreatePlaylist from "./CreatePlaylist.js";

  export default {
    template: `
    <div class="home" style="background-color:lavenderblush">
      <div class="title" v-if="userRole !== 'user' && userRole !== 'admin' && userRole !== 'creator'" style="display:flex; justify-content: space-around;">
      <div style="margin-top:200px">
        <h1 v-if="userRole !== 'user' && userRole !== 'admin' && userRole !== 'creator'" style="color: #db7093">Stream your music with SunoMusic</h1>
        <h2 v-if="userRole !== 'user' && userRole !== 'admin' && userRole !== 'creator'" style="color: #db7093">Play your favorite songs!</h2>
      </div>
      <div style="margin:70px">
      <img src="static/images/music.jpg" alt="music" class="image" v-if="userRole !== 'user' && userRole !== 'admin' && userRole !== 'creator'" style="width:400px;height:500px">
      </div>
      </div>
      <UserDashboard v-if="userRole === 'user'"/>
      <AdminDashboard v-if="userRole === 'admin'"/>
      <CreatorDashboard v-if="userRole === 'creator'"/>
      <br>
      <div v-if="userRole === 'user'" class="search-container" style="display:flex; justify-content: centre">
      <input type="text" id="search" style="border-radius:20px" v-model="searchQuery" placeholder="Enter Song">
      <button class="btn" @click="searchSong" style="border-radius:20px; padding:10px; background-color:#db7093">Search</button>
      <div v-for="searchSong in searchSongs" style="font-size:20px; color: #db7093">{{searchSong.name}}</div>
      </div>
      <br><br>
      <div style="display:flex; justify-content: space-around">
      <div v-if="userRole === 'user' && songs.length">
        <h2 style="color:palevioletred">Songs</h2>
        <Song />
      </div>
      <div v-if="userRole === 'user' && songs.length">
      <button @click="createPlaylist" style="border-radius:20px; padding:10px; background-color:#db7093"> Create Playlist </button>
      <br><br>
      <div style="font-size: 20px; background-color: pink; padding:10px;border-radius:10px">
      <h4 style="color:#db7093">Here are your playlists</h4>
      <div v-if="playlists" v-for="playlist in playlists">{{ playlist.name }}</div>
      </div>
      </div>
      <div v-if="userRole === 'user' && albums.length">
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
      AdminDashboard,
      UserDashboard,
      CreatorDashboard,
      Song,
      Album
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
  };
  
