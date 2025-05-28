require('dotenv').config()

const express = require("express")
const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes")
const adminUserRoutes = require("./routes/amdin/adminUserRoute")
const productRoute = require("./routes/amdin/productRoute")
const categoryRoute = require('./routes/amdin/categoryRoute')
const path = require("path")
const app = express()

// connection implemenations
connectDB()


app.use(express.json()) // accept  json in request

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// implement routes here
app.use("/api/auth", userRoutes)
app.use("/api/admin/user", adminUserRoutes)
app.use("/api/admin/product", productRoute)
app.use("/api/admin/category", categoryRoute)



// create a model student
// stuid - unique, required
// stu_name
// stu_email - unique, requiured


// ctreate controller for student
// create 2 api
// createStudent
// getAll user-Model.find()


// create router ans use it "/api/v1/students"








app.get("/",
(req, res) => {
    //logic
    return res.status(200).send("Hello world  ")
}
)

app.get("/post/:id",
    (req, res) => {
        console.log(req.params.id) // :id
        // get query params
        console.log(req.query)
        return res.status(200).send("Success")

    }
)

const users = [
    {id:1, name:"saroj", email:"saroj@gmail.com"},
    {id:2, name:"sushant", email:"sushant@gmail.com"},
    {id:3, name:"bhumi", email:"bhumi@gmail.com"},
]

//make a get request called /users
// that takes a dynamic id as params
// if id is not present in users send bad response with "Failure"
//check the url query and search for name
// if name is present and name matches the user with the id
// send success response with "Success"
// else send 500 response with "Server Error"

app.get("/users/:id",
    (req, res) => {
      let id = req.params.id
      let found
      for(user of users){
        if(user.id == id){
            found = user
            break
        }
      }
      if(!found){
        return res.status(400).send("Failure")
      }
      if(req.query.name && req.query.name == found.name){
        return res.status(200).send("Success")
      }else{
        return res.status(500).send("Server Error")
      }
        

    }


)

app.get("/users/:id/:name",
    (req,res) => {
      //find the users with id and name
      // if  found send 200 success
      // else 400 failures
      let id = req.params.id
      let name = req.params.name
      let found
      for(user of users){
        if(user.id== id && user.name==name){
          found = user
          break
        }
      }
      if(found){
        return res.status(200).send("Success")
      }else{
        return res.status(400).sendFile("Failure")
      }
      }
    
)


// API 
// http response code
// 200 -20x -> success response
// 300 - 30x  -> Redirect response
// 400 - 40x -> bad response
// (404) ->  not found
// (401) -> forbidden
// (403) -> unauthorized
// 500 - 50x -> server error



// ---- 27th april ----------
// multiple request , GET, POST, PUT, PATCH, DELETE......
// route blogs
// get blogs
// create blogs
// edit blogs
// delete blogs
let blogs = [
  {id:1,  name:"Nikesh", title: "Trip to pokhara", desc:"Lorem ipsum"},
  {id:2,  name:"Subham", title: "My life at softwarica", desc:"Lorem ipsum"},
  {id:3,  name:"Kushal", title: "Trip to kakani", desc:"Lorem ipsum"}
]
// local db/blogs
app.get("/blogs/",
  (req,res) => {
    //db to query blogs
    return res.status(200).json(
    {
      "success" : true,
      "blogs": blogs
    }
    )
  }

)

//single blog
app.get("/blogs/:blogId",
    (req, res) => {
      let blogId = req.params.blogId

      // search
      for(blog of blogs){
        if(blogId == blog.id){
          search = blog
          break
        }
      }
      if(search){
        return res.status(200).json(
          {
              "success": true,
              "blog": search
          }
        )
      }else{
        return res.status(404).json(
          {
            "success": false,
            "message": "Blog not found"
          }
        )
      }
    }

)


//data add/add to blogs
app.post("/blogs/",
(req, res) => {
      console.log("Body", req.body) // all request
      //{id:1, name:"asd", title:"!23", desc:"389238"}
      // const id = req.body.id
      const{id, name, title, desc} = req.body

      // validations
      if(!id || !name || !title || !desc){
        return res.status(404).json(
          {
            "success":false,
            "message": "Not Enough data"
          }
        )
      }

      blogs.push(
        {
          id,   // same key and variable
          name,  // name: name
          title,  // title: title
          desc    
        }
      )
      return res.status(200).json(
        {
          "success" : true,
          "message": "Blog added"
        }
      )

}

)

//update put/patch -> data update
// put -> whole document update 
// patch -> only few update or partial update
app.put("/blogs/:blogid",
    (req, res) => {
      let blogId = req.params.blogid 
      let foundIdx 
      for(blogIdx in blogs){
        if(blogs[blogIdx].id == blogId){
          foundIdx = blogIdx
          break
        }
      }
      const {name,title, desc} = req.body
      blogs[foundIdx].name = name
      blogs[foundIdx].title = title
      blogs[foundIdx].desc = desc
      return res.status(200).json(
        {
          "success":true,
          "message": "Blog Updated"
        }
      )

    }
)


//Delete
app.delete("/blogs/:blogId",
  (req, res) => {
    let blogId = req.params.blogId
    blogs = blogs.filter((blog) => blog.id != blogId)
    return res.status(200).json(
      {
        "success": true,
        "message": "Blog Deleted"
      }
    )
  }
)




const PORT = process.env.PORT
app.listen(
    PORT,
    () => {
        console.log("Server running")
    }
)

