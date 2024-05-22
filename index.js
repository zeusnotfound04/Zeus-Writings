const express = require("express");
const path = require("path")
const userRoutes = require("./routes/user")
const blogRoutes = require("./routes/blog")
const Blog = require("./models/blog")
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser")
const {checkForAuthenticationCookie} = require("./middlewares/authentication")

const app = express();
const PORT = 3000;



mongoose.connect("mongodb://localhost:27017/blogDatabase")
    .then(() => console.log("MongoDB is connected successfully......"))
    .catch((err) => console.log(`Error : ${err}`));

app.set("view engine" , "ejs");
app.set("views" , path.resolve("./views"))
app.use(express.json());
app.use("/user" , userRoutes)
app.use("/blog" , blogRoutes)
app.use(express.urlencoded({ extended: true }))//to handle form data..
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve("./public")));


app.get("/" , async (req , res) =>{
    const allBlogs = await Blog.find({})
    console.log(req.user)
    res.render("home" , { user : req.user, blogs : allBlogs});
})



app.listen(PORT , () => console.log(`Server is Started on ${PORT}.....Tunkam bjkbjdkbjkd  bdjkbnjkbnjkdbjkbd dhklhd  jhiohldjlhnklndbjnljdbn du tunu...`))