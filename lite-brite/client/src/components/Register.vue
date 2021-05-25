<template>
    <div id="register-wrapper">
        <input type="text" placeholder="Name" v-model="input.name"/>
        <input type="text" placeholder="Email" v-model="input.email"/>
        <input type="password" placeholder="Password" v-model="input.password" />
        <input type="password" placeholder="Confirm Password" v-model="input.passwordConfirm" />
        <button id="register-btn" class="primary-btn" v-on:click="register">Register</button>
        <button @click="displayLoginForm()" class="secondary-btn">Login</button>
    </div>
</template>

<script>
    import UserService from '../services/UserService';

    export default {
        name: 'Register',
        data() {
            return {
                userSvc: new UserService(),
                input: {
                    email: '',
                    name: '',
                    password: '',
                    passwordConfirm: ''
                },
            }
        },
        methods: {
            register: async function() {
                const response = await this.userSvc.registerUser(this.input.name, this.input.email, this.input.password, this.input.passwordConfirm);
                if (response.success) {
                    this.displayLoginForm();
                } else {
                    console.log(response);
                }
            },
            displayLoginForm: function() {
                this.$store.dispatch('setUserAcctComponent', 'Login');
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '../assets/global_styles';
</style>