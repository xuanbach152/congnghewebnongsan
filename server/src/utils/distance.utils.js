import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

 const calculateDistance = async (origin, destination) => {
  try {
    const response = await client.distancematrix({
      params: {
        origins: [origin], 
        destinations: [destination], 
        key: AIzaSyBjYZA9hilY9ylwuREGfsglG5F9CnVO_E8, 
      },
    });

    const distanceInMeters =
      response.data.rows[0].elements[0].distance.value; 
    const distanceInKm = distanceInMeters / 1000; 

    return distanceInKm;
  } catch (error) {
    console.error("Error in calculateDistance:", error.message);
    throw new Error("Failed to calculate distance");
  }
};

const calculateDeliveryFee = (distanceInKm) => {
    const baseFee = 10000; 
    const feePerKm = 5000; 
    const deliveryFee = baseFee + distanceInKm * feePerKm;
  
    return Math.round(deliveryFee); // Làm tròn
  };

export default { calculateDistance, calculateDeliveryFee };