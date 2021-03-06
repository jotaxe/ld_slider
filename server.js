/* eslint-disable */

var path = require("path");
var express = require("express");
var webpack = require("webpack");
var config = require("./webpack.config");
var cors = require("cors");


var app = express();
app.use(cors());
var compiler = webpack(config);

var serverPort = process.env.PORT || 3001;
var serverHost = "167.99.202.59";




app.use(require("webpack-dev-middleware")(compiler, {
  publicPath: config.output.publicPath
}));

app.use(require("webpack-hot-middleware")(compiler));


app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(serverPort, serverHost, function (err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log("Listening at http://"+ serverHost + ":" + serverPort);
});
