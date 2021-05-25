const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Artwork schema
const ArtworkSchema = new Schema ({
    name: {
        type: String,
        required: true
      },
    dots: {
        type: Array,
        required: true
    }
});

module.exports = Artwork = mongoose.model('Artwork', ArtworkSchema);