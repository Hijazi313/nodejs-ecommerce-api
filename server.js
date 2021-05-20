process.on("uncaughtException", (err) => {
  console.log(`UNCAUGHT EXCEPTION!  Shutting Down....`);
  console.error(err.name, err.message);
  //   Close the process
  process.exit(1);
});

const app = require("./app");
// UNHANDLED EXCEPTIONS

const PORT = process.env.PORT || 4000;
const server = app.listen(
  PORT,
  console.info(`App is listening on port ${PORT}`)
);

// SAFETY-NET for handling '' unhandledRejection '' errors in entire application
process.on("unhandledRejection", (err) => {
  console.log(`UNHANDLED REJECTION Shutting Down....`);
  console.error(err.name, err.message);

  //   It will wait for the current requests to complete and then graceful shutdown
  server.close(() => {
    //   Close the process
    process.exit(1);
  });
});
