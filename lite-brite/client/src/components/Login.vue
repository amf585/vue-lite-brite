<template>
    <div id="login-wrapper">
        <div id="login-input-wrapper">
            <input type="text" placeholder="Email" v-model="input.email"/>
            <input type="password" placeholder="Password" v-model="input.password" />
            <button id="login-btn" class="primary-btn" @click="login()">Login</button>
            <button id="create-acct-btn" 
                    class="secondary-btn" 
                    @click="displayRegisterForm()">
                Create Account
            </button>
        </div>
    </div>
</template>

<script>
    import UserService from '../services/UserService';

    export default {
        name: 'Login',
        data() {
            return {
                userSvc: new UserService(),
                input: {
                    email: '',
                    password: ''
                },
            }
        },
        methods: {
            login: async function() {
                const response = await this.userSvc.loginUser(this.input.email, this.input.password);
                if (response.success) {
                    this.userSvc.storeToken(response.token);
                    this.$store.dispatch('setAuthenticated', true);
                } else {
                    console.log(response);
                }
            },
            displayRegisterForm: function() {
                this.$store.dispatch('setUserAcctComponent', 'Register');
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../assets/global_styles';
</style>