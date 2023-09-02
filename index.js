// 3rd party packages
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');

//core module
const bodyParser = require('body-parser');
// own import for routes
const users = require('./routes/users');
// const messages = require('./routes/messages');


const app = express();
const port = process.env.port || 8080;
const mongoosedbURI = process.env.MONGOOSE_URI;
const server = app.listen(port, () => {
    console.log(`Server is running on ${server.address().port}`);
})


//Database configurtion
mongoose.connect(mongoosedbURI)
    .then(()=>console.log("MongoDb Successfull Connected"))
    .catch(err => console.log(err));


app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)
app.use(bodyParser.json());
app.use("/users", users);
