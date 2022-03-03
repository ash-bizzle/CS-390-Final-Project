const express = require("express");

const PORT = process.env.PORT || 3001;

var cors = require('cors')
var app = express()
const router = express.Router();

app.use(cors());

var mongoose = require('mongoose');

var mongoDB = 'mongodb+srv://ash-bizzle:Ashwin94@cluster0.yv6c6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movie');

// app.use(express.static(path.resolve(__dirname, '../client/build')));
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// });

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
