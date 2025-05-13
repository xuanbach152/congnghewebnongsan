import axios from 'axios'

export function getLocationSuggestions(query) {
  if (query.length >= 2) {
    try {
      const response = axios.get(
        `https://www.mapquestapi.com/search/v3/prediction`,
        {
          params: {
            key: process.env.REACT_APP_MAPQUEST_API_KEY,
            limit: 7,
            collection: 'address,adminArea,poi',
            q: query,
            location: `${process.env.REACT_APP_LONGITUDE_HANOI},${process.env.REACT_APP_LATITUDE_HANOI}`,
            countryCode: 'VN',
          },
        }
      )
      return response
    } catch (error) {
      console.log('Error fetching suggestions:', error)
    }
  } else {
    return [];
  }
}
