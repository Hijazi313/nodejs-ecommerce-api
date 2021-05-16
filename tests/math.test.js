const { calculateTip, add } = require("../math");
test("Should calculate total with tip", () => {
  const total = calculateTip(10, 0.3);

  expect(total).toBe(13);
  //   if (total !== 13) {
  //     throw new Error("Total should be 13, Got" + total);
  //   }
});
test("Should calculate total with Default tipPercent", () => {
  const total = calculateTip(10);

  expect(total).toBe(12.5);
});

// Async function Testing

// test("Async test demo", (done) => {
//   setTimeout(() => {
//     expect(1).toBe(2);
//     done();
//   }, 2000);
// });

test("Should add tow numbers", (done) => {
  add(2, 3).then((sum) => {
    expect(sum).toBe(5);
    done();
  });
});
test("Should add tow numbers Async/await", async () => {
  const sum = await add(3, 4);
  expect(sum).toBe(7);
});
