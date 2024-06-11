const express = require('express');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Function to fetch data from the API
const fetchData = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,matic-network,base');
    return response.data;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    return null;
  }
};

// Function to save data to a JSON file
const saveDataToFile = (data) => {
  fs.writeFile('data.json', JSON.stringify(data), (err) => {
    if (err) {
      console.error('Error saving data to file:', err);
    } else {
      console.log('Data saved to file successfully');
    }
  });
};

// Endpoint to handle GET requests
app.get('/getdata', async (req, res) => {
  try {
    let responseData = {};
    let jsonData = {};

    // Fetch data from the API
    responseData = await fetchData();

    // If API call fails, attempt to read data from the JSON file
    if (!responseData) {
      try {
        jsonData = JSON.parse(fs.readFileSync('data.json', 'utf8'));
      } catch (error) {
        console.error('Error reading data from file:', error);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.json(jsonData);
      return;
    }

    // Save the fetched data to the JSON file
    saveDataToFile(responseData);

    // Send the fetched data as response
    res.json(responseData);
  } catch (error) {
    console.error('Error handling GET request:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
