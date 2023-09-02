const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        name:{
            require:true,
            type: String,
        },
        userName:{
            require:true,
            type:string,
            unique: true
        },
        date:{
            type:String,
            default:Date.now()
        },
    }
)

const Users = mongoose.model('User', UserSchema);
module.exports=Users