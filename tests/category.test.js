const request = require("supertest");
const app = require("../app");
const Category = require("../models/categoryModel");

beforeEach(async () => {
  await Category.deleteMany();
});

test("Should create a new Category", async () => {
  await request(app)
    .post("/categories")
    .send({
      name: "clothing",
      color: "gray",
      icon: "fa-shirt",
    })
    .expect(201);
});
test("Should Not  create a new Category without name field", async () => {
  await request(app)
    .post("/categories")
    .send({
      color: "gray",
      icon: "fa-shirt",
    })
    .expect(500);
});
test("Should get  Categories", async () => {
  await request(app).get("/categories").expect(200);
});
// test("Should get a Single Category", async () => {
//   await request(app).get("/categories/").expect(200);
// });

// should not get a non existing category
// should not get a  category with invalid id
