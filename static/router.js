// import Vue from 'vue';
import AdminDashboard from "./components/AdminDashboard.js"
import Home from "./components/Home.js"
import Login from "./components/Login.js"
import Signup from "./components/Signup.js"
import Users from "./components/Users.js"
import SongForm from "./components/SongForm.js"
import Lyrics from "./components/Lyrics.js"
import CreateAlbum from "./components/CreateAlbum.js"
import Song from "./components/Song.js"
import Album from "./components/Album.js"
import UpdateSong from "./components/UpdateSong.js"
import CreatePlaylist from "./components/CreatePlaylist.js"
import UpdateAlbum from "./components/UpdateAlbum.js"
import UserDashboard from "./components/UserDashboard.js"
import CreatorUser from "./components/Creator-user.js"
import PlaySong from "./components/PlaySong.js"
// Vue.use(VueRouter);

const routes = [
    { path: '/', component: Home, name: 'Home' },
    { path: '/login', component: Login, name: 'Login' },
    { path: '/signup', component: Signup },
    { path: '/admin-dashboard', component: AdminDashboard},
    { path: '/users', component: Users },
    { path: '/create-song', component: SongForm },
    { path: '/Lyrics/:id', component: Lyrics },
    { path: '/create-album', component: CreateAlbum },
    { path: '/songManagement', component: Song, name: 'Song' },
    { path: '/albumManagement', component: Album },
    { path: '/updateSong/:id', component: UpdateSong },
    { path: '/createPlaylist', component: CreatePlaylist },
    { path: '/updateAlbum/:id', component: UpdateAlbum },
    { path: '/user-functionality', component: CreatorUser },
    { path: '/playsong', component: PlaySong }
]

export default new VueRouter({
    routes,
})