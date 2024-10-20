const { Router } = require("express");
const cookieParser = require("cookie-parser")
const {checkForAuthenticationCookie} = require("../middlewares/authentication")
const express = require("express")
const multer = require("multer")
const Blog = require("../models/blog");
const Comment = require("../models/comment");


const router = Router();
router.use(express.json()); // Correct: Passing a middleware function
router.use(express.urlencoded({ extended: false }))

router.use(cookieParser())
router.use(checkForAuthenticationCookie("token"))


const storage = multer.diskStorage({
    destination : (req, file , cb)=>{
        console.log("inside storage")
        cb( null ,  `/media/zeus-notfound/VISHESH/VISHESH/VS code/JavaScript/MERN/NodeJS/Prac. Project/Blog/public/upload/`)

    }, 
    filename : (req, file , cb)=>{
        const filename = `${Date.now()}-${file.originalname}`
        cb( null , filename)
    }
})
 
const upload = multer({storage })

router.get("/addBlog" , (req , res)=>{
    console.log(req.user)
    res.render("addBlog" , { user : req.user})
})



router.post("/addblog" ,  upload.single("coverImage"), async (req, res)=>{
    const { title , body} = req.body
    if (!req.file) {
        return res.status(400).send("No cover image uploaded.");
      }
    console.log("File Name :")
    console.log(req.file.coverImageURL)
    const blog = await Blog.create({
        body, 
        title,
        createdBy: req.user._id,
        coverImageURL: `/media/zeus-notfound/VISHESH/VISHESH/VS code/JavaScript/MERN/NodeJS/Prac. Project/Blog/public/upload/${req.file.coverImageURL}`

    })
    res.redirect(`/blog/${blog._id}`)

})

router.get("/:id" , async (req, res)=>{
    console.log(req.params.id)
    const blog = await Blog.findById(req.params.id).populate("createdBy")
    const comment = await Comment.find({ blogId : req.params.id}).populate("createdBy")
    if (comment.length === 0) {
        console.log(`No comments found `);
    } else {
        console.log(`Found comments: ${comment}`);
    }
    
    console.log(comment)
    res.render("blog" , {
        user : req.user,
        blog : blog,
        comments : comment,
    })

})

router.post("/comment/:blogId" , async (req, res)=>{
   
    const comment = await Comment.create({
        content : req.body.content,
        blogId : req.params.blogId,
        createdBy : req.user._id
    })


    res.redirect(`/blog/${req.params.blogId}`)
})
module.exports = router;