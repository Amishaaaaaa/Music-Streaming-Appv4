export default {
    template:`
    
    <div class='d-flex justify-content-center' style="margin-top: 20vh">
        <div class="mb-3 p-5 bg-light">
            <h1 style="color: #db7093">Login</h1>
            <div class='text-danger'>{{error}}</div>
            <label for="email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="email1"
            v-model='cred.email'>

            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password1"
            v-model='cred.password'>
            <br>
            <button class="btn" @click='login' style="padding:10px; background-color:#db7093; color: white">Login</button>
            <h6 style="margin-top: 20px;">Don't have an account?</h6>
            <div class="form-group">
            <div class="btn btn-secondary" @click="$router.push('/signup')" >Signup</div>
            </div>
        </div>
        
    </div>
    `,
    data() {
        return {
            cred: {
                username: null,
                email: null,
                password: null,
                active: false,
                fs_uniquifier: null
            },
            error: null,
            token: localStorage.getItem('auth-token'),
        } 
    },
    methods: {
        async login() {
            const res = await fetch('/user-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify(this.cred),
            })
            const data = await res.json()
            if(res.ok){
                this.userRole = data.role
                if (data.active) {
                    localStorage.setItem('auth-token', data.token)
                    localStorage.setItem('role', data.role)
                    this.$router.push({ path: '/'})
                }
                else {
                    console.log("access denied")
                }
            }
            else{
                this.error = data.message
            }
        },
        async signup() {
            const res = await fetch('/api/individual', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.cred),
            })

            const data = await res.json()
            if (res.ok) {
                alert(data.message)
            }
        }
    },
}
