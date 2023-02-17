const mongoose =require('mongoose');

const chatSchema=new mongoose.Schema({
    chat_id:{
        type:String,
        required:true,
    },
    date_time:{
        type:Date,
        required:true,
        default:Date.now 
    },
    room_name:{
        type:String,
        required:true,
    },
    sender_name:{
        type:String,
        required:true,
    },
    receiver_name:{
        type:String,
        required:false,
    },
    msg:{
        type:String,
        required:true,
    },
    is_read:{
        type:Boolean,
        required:true,
        default:false
    },
},{ timestamps: true }) 

const chat=mongoose.model("chat_info",chatSchema)

module.exports = chat;