const express = require('express');
const UserModel = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

// const UserModel = require('../models/user')
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

const routes = express.Router();

// duumy api for testing
routes.get('/dummyapi', (req, res) => {
    res.send("dummy api working");
})

// user login api

routes.get('/login',(req,res)=>{
    // validate user req body (username and password);
    console.log(req.body);
    if(!req.body.userName){
        res.status(400).send("username can not to be empty");
    }else if(!req.body.password){
        res.status(400).send("password can not be empty");
    }else{
        // validate from mongodb
    }
})
// user signup api

routes.get('/signup',async(req,res)=>{
    // validate user req body (username and password);
    console.log(req.body);

    if(!req.body.name){
        res.status(400).send("name can not to be empty");
    }else if(!req.body.userName){
        res.status(400).send("username can not be empty");
    }else if(!req.body.password){
        res.status(400).send("password can not be empty");
    }else{
        // check user already exist
        let user = await UserModel .findOne({userName:req.body.userName});
        if(user){
            return res.status(400).json("Username alredy exist");
        }
        const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
        const hash = await bcrypt.hash(req.body.password,salt);
        // console.log(hash);
        // console.log(salt);
        // res.send(salt);
        const newUser = new UserModel({
            name:req.body.name,
            userName:req.body.userName,
            password:hash,
        })
        newUser.save().then(user=>{
            console.log(user);
            //below line is sending the whole user
            // res.send(user)
            //filter

            const payload = {
                id : user._id,
                userName:req.body.userName,
            }
            jwt.sign(
                payload, 
                process.env.JWT_SECRET,
                {expiresIn:31556926},
                (err,token)=>{
                    res.json({
                        success:true,
                        id:user._id,
                        userName:user.userName,
                        name:user.name,
                        token:token,
                    })
                })
                
         

        })
        .catch(err=>{
            res.send(err);
        })
    }
})

module.exports = routes;