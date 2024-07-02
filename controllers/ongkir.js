const axios = require('axios');

const getDrivingDistance = async (start, end) => {
    const apiKey = "5b3ce3597851110001cf62484e633ffa7e104a9a92679cf462f4dd41"; // Replace with your OpenRouteService API key
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}`;
  
    const data = {
      coordinates: [
        [start.longitude, start.latitude],
        [end.longitude, end.latitude],
      ],
    };
  
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const distance = response.data.routes[0].summary.distance;
      return distance; // distance in meters
    } catch (error) {
      console.error('Error fetching distance:', error);
      throw new Error('Could not calculate distance');
    }
  };
  
  module.exports = getDrivingDistance;