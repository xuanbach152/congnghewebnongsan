import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const distances = {
  "Hà Nội": {
    "Hà Nội": 0,
    "Hải Phòng": 120,
    "Quảng Ninh": 150,
    "Đà Nẵng": 800,
    "Huế": 700,
    "Quảng Nam": 850,
    "TP.HCM": 1700,
    "Cần Thơ": 1800,
    "Đồng Nai": 1650,
  },
  "Hải Phòng": {
    "Hà Nội": 120,
    "Hải Phòng": 0,
    "Quảng Ninh": 80,
    "Đà Nẵng": 850,
    "Huế": 750,
    "Quảng Nam": 900,
    "TP.HCM": 1750,
    "Cần Thơ": 1850,
    "Đồng Nai": 1700,
  },
  "Quảng Ninh": {
    "Hà Nội": 150,
    "Hải Phòng": 80,
    "Quảng Ninh": 0,
    "Đà Nẵng": 900,
    "Huế": 800,
    "Quảng Nam": 950,
    "TP.HCM": 1800,
    "Cần Thơ": 1900,
    "Đồng Nai": 1750,
  },
  "Đà Nẵng": {
    "Hà Nội": 800,
    "Hải Phòng": 850,
    "Quảng Ninh": 900,
    "Đà Nẵng": 0,
    "Huế": 100,
    "Quảng Nam": 50,
    "TP.HCM": 900,
    "Cần Thơ": 1000,
    "Đồng Nai": 850,
  },
  "Huế": {
    "Hà Nội": 700,
    "Hải Phòng": 750,
    "Quảng Ninh": 800,
    "Đà Nẵng": 100,
    "Huế": 0,
    "Quảng Nam": 150,
    "TP.HCM": 950,
    "Cần Thơ": 1050,
    "Đồng Nai": 900,
  },
  "Quảng Nam": {
    "Hà Nội": 850,
    "Hải Phòng": 900,
    "Quảng Ninh": 950,
    "Đà Nẵng": 50,
    "Huế": 150,
    "Quảng Nam": 0,
    "TP.HCM": 850,
    "Cần Thơ": 950,
    "Đồng Nai": 800,
  },
  "TP.HCM": {
    "Hà Nội": 1700,
    "Hải Phòng": 1750,
    "Quảng Ninh": 1800,
    "Đà Nẵng": 900,
    "Huế": 950,
    "Quảng Nam": 850,
    "TP.HCM": 0,
    "Cần Thơ": 150,
    "Đồng Nai": 50,
  },
  "Cần Thơ": {
    "Hà Nội": 1800,
    "Hải Phòng": 1850,
    "Quảng Ninh": 1900,
    "Đà Nẵng": 1000,
    "Huế": 1050,
    "Quảng Nam": 950,
    "TP.HCM": 150,
    "Cần Thơ": 0,
    "Đồng Nai": 200,
  },
  "Đồng Nai": {
    "Hà Nội": 1650,
    "Hải Phòng": 1700,
    "Quảng Ninh": 1750,
    "Đà Nẵng": 850,
    "Huế": 900,
    "Quảng Nam": 800,
    "TP.HCM": 50,
    "Cần Thơ": 200,
    "Đồng Nai": 0,
  },
};
const geocodeAddress = async (address) => {
  try {
    // Kiểm tra nếu đã có API key
    if (!process.env.MAPQUEST_API_KEY) {
      throw new Error("Thiếu MapQuest API key");
    }

    // Gọi MapQuest Geocoding API
    const response = await axios.get(
      "https://www.mapquestapi.com/geocoding/v1/address",
      {
        params: {
          key: process.env.MAPQUEST_API_KEY,
          location: address,
          maxResults: 1,
          thumbMaps: false
        }
      }
    );

    // Kiểm tra kết quả
    if (
      response.data.results &&
      response.data.results.length > 0 &&
      response.data.results[0].locations &&
      response.data.results[0].locations.length > 0
    ) {
      const location = response.data.results[0].locations[0].latLng;
      console.log(`Tọa độ cho địa chỉ "${address}":`, location);
      
      return {
        latitude: location.lat,
        longitude: location.lng
      };
    } else {
      console.warn(`Không tìm thấy tọa độ cho địa chỉ: ${address}`);
      throw new Error("Không tìm thấy tọa độ cho địa chỉ này");
    }
  } catch (error) {
    console.error("Lỗi khi chuyển đổi địa chỉ thành tọa độ:", error.message);
    throw new Error("Không thể chuyển đổi địa chỉ thành tọa độ");
  }
};
const calculateDistance = async (origin, destination) => {
  try {
    console.log(origin);
    console.log(destination);
    if (process.env.MAPQUEST_API_KEY) {
      
      const originAddress = `${origin.latitude},${origin.longitude}`;
      const destinationAddress = `${destination.latitude},${destination.longitude}`;

      // Gọi MapQuest Directions API
      const response = await axios.get(
        "https://www.mapquestapi.com/directions/v2/route",
        {
          params: {
            key: process.env.MAPQUEST_API_KEY,
            from: originAddress,
            to: destinationAddress,
            unit: "k", // k = kilometer
            routeType: "fastest",
            locale: "vi_VN",
          },
        }
      );

      // Kiểm tra kết quả trả về
      if (response.data.info.statuscode === 0) {
        // MapQuest trả về khoảng cách trực tiếp bằng km
        const distanceInKm = Math.round(response.data.route.distance);
        console.log(`Khoảng cách từ MapQuest: ${distanceInKm} km`);
        return distanceInKm;
      } else {
        console.log(
          "MapQuest API không trả về kết quả hợp lệ:",
          response.data.info.messages
        );
      }
    }

    // Sử dụng dữ liệu dự phòng 
    if (!distances[origin] || !distances[origin][destination]) {
      throw new Error("Không tìm thấy thông tin khoảng cách cho địa điểm này");
    }

    console.log(
      `Sử dụng dữ liệu dự phòng: ${distances[origin][destination]} km`
    );
    return distances[origin][destination];
  } catch (error) {
    console.error("Lỗi khi tính khoảng cách:", error.message);

    // Sử dụng dữ liệu dự phòng nếu có lỗi
    if (distances[origin] && distances[origin][destination]) {
      return distances[origin][destination];
    }

    throw new Error("Không thể tính khoảng cách vận chuyển");
  }
};

const calculateDeliveryFee = (distanceInKm) => {
  
  const baseFee = 10000;

  
  let feePerKm;

  if (distanceInKm <= 10) {
    feePerKm = 5000;
  } else if (distanceInKm <= 50) {
    feePerKm = 4500; 
  } else if (distanceInKm <= 100) {
    feePerKm = 4000; 
  } else {
    feePerKm = 3500; 
  }

  const deliveryFee = baseFee + distanceInKm * feePerKm;


  const maxFee = 2000000; 

  return Math.min(Math.round(deliveryFee), maxFee);
};

export default { calculateDistance, calculateDeliveryFee, geocodeAddress };
