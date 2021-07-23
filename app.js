const express = require("express");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");

const csvCrudRoute = require("./routes/csvCrud");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

mongoose
  .connect("mongodb://127.0.0.1:27017/csv", {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.log(err));

app.use("/", csvCrudRoute);

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
