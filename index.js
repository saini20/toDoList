require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URL+"todolistDB", {
  useNewUrlParser: true,
});

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const defaultItems = [];
const date = new Date();
const day = date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
app.get("/", function (req, res) {
  Item.find({}).then(function (foundItems) {
    res.render("list", { listTitle: day, newListItems: foundItems });
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName,
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", async (req, res)=>{
  const checkedItemId = req.body.checkbox;
  await Item.deleteOne({ _id: checkedItemId });
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
