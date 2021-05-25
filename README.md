# MEVN Lite Brite Game
My first attempt at a MEVN (VENM?) stack app

I decided to make a small Lite Brite game/app where users can create an account and load/save/edit their artwork.

Check out this short demo gif of the app: 
![lite-brite-2](https://user-images.githubusercontent.com/26422409/119575259-c1d18a80-bd84-11eb-9ba8-c9834029b1d7.gif)

## Usage
To run locally: 
1. Create a ```liteBriteDB.users``` (database.collection) at https://cloud.mongodb.com
2. Set the value of ```mongoURI``` in ```server/config.keys.js``` (line 2) to your connection string.


4. Install server dependencies - in server/ run ```npm install```
5. Install client dependencies - in client/ run ```npm install```


7. Start server - in server/ run ```npm run start``` (http://localhost:5000)
8. Start client - in client/ run ```npm run serve``` (http://localhost:8080)
