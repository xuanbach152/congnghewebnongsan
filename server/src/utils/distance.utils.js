
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

const calculateDistance = async (origin, destination) => {
 if(!distances[origin] || !distances[destination]) {
    throw new Error("Invalid location");
  }
  return distances[origin][destination];
};

const calculateDeliveryFee = (distanceInKm) => {
  const baseFee = 10000;
  const feePerKm = 5000;
  const deliveryFee = baseFee + distanceInKm * feePerKm;

  return Math.round(deliveryFee); // Làm tròn
};

export default { calculateDistance, calculateDeliveryFee };
