const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessagesSchema = new Schema(
    {
        // last message
        conversation:{
            type:Schema.Types.ObjectId,
            ref:'conversation'
        },
        from:{
            type:Schema.Types.ObjectId,
            ref:'users'
        },
        to:{
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        body:{
            type : String
        },
        date :{
            type: String,
            default: Date.now()
        }
    }
)

const Messages = mongoose.model('messages', MessagesSchema);
model.exports =Messages;