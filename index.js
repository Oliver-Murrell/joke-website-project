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
    // Use JokeAPI safe-mode for only safe jokes
    const apiUrl = `https://v2.jokeapi.dev/joke/Any?safe-mode`;
    console.log("Requesting:", apiUrl);

    const response = await axios.get(apiUrl);

    let joke = "";
    if (response.data.type === "single") {
      joke = response.data.joke;
    } else if (response.data.type === "twopart") {
      joke = `${response.data.setup} ... ${response.data.delivery}`;
    } else {
      joke = "No joke found.";
    }

    joke = joke.replace(/\b(Chuck Norris|he|He)\b/g, userName);

    res.render("result", { joke, userName });
  } catch (error) {
    console.error("Error fetching joke:", error.message);

    let errorMsg = "Oops! Something went wrong while getting your joke.";
    if (error.response && error.response.data && error.response.data.message) {
      errorMsg += `<br><br>Details: ${error.response.data.message}`;
    } else if (error.message) {
      errorMsg += `<br><br>Details: ${error.message}`;
    }
    res.send(errorMsg);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
