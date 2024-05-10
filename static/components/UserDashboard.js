export default {
    template:`
    <div>
    <p style="font-size: 30px; color: #db7093">User Dashboard<p>
    <div> Welcome {{ dataa[0].username }}! </div>
    </div>
    `,
    data() {
        return {
            token: localStorage.getItem('auth-token'),
            dataa: null
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
    }
}