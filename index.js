require("dotenv").config();

const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use(cors());
app.use(express.urlencoded());
app.use(require("./mw/logger"));

/* ----------------------------------- */

app.use("/", require("./routes/index"));
app.use("/tasks", require("./routes/tasks"));

/* ----------------------------------- */

app.use(require("./mw/routeNotFound"));
app.use(require("./mw/errorHandler"));

app.listen(PORT);
