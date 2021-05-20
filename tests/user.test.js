const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const signToken = require("./../utils/signToken");
const app = require("../app");
const User = require("../models/userModel");

const userOneId = new mongoose.Types.ObjectId();
beforeEach(async () => {
  await User.deleteMany();
});

const userOne = {
  _id: userOneId,
  fullName: "Hamza",
  email: "hamzaa@dasds.com",
  password: "3213asd",
  token: signToken(userOneId),
};
test("Should Signup a new user", async () => {
  await request(app).post("/users/signup").send(userOne).expect(201);
});

// Should Get Profile for user
// test("Should Get Profile for user", async () => {
//   await request(app)
//     .get("/users/me")
//     .set("Authorization", `Bearer ${userOne.token}`)
//     .send()
//     .expect(200);
// });

// Should Not Get Profile for unauthenticated user
// test("Should Not Get Profile for unauthenticated user", async () => {
//   await request(app)
//     .get("/users/me")
//     .send()
//     .expect(401);
// });
