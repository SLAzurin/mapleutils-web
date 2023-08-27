const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.redirect("/en");
});

app.use((req, res, next) => {
  if (!req.path.includes(".")) {
    let content;
    try {
      content = fs.readFileSync(
        `./out${
          req.path.endsWith("/")
            ? req.path.substring(0, req.path.length - 1)
            : req.path
        }.html`
      );
    } catch (e) {
      res.status(404);
      content = fs.readFileSync(`./out/404.html`);
    }
    res.set("Content-Type", "text/html");
    res.send(content);
    res.end();
    return;
  }
  next();
});

app.use(
  express.static(path.join(__dirname, "out"), {
    index: false,
    extensions: ["html"],
  })
);

app.get("*", function (req, res) {
  res.set("Content-Type", "text/html");
  res.status(404).send(fs.readFileSync(`./out/404.html`));
});

app.listen(port, () => {
  console.log(`mapleutils-mirror listening on port ${port}`);
});
