// import router from "router.js"

export default {
    template:`
    <div>
    <p style="font-size: 20px; color: #db7093">Users List<p>
    <div v-if="error">{{ error }}</div>
    <div style="max-width:800px">
    <table>
  <thead>
    <tr style="border: 1px solid #000000;text-align: left;padding: 8px;">
      <th style="border: 1px solid #000000;text-align: left;padding: 8px; color: #db7093">ID</th>
      <th style="border: 1px solid #000000;text-align: left;padding: 8px; color: #db7093">Email</th>
      <th style="border: 1px solid #000000;text-align: left;padding: 8px; color: #db7093">Action</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(user, index) in allUsers" :key="index" style="border: 1px solid #dddddd;text-align: left;padding: 8px;">
      <td style="border: 1px solid #000000;text-align: left;padding: 8px;">{{ user.id }}</td>
      <td style="border: 1px solid #000000;text-align: left;padding: 8px;">{{ user.email }}</td>
      <td style="border: 1px solid #000000;text-align: left;padding: 8px;">
        <button v-if="!user.active" class="btn btn-primary" @click="approve(user.id)">Approve</button>
        <div v-if="user.active">Active</div>
      </td>
    </tr>
  </tbody>
</table>
</div>

    </div>
    `,
    data() {
        return {
            allUsers: [],
            token: localStorage.getItem('auth-token'),
            error: null,
        }
    },
    methods: {
        async approve(crtid) {
            const res = await fetch(`/activate/creator/${crtid}`, {
                headers: {
                    "Authentication-Token": this.token,
                }
            })
            const data = await res.json()
            if (res.okay) { 
                alert(data.message)
            }
            this.$router.go(0)
        }
    },
    async mounted() {
        const res = await fetch('/users', {
            headers: {
                'Authentication-Token': this.token,
            },
        })
        const data = await res.json().catch((e) => {})
        console.log(data)
        if (res.ok) {
            this.allUsers = data
            console.log(this.allUsers)
        } else {
            this.error = res.status
        }
    }, 
}