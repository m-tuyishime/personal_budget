const cors = require("cors");
const bodyParser = require("body-parser");
const express = require("express");
const envelopesRouter = require("./envelopes");
const errorHandler = require("./errors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(cors());
app.use("/envelopes", envelopesRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(errorHandler);

app.listen(PORT, (req, res) => {
  console.log(`listening on port: ${PORT}`);
});
