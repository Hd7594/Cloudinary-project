const mongoose = require("mongoose");

const Download = mongoose.model("Download", {
  name: String,
  description: String,
  author: String,
  picture: Object,
});

module.exports = Download;
