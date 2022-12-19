const configuration = {
    cacheStaleTime: process.env.BROWSER_STALE_TIME ? parseInt(process.env.BROWSER_STALE_TIME) : 300000
}

export default configuration