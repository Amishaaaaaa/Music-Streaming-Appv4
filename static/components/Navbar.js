export default {
    template: `
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">SunoMusic</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to='/'>Home</router-link>
          </li>
          <li class="nav-item" v-if='!role'>
            <router-link class="nav-link active" aria-current="page" to='/login'>Login</router-link>
          </li>
          <li class="nav-item" v-if='!role'>
            <router-link class="nav-link active" aria-current="page" to='/signup'>Signup</router-link>
          </li>
          <li class="nav-item" v-if="role=='admin'">
            <router-link class="nav-link" to='/users'>Users</router-link>
          </li>
          <li class="nav-item" v-if="role=='creator'">
            <router-link class="nav-link" to='/create-song'>Create Song</router-link>
          </li>
          <li class="nav-item" v-if="role=='creator'">
            <router-link class="nav-link" to='/create-album'>Create Album</router-link>
          </li>
          <li class="nav-item" v-if='is_login'>
            <button class="nav-link" @click='logout' >Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  `,
  data(){
    return {
      role: localStorage.getItem('role'),
      is_login: localStorage.getItem('auth-token'),
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('role')
      this.$router.push({ path: '/login'})
    }
  }
}