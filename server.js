const app = require("./app");
const PORT = process.env.PORT || 4000;
app.listen(PORT, console.info(`App is listening on port ${PORT}`));
