
export default {
    template: `
    <div>
    <div style="font-size: 30px; color: #db7093">Creator Dashboard</div>
    <div> Welcome {{dataa[0].username}} </div>
    <br><br>
    <div><button @click="gotoUser" style="border-radius:20px; padding:10px; background-color:#db7093">User Functionality</button></div>
    <div style="display: flex; justify-content: center; gap:30px">
    <div>
    <h3 style="color:palevioletred">Your Songs</h3>
    <div v-for="song in songs" v-if="dataa[0].id==song.artist_id">
    <div style="font-size: 20px"> {{ song.name }} </div>
    
    <button @click='updateSong(song.id)' style="border-radius:20px; padding:10px; background-color:#db7093"> Update Song </button>
    <button @click='deleteSong(song.id)' style="border-radius:20px; padding:10px; background-color:#db7093"> Delete Song </button>
    </div>
    </div>
    <div>
    <h3 style="color:palevioletred">Your Albums</h3>
    <div v-if="dataa[0].id==album.artist_id" v-for="album in albums">
    <div style="font-size: 20px"> {{ album.name }} </div>
    <button @click='updateAlbum(album.id)' style="border-radius:20px; padding:10px; background-color:#db7093"> Update Album </button>
    <button @click='deleteAlbum(album.id)' style="border-radius:20px; padding:10px; background-color:#db7093"> Delete Album </button>
    </div>
    </div>
    </div>
    </div>
    `,
    data() {
        return {
            token: localStorage.getItem('auth-token'),
            dataa: null,
            songs: [],
            albums: []
        }
    },
    methods: {
        async updateSong(songId) {
            this.$router.push(`/updateSong/${songId}`)
        },
        async gotoUser() {
            this.$router.push(`/user-functionality`)
        },
        async deleteSong(songId) {
            try {
                console.log("this is songId", songId);
                const res = await fetch(`/api/deleteSong`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.token,                    
                    },
                    body: JSON.stringify({ songId: songId })
                });
                
                if (!res.ok) {
                    const errorMessage = await res.text();
                    throw new Error(`Failed to delete song: ${errorMessage}`);
                } else {
                    this.$router.go(0);
                    alert('Song deleted successfully')
                }
            
            } catch (error) {
                console.error('Error deleting song:', error.message);
            }
        },
        async updateAlbum(albumId) {
            this.$router.push(`/updateAlbum/${albumId}`)
        },
        async deleteAlbum(albumId) {
            try {
                console.log("this is albumId", albumId);
                const res = await fetch(`/api/deleteAlbum`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authentication-Token': this.token,                    
                    },
                    body: JSON.stringify({ albumId: albumId })
                });
                
                if (!res.ok) {
                    const errorMessage = await res.text();
                    throw new Error(`Failed to delete album: ${errorMessage}`);
                } else {
                    this.$router.go(0)
                    alert('Album deleted successfully')
                }
            
            } catch (error) {
                console.error('Error deleting album:', error.message);
            }
        }
    },
    async mounted () {
        const res1 = await fetch('/user-info', {
            headers: {
                'Authentication-Token': this.token
            },
        })
        const response = await res1.json();
        this.dataa = response;

        const res2 = await fetch(`/api/music`, {
            headers: {
                "Authentication-Token": this.token,
            }
        })
        if (res2.ok) {
            const data = await res2.json().catch((e) => {})
            this.songs = data
        } else {
            this.error = res2.status
        }

        const res3 = await fetch(`/api/album`, {
            headers: {
                "Authentication-Token": this.token,
            }
        })
        if (res3.ok) {
            const data = await res3.json().catch((e) => {})
            this.albums = data
        } else {
            this.error = res3.status
        }
    }
}