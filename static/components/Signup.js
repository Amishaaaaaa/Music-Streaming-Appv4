export default {
    template: `<div>
    <div class="container">
  <div class="row">
    <div class="col-md-6 offset-md-3 mt-5">
    <div class='d-flex justify-content-center' style="margin-top: 10vh">
        <div class="mb-3 p-5 bg-light">
        <form @submit.prevent="registerUser" class="form-signin">
    <h1 class="h3 mb-3 font-weight-normal" style="color:#db7093">Register</h1>
    <label for="inputUsername" class="sr-only">Username</label>
    <input type="text" id="inputUsername" v-model="info.username" class="form-control" required autofocus>
    <label for="inputEmail" class="sr-only">Email address</label>
    <input type="email" id="inputEmail" v-model="info.email" class="form-control" required>
    <label for="inputPassword" class="sr-only">Password</label>
    <input type="password" id="inputPassword" v-model="info.password" class="form-control" required>
    <!-- Your role selection checkboxes here -->
    <div>
        <input type="checkbox" id="user" v-model="info.roles" value="user">
        <label for="user">User</label><br>
        <input type="checkbox" id="creator" v-model="info.roles" value="creator">
        <label for="creator">Creator</label><br>
    </div>
    <button class="btn" type="submit" style="padding:10px; background-color:#db7093; color: white">Register</button>
    <h6>Already have an account?</h6>
    <div class="form-group">
        <router-link to="/login" tag="a" class="btn btn-secondary">Login</router-link>
    </div>
</form>

        </div>
        </div>
    </div>
  </div>
</div>
    </div>`,
    data() {
        return {
            info: {
              username: null,
              email: null,
              password: null,
              roles: [],
            }
        }
    },
    methods: {
      async registerUser() {
        console.log("this is info",this.info);
        console.log("this is info",this.info.roles[0]);
        try {
            const res = await fetch('/user-signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.info)
            });
            console.log(res);
            const data = await res.json();
            console.log("this is data", data)
            if (res.ok) {
                for (let i=0; i < this.info.roles.length; i++) {
                    if (this.info.roles[i] == "creator") {
                        alert("Signed up Successfully! Wait for Admin Approval")
                    } else {
                        this.$router.push("/login");
                    }
                }
                this.$router.push("/");
                
            } else {
                throw new Error("Failed to register user");
            }
        } catch (error) {
            console.error("Error registering user:", error);
            throw error;
        }
    }
    }
}