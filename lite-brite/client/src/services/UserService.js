import axios from 'axios';
import jwt_decode from 'jwt-decode';

export default class UserService {

    BASE_URL = 'http://localhost:5000';

    /**
     * Log user into the application
     * @param {string} email - user email input
     * @param {string} password - user password input
     * @returns response body
     */
    async loginUser(email, password) {
        const requestData = {
            email: email,
            password: password
        }

        const response  = await axios
            .post(`${this.BASE_URL}/api/users/login`, requestData)
            .then(res => { 
                return { 
                    success: res.data.success, 
                    name: jwt_decode(res.data.token).name, 
                    id: jwt_decode(res.data.token).id,
                    token: res.data.token 
                }; 
            })
            .catch(error => { return error.response.data; });
        
        return response;
    }


    /**
     * Register new user
     * @param {string} name - name of user
     * @param {string} email - user email
     * @param {string} password - password
     * @param {string} passwordConfirm - confirmation of password
     * @returns response body
     */
    async registerUser(name, email, password, passwordConfirm) {
        const requestData = {
            email: email,
            name: name,
            password: password,
            passwordConfirm: passwordConfirm
        }

        const response = await axios
            .post(`${this.BASE_URL}/api/users/register`, requestData)
            .then(res => { 
                return {
                    success: true,
                    name: res.data.name,
                    email: res.data.email
                }
            })
            .catch(error => { return error.response.data; });
        
        return response;
    }


    /**
     * Get artwork for specified user
     * @param {string} userId - user id
     * @returns response body
     */
    async getUserArtwork(userId) {
        const requestData = {
            id: userId
        }
        const response = await axios
            .post(`${this.BASE_URL}/api/users/getartwork`, requestData)
            .then(res => {
                return res.data;
             })
             .catch(error => { return error.response.data; });

        return response;
    }


    /**
     * Save new artwork for user
     * @param {string} email - user email
     * @param {string} name - artwork name
     * @param {Array} dots - dots data
     * @returns response body
     */
    async saveUserArtwork(email, name, dots) {
        const requestData = {
            email: email,
            name: name,
            dots: dots
        }
        console.log('save artwork service');
        const response = await axios
            .post(`${this.BASE_URL}/api/users/saveartwork`, requestData)
            .then(res => {
                return res.data.savedArt;
             })
             .catch(error => { return error.response.data; });

        return response;
    }


    /**
     * Update existing artwork
     * @param {string} artId - Id of 
     * @param {Array} dots - dots data
     * @param {string} email - user email
     * @returns response body
     */
    async updateUserArtwork(artId, dots, email) {
        const requestData = {
            artId: artId,
            dots: dots,
            email: email
        }
        const response = await axios
            .put(`${this.BASE_URL}/api/users/updateartwork`, requestData)
            .then(res => {
                return res.data;
             })
             .catch(error => { return error.response.data; });
        
        return response;
    }


    /**
     * Check if token exists for client
     * @return {boolean} true if token exists
     */
    clientToken() {
        return localStorage.getItem('lb-token') !== null;
    }


    /**
     * Get client token
     * @return {string} client token
     */
    getToken() {
        return localStorage.getItem('lb-token');
    }


    /**
     * Log user out
     * @return {void}
     */
    removeToken() {
        localStorage.removeItem('lb-token');
    }


    /**
     * Set client token
     * @param {string} newToken - new token value
     * @return {void}
     */
    storeToken(newToken) {
        localStorage.setItem('lb-token', newToken);
    }


    /**
     * Get tokenized user data
     * @returns {Object} - Object with user data
     */
    userData() {
        return jwt_decode(localStorage.getItem('lb-token'));
    }

}