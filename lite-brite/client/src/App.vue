<template>
  <div id="app-container">
    <div id="controls">
      <div id="user-account">
        <div v-if="!this.$store.state.authenticated">
          <component :is="this.$store.state.userAcctComponent"></component>
        </div>
        <div v-else-if="this.$store.state.authenticated">
          <select @change="loadArt()" v-model="selectedArt">
            <option value="New">New</option>
            <option v-for="art in savedArt" :key="art.id" :value="art._id">{{ art.name }}</option>
          </select>
          <button @click="saveArt()" class="primary-btn">Save</button>
          <button @click="logout()" class="secondary-btn">Logout</button>
        </div>
      </div>
      <div id="color-choices">
        <div v-for="(color, index) in colors" :key="color" class="color-input-group">
          <input type="radio" name="color"
                 :id="'color-' + index" 
                 :value="color"
                 v-model="selectedColor"
                 @click="setColor(color)">
          <label :for="'color-' + index" 
                 v-bind:style="{ backgroundColor : color }">
          </label>
        </div>
      </div>
    </div>
    <div id="drawing-board">
      <div class="row" v-for="row in dots" :key="row.id">
        <Dot v-for="dot in row" :key="dot.id" :dot-data="dot" :selected-color="selectedColor" />
      </div>
    </div>
  </div>
</template>

<script>
  import UserService from './services/UserService';
  import DataDot from '../src/data/DotData';
  import Dot from './components/Dot';
  import jwt_decode from 'jwt-decode';
  import Login from './components/Login';
  import Register from './components/Register';

  export default {
    name: 'app',
    components: {
      Dot,
      Login,
      Register
    },
    data() {
      return {
        userSvc: null,
        colors: ['#00F5FB','#FF00E3','#38FF12', '#FFF100', '#9600FF'],
        dots: [],
        savedArt: [],
        selectedArt: 'New',
        selectedColor: '#00F5FB',
        userData: {}
      }
    },
    beforeMount() {
      this.generateDots();
      this.userSvc = new UserService();
      this.loadUserData();
    },
    methods: {
      loadUserData: function () {
        if (this.userSvc.clientToken()) {
          const decodedToken = jwt_decode(this.userSvc.getToken());
          const currentTime = Date.now() / 1000; // current date in milliseconds
          if (decodedToken.exp < currentTime) {
            this.$store.dispatch('setAuthenticated', false);
            this.$store.dispatch('setUserAcctComponent', 'Login');
          } else {
            this.$store.dispatch('setAuthenticated', true);
            this.userData.email = decodedToken.email;
            this.userData.id = decodedToken.id;
            this.getArt(decodedToken.id);
          }
        }
      },
      generateDots: function() {
        for (let i = 0; i < 17; i++) {
          const numDotsInRow = i % 2 === 0 ? 25 : 24;
          let row = [];
          for (let j = 0; j < numDotsInRow; j++) {
            row = [...row, new DataDot(j+1)];
          }
          this.dots = [...this.dots, row];
        }
      },
      getRowLength: function(rowIndex) {
        return rowIndex % 2 === 0 ? 24 : 25;
      },
      logout: function() {
        this.userSvc.removeToken();
        this.$store.dispatch('setAuthenticated', false);
        this.$store.dispatch('setUserAcctComponent', 'Login');
      },
      setColor: function(color) {
        this.selectedColor = color;
      },
      getArt: async function (userId) {
        const response = await this.userSvc.getUserArtwork(userId);
        this.savedArt = response;
      },
      loadArt: function () {
          if (this.selectedArt !== 'New') {
            const art = this.savedArt.find((art) => { return art._id === this.selectedArt });
            this.dots = []; // clear existing dots
            art.dots.forEach((rowData) => {
              let row = [];
                rowData.forEach((dot) => {
                  let newDot = new DataDot(dot.id);
                  newDot.on = dot.on;
                  newDot.color = dot.color;
                  row.push(newDot);
                });
                this.dots.push(row);
            }); 
          } else {
            this.dots = [];
            this.generateDots();
          }
      },
      saveArt: async function() {
        if (this.selectedArt !== 'New') {
          await this.userSvc.updateUserArtwork(this.selectedArt, this.dots, this.userData.email);
        } else {
          var artName = '';

          while (artName.length < 1) {
              artName = prompt('Provide a name for your artwork');
          } 
          
          if (artName.length > 0) {
            const response = await this.userSvc.saveUserArtwork(this.userData.email, artName, this.dots);
            await this.getArt(this.userData.id);
            this.selectedArt = response[response.length - 1]._id;
          }
        }
        this.loadUserData();
      }
    }
  }
</script>

<style lang="scss">

  @import 'assets/global_styles';

  html, body {
    background-color: black;
    box-sizing: border-box;
    font-family: Helvetica;
    margin: 0;
    padding: 0;

    input, button {
      border-radius: 4px;
      display: inline-block;
      margin: 0 .5rem;
      padding: 3px 6px;
    }

    button {
      border: none;
    }

    #app-container {
      #controls {
        align-items: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-top: 1.5rem;
        #user-account {
          color: white;
          margin: .5rem 0 2rem;
          button {
            &:hover {
              cursor: pointer;
            }
          }
          input, select {
              background-color: #2D2D2D;
              border: 1px solid white;
              border-radius: 4px;
              color: white;
              height: 22px;
              width: 125px;
          }
        }
        #color-choices {
          display: flex;
          .color-input-group {
            input[type="radio"] {
              visibility: hidden;
              &:checked + label {
                border-radius: 50%;
                transform: scale(1.5);
                transition: .25s ease-in;
              }
            }
            label {
              display: inline-block;
              height: 30px;
              width: 30px;
              &:hover {
                cursor: pointer;
              }
            }
          }
        }
      }
      #drawing-board {
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
        color: #2c3e50;
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        min-width: 80%;
        padding: 1rem;
        .row {
          display: flex;
          flex-direction: row;
          height: 1.5rem;
          justify-content: center;
          line-height: 1.5rem;
          margin-bottom: 4px;
        }
      }
    }
  }

</style>
