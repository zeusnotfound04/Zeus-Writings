const JWT = require("jsonwebtoken");


const secret = "zeU$zeherilahai@789";



function createtokeforUser(user){
    const payload = {
        _id : user._id,
        email : user.email,
        profileURL : user.profileURL,
        role : user.role
    }
    const token = JWT.sign( payload , secret)
    return token
}


function validatetoken(token){
    const payload = JWT.verify(token , secret)
    return payload
}

module.exports = {
    createtokeforUser,
    validatetoken
}