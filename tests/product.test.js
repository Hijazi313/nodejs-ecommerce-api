const request = require("supertest");
const app = require("../app");
const Product = require("../models/productModel");

beforeEach(async () => {
  await Product.deleteMany();
});

test("Should create a new Product", async () => {
  await request(app)
    .post("/")
    .send({
      title: "first product test",
      description: "this is description",
      shortDescription: "thisd dsdiousd diosud",
      category: "609d3b282dab272cbc3d2ffd",
      price: 20,
      image: "https://unsplash.com/photos/Q-72wa9-7Dg",
      brand: "No brand",
      images: [
        { url: "https://unsplash.com/photos/Q-72wa9-7Dg" },
        { url: "https://unsplash.com/photos/Nv4QHkTVEaI" },
      ],
      countInStock: 20,
      isFeatured: false,
    })
    .expect(201);
});
