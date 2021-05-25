const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User schema
const UserSchema = new Schema ({
    name: {
        type: String,
        required: true
      },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    savedArt: {
        type: Array,
        required: true
    }
});

module.exports = User = mongoose.model('User', UserSchema);