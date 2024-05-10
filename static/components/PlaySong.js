export default { 
    template :`
    <div style="background-color: #db7093; padding: 5px; border-radius: 5px;">
    <h1 class="display-4 text-dark mb-5">Music Player</h1>
    <audio ref="audioPlayer" :src="currentSong.url" controls style="background-color: #fff; border-radius: 5px;"></audio>
</div>`

    ,
  data() {
    return {
      currentSong: {
        url: '/static/uploads/song.mp3' 
      }
    };
}
};