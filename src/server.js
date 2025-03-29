require("dotenv").config();
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());

const db = require("./helper/db");
db.connect();

require("./models");
require("./routes")(app);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
