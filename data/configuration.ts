import { Options } from "node-geocoder"

const configuration = {
    cacheStaleTime: process.env.BROWSER_STALE_TIME ? parseInt(process.env.BROWSER_STALE_TIME) : 300000,

    nodeGeocoder: {
        provider: 'mapbox',
        // Optional depending on the providers
        apiKey: process.env.MAPBOX_TOKEN, // for Mapquest, OpenCage, Google Premier
        formatter: null // 'gpx', 'string', ...
    } as Options
      
}


export default configuration