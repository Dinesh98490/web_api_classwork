const request = require("supertest")
const app = require("../index")
const mongoose = require("mongoose")
const User = require("../models/User")
afterAll(async () => {
  await mongoose.disconnect()
})

//1. Describe
describe("User Authentication API", 
    () => {
        beforeAll( async () => {
            await User.deleteOne({email: "ram123@gmail.com"})
        })


  //2. Individual test
  test("can validate user while creating user", async () => {
    // 3. Action/Api call
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        firstName: "Ram",
        lastName: "Bahadur",
        email: "ram123@gmail.com"
      })

    //4. Expect
    expect(res.statusCode).toBe(403)
    expect(res.body.message).toBe("Please fill all the fields")
    expect(res.body.success).toBe(false)
  })

  //.. more test
  test("can create a user with all fields", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        firstName: "Ram",
        lastName: "Singh",
        email: "ram123@gmail.com",
        username: "ram123",
        password: "password"
      })

    expect(res.body.success).toBe(true)
  })

  //test login
  test("can login a user with a valid credentails", async () => {
    const res = await request(app)
    .post("/api/auth/login")
    .send({
        email:"ram123@gmail.com",
        password: "password"
    })
    expect(res.statusCode).toBe(200)
    expect(res.body.token).toEqual(expect.any(String))
    authToken = res.body.token
  })

})

describe("Authenticated Admin routes", () => {
    beforeAll(async () => {
        await User.updateOne(
            {email: "ram123@gmail.com"},
            {$set: {role: "admin"}}
        )
    })
    test("can validate user while getting all users as admin with token",
     async () => {
        const res = await request(app)
        .get("/api/admin/user")
        .set("Authorization", "Bearer " +  authToken)

        expect(res.statusCode).toBe(200)
        expect(res.body.success).toBe(true)
     }
    )

    test("can get all users without token", async () => {
        // fill this
    })
})
