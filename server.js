const express =  require('express');
const connectDB = require('./config/db');
const app = express();
const path = require("path");
var cors = require('cors')

//Connect Database
connectDB();

app.use(cors())
// For parsing application/json 
app.use(express.json()); 

// For parsing application/x-www-form-urlencoded 
app.use(express.urlencoded({ extended: true })); 
//for serving frontend
app.use(express.static(path.join(__dirname, "client", "build")));

   
// app.get("/", (req,res) => res.send(`API Running`));

// //define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile')); 

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });

const PORT = process.env.PORT || 5000
app.listen(PORT, ()=> console.log(`Server running successfully on PORT ${PORT} harsha`));