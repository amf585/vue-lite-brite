const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const keys = require('./config/keys.js');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const passport = require('passport');
const users = require('./routes/api/users');

// Express instance
const app = express();

// Middleware
app.use(bodyParser.json());

require('./config/passport')(passport);
app.use(passport.initialize());

app.use(mongoSanitize());

app.use(cors());

// Config
const db = keys.mongoURI;

// DB connection
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Routes
app.use('/api/users', users);

// Port - default 5000
const port = process.env.port || 5000;

// Listen on port
app.listen(port, () => console.log(`Server up and running on port ${port}`));