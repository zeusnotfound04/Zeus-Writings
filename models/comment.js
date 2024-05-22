const { Schema, model, Error } = require("mongoose");



const commentSchema = new Schema({
    content:{
        type : String,
        required : true
    },
    createdBy : {
        type : Schema.Types.ObjectId,
        ref : "user"
    } 

} , {timestamps: true} )



const Comment = model("comment" , commentSchema)

module.exports = Comment;