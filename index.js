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
app.use(express.static(path.join(__dirname, "./public/")));







app.get("/", async (req, res) => {
    try {
        const allBlogs = await Blog.find({});
        const basePath = path.resolve('F:/VISHESH/VS code/JavaScript/NodeJS/Prac. Project/Blog/public');

        // Process each blog to adjust the coverImageURL
        allBlogs.forEach(blog => {
            if (blog.coverImageURL) {
                const fullImagePath = path.resolve(blog.coverImageURL);
                let relativeImagePath = path.relative(basePath, fullImagePath);

                // Normalize the path to use forward slashes for URL
                relativeImagePath = relativeImagePath.split(path.sep).join('/');

                // Remove leading upload if present
                if (relativeImagePath.startsWith('upload/')) {
                    blog.coverImageURL = `/${relativeImagePath}`;
                } else {
                    blog.coverImageURL = `/upload/${relativeImagePath}`;
                }
            } else {
                // Handle case where coverImageURL is missing or empty
                blog.coverImageURL = '/path/to/default/image.jpg'; // Provide a default image or leave it empty
            }
        });

        console.log(req.user);
        res.render("home", { user: req.user, blogs: allBlogs });
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(PORT , () => console.log(`Server is Started on ${PORT} `))