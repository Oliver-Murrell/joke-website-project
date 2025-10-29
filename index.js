
// Import required modules
const express = require('express');
const axios = require('axios');
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from "public" folder
app.use(express.static('public'));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Home route: display form to enter name
app.get('/', (req, res) => {
  res.render('index');
});

// Route to handle form submission and fetch joke
app.post('/get-joke', async (req, res) => {
    // Get name and category from the form submission
    const userName = req.body.name;
    const category = req.body.category;
  
    try {
      // Create a URL using the selected category
      const apiUrl = `https://v2.jokeapi.dev/joke/${category}?type=single`;
  
      // Make a GET request to the JokeAPI using Axios
      const response = await axios.get(apiUrl);
  
      // Extract the joke from the API response
      let joke = response.data.joke;

      // Replace any names or pronouns in the joke with the user's name
      joke = joke.replace(/\b(Chuck Norris|he|He)\b/g, userName);
  
      // Render the joke on the result page
      res.render('result', { joke, userName });
  
    } catch (error) {
      // If there's an error (like a network problem or bad API response)
      console.error('Error fetching joke:', error.message);
  
      // Show a simple message to the user
      res.send('Oops! Something went wrong while getting your joke.');
    }
  });
  

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});