//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

// **** mongoose and db stuff begins ****

// make a connection & create a db
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// create a new schema
const itemsSchema = {
  name: String
};

// create a new model
// two params - 1- singular version of the collection
// 2- and schema to be used
const Item = mongoose.model("item", itemsSchema);

// create some docs
const item1 = new Item({
  name: "Clean your house"
});

const item2 = new Item({
  name: "Hello bolo"
});

const item3 = new Item({
  name: "Kaam karo"
});

// create an array to store those docs
const defaultItems = [item1, item2, item3];

// **** mongoose and db stuff ends, not really lol ****

// get route for home
app.get("/", function (req, res) {

  // read some stuff from the db - leave the filter empty, to find EVERYTHING
  Item.find({}, function (err, foundItems) {

    // if nothing is found
    if (foundItems.length === 0) {

      // add docs to your collection
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Items added successfully!");
        }
      });

      // and render those, and by redirecting to "/", we actually want this method
      // to run again, and fall into the "else" statement. Smartoo
      res.redirect("/");

    } else {

      console.log(foundItems);

      res.render("list", {
        listTitle: "Today",
        newListItems: foundItems
      });

    }
  });

});

// post route for home
app.post("/", function (req, res) {

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function (req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

// listen method
app.listen(3000, function () {
  console.log("Server started on port 3000");
});