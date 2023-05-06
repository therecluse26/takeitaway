const defaultOptions = {
  // HCaptcha token verification url. Read more at
  // https://docs.hcaptcha.com/#verify-the-user-response-server-side
  captchaVerifyUrl: 'https://hcaptcha.com/siteverify',
  // Whether to pass request ip address or not
  // The ip resolving is done by checking cf-connecting-ip, x-forwarded-for headers
  // or evetually request.socket.remoteAddress property
  // (if the two mentioned earlier are undefined).
  passRequestIpAddress: false,
  // Whether to skip HCaptcha requests optimization or not.
  // Requests optimization are simple static checks if some
  // properties from the payload exist and if they are not empty.
  skipCaptchaRequestsOptimization: false,
  // Whether to throw when HCaptcha response is considered invalid.
  // (success property is false or score is not met when threshold is set)
  exceptions: true,
  // Whether to clean h-captcha-response and g-recaptcha-response from body
  // from intercepted Next.js request object. Useful when next-hcaptcha is
  // part of middleware chain and you dont want these props e.g. in validation layer
  cleanInterception: true,
  // Error display mode. If set to 'message', it will show error's descriptions
  // from https://docs.hcaptcha.com/#siteverify-error-codes-table. If set to 'code' it will
  // show the error code instead.
  // errorDisplayMode: 'message',
  // Whether to forward HCaptcha response parameters to Next.js API Route handler request parameter.
  // Accessible under request.hcaptcha (for TypeScript users - there is NextApiRequestWithHCaptcha type).
  // Forwarded only if HCaptcha response is success and (when specified) if passed `enterprise.scoreThreshold` check.
  forwardCaptchaResponse: false,
 
  // Env vars names object. Key is type of env var and value is your custom name.
  // Value can be any string as long as it matches your .env* file.
  envVarNames: { secret: 'HCAPTCHA_SECRET' },
}

export default defaultOptions