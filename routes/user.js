const { Router } = require("express");
const User = require("../models/users")
const express = require("express")

const router = Router();
router.use(express.json()); // Correct: Passing a middleware function
router.use(express.urlencoded({ extended: false }))


router.get("/signup" , (req , res)=>{
    return res.render("signup");
})

router.get("/login" , (req , res)=>{
    return res.render("login")

})
router.post("/login" , async (req , res)=>{
    const { email , password} = req.body;
    try{
        const token = await User.matchPasswordAndGenerateToken( email , password);
        console.log(`TOKEN :${token}`);
        res.cookie("token" , token).redirect("/");
        
    }catch(error){
        return res.render("login",
        {error : "Incorrect Password or Email"}
        )   
    }
})




router.get("/logged", async (req, res) => {
    res.render("logged");
    console.log("IN LOGGED");
    
        
})
router.post("/signup" , async(req , res) =>{
    const { fullName , email , password} = req.body;
    
    if (!fullName || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Create the user
        const createdUser = await User.create({
            fullName,
            email,
            password
        });
        console.log(`USER IS CREATED SUCCESSFULLY : ${createdUser}`);
        return res.redirect("/user/login");
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/logout" , (req, res)=>{
    res.clearCookie("token").redirect("/")
})

module.exports = router;