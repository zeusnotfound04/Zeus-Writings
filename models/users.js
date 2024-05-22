const { Schema, model, Error } = require("mongoose");
const { createHmac , randomBytes} = require("crypto");
const { createtokeforUser } = require('../services/authentication');

const userSchema = new Schema({
    fullName :{
        type : String,
        required : true,
    },
    email :{
        type : String,
        required : true,
        unique : true
    },
    salt :{
        type : String,
    },
    password :{
        type : String,
        required : true,
    },  
    profileURL :{
        type : String,
        default : "/images/defaultPfp.png"
    },
    role :{
        type : String,
        enum : ["USER" , "ADMIN"],
        default : "USER"
    }

} , { timestamps :true});

userSchema.pre("save", async function(next) {
    const user = this;

    if(!user.isModified("password")) return;

    try {
        const salt = randomBytes(16).toString("hex");
        const hashPassword = createHmac("sha256", salt)
            .update(user.password)
            .digest("hex");

        user.salt = salt;
        user.password = hashPassword;
    } catch (error) {
        return next(error);
    }

    next();
});
userSchema.static("matchPasswordAndGenerateToken", async function(email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found!");


    const salt = user.salt;
    const hashPassword = user.password;

    const providedhash = createHmac("sha256", salt)
        .update(password)
        .digest("hex");

    if (hashPassword !== providedhash) throw new Error("Incorrect Password!");

    console.log(user.fullName);
    // Return user without sensitive information
    const token =  createtokeforUser(user);
    return token ;
    
});

const User = model("user" , userSchema);

module.exports = User;
