import axios from 'axios'

const publicGeoAPifyKey = process.env.NEXT_PUBLIC_GEOAPIFY_KEY as String

export const getGeolocation = async () => {
  let address = ''
  let ip = ''

  if (typeof window === 'undefined' || !publicGeoAPifyKey) {
    return { address, ip }
  }

  try {
    const response = await axios.get(
      `https://api.geoapify.com/v1/ipinfo?&apiKey=${publicGeoAPifyKey}`
    )
    if (response && response.data) {
      const geoData = response?.data
      address = `${geoData?.country?.name}`
      ip = geoData?.ip

      if (geoData?.state?.name) address += ` | ${geoData?.state?.name}`
      if (geoData?.city?.name) address += ` | ${geoData?.city?.name}`

      if (geoData?.location)
        address += ` | lat: ${geoData?.location?.latitude} lng: ${geoData?.location?.longitude}`
    }
  } catch (_ex) {
    console.warn(_ex)
  }

  return { address, ip }
}
