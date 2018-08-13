/* eslint-disable */

var path = require("path");
var express = require("express");
var webpack = require("webpack");
var config = process.env.NODE_ENV === "production" ? require("./webpack.config.production") : require("./webpack.config");
var cors = require("cors");


var app = express();
app.use(cors());
var compiler = webpack(config);

var serverPort = process.env.PORT || 3001;
var serverHost = process.env.NODE_ENV === "production" ? "167.99.202.59" : "192.168.0.11"




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
