const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/get-joke", async (req, res) => {
  const userName = req.body.name;
  const category = req.body.category;

  try {
    const apiUrl = `https://v2.jokeapi.dev/joke/${category}?type=single`;

    const response = await axios.get(apiUrl);

    let joke = response.data.joke;

    joke = joke.replace(/\b(Chuck Norris|he|He)\b/g, userName);

    res.render("result", { joke, userName });
  } catch (error) {
    console.error("Error fetching joke:", error.message);

    res.send("Oops! Something went wrong while getting your joke.");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
