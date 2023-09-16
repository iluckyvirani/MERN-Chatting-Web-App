const express = require('express');
const GlobalMessage = require('../model/GlobalMessage');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Conversation = require('../model/Conversation');
const Messages = require('../model/Messages');

const router = express.Router();

let jwtUser;

router.use(async (req, res, next) => {
    let token = req.headers.auth;
    // checking do you have token
    if (!token) {
        return res.status(400).json("unauthorized");
    }
    //validate token
    // bearer tojdkmfdbgnd f d dff d //split [bearer tojdkmfdbgnd f d dff d] // 1

    jwtUser = await jwt.verify(token.split(' ')[1], process.env.JWT_SECRET)
    if (!jwtUser)
        return res.status(400).json("unauthorized");
    else
        next();
})

// send a global message
router.post('/global', async(req, res)=>{
    // validate message 
    // list of vulgar words (req.body.message)
    let message = new GlobalMessage(
        {
            from:jwtUser.id,
            body:req.body.message
        }
    )

    let response = await message.save();
    res.send(response)
})

router.get('/globalMessages', async (req, res)=>{
    // name is missing 1st way
    // let messages = await GlobalMessage.find();
    // res.send({messages});

    let messages = await GlobalMessage.aggregate([
        {
            $lookup:{
                from:'users',
                localField:'from',
                foreignField:'_id',
                as:'userObj'
            }
        }
    ])
    .project({
        'userObj.password':0,
        'userObj.date':0,
        'userObj.__v':0,
        '__v':0
    })
})

// send a personal message
router.post('/personal',async(req,res)=>{
    let from = new mongoose.Types.ObjectId(jwtUser.id); //logged in person lucky
    let to = new mongoose.Types.ObjectId(req.body.sender); // person to send the msg

    let conversation = await Conversation.findOneAndUpdate(
        {
            recipents:{
                $all:[
                    {$elemMatch:{$eq: from}},
                    {$elemMatch:{$eq: to}}
                ]
            }
        },
        {
            recipents:[from,to],
            lastMessage:req.body.message
        },
        {upsert:true,new:true, setDefaultsOnInsert:true}

    )
    // upsert: true, If the value is true and no documents match the condition, this opt
    // new: true,Creates a new document if no documents match the query

    let message = new Messages({ 
        conversation: conversation._id,
        from:from,
        to:to,
        body:req.body.message
    })
    let messageData = await message.save();
    res.send(messageData);
})

// get conversation list
// from and everyone
router.get('/conversationList', async (req,res)=>{
    let from = new mongoose.Types.ObjectId(jwtUser.id);
    let conversationlist = await Conversation.aggregate([
        {
            $lookup:{
                from:'users',//which collection I need to look or check
                localField:'recipents', // what is the key in your collection
                foreignField:'_id', // what is the key in lookup collection
                as:'recipentObj'//detail is stored in recipentObj variablle
            }
        }
    ])
    .match({
        recipents:
        {
            $all:[
                {$elemMatch:{$eq: from}}
            ]
        }
    })
    .project({
        'recipentObj.password':0,
        'recipentObj.__v': 0,
        'recipentObj.date':0
    }) .exec()
    res.send(conversationlist);
})
// get conversation list
// from and to
router.get('/conversationByUser/query', async (req, res) => {
    let from = new mongoose.Types.ObjectId(jwtUser.id); // logged in person kush
    let to = new mongoose.Types.ObjectId(req.query.userId);
    let messagesList = await Messages.aggregate(
        [
            {
                $lookup: {
                    from: 'users', // which collection I need to look or check
                    localField: "from", // what is the  key in your collection
                    foreignField: "_id", // what is the  key in lookup collection
                    as: "fromObj" // detail is stored in recipentObj variable
                }
            },
            {
                $lookup: {
                    from: 'users', // which collection I need to look or check
                    localField: "to", // what is the  key in your collection
                    foreignField: "_id", // what is the  key in lookup collection
                    as: "toObj" // detail is stored in recipentObj variable
                }
            },
        ]
    )
    .match({
        $or: [
            { $and: [{ to: to }, { from: from }] },
            { $and: [{ to: from }, { from: to }] },
        ]
    })
     .project({
        'fromObj.password':0,
        'fromObj.__v':0,
        'fromObj.date':0,
        'toObj.password':0,
        'toObj.__v':0,
        'toObj.date':0,
     })
     res.send(messagesList);
})

module.exports = router;