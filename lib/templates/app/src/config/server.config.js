const SERVER = {
  hostname : 'localhost',
  port     : 4000,
  env      : 'development',

  // https://github.com/expressjs/cors#configuration-options
  cors        : true,
  corsOptions : {
    'origin'                       : '*',
    'methods'                      : 'GET,POST,PUT,DELETE,OPTIONS',
    'preflightContinue'            : true,
    'Access-Control-Allow-Headers' : 'Authorization,Content-Type,Content-Length'
  },

  // https://helmetjs.github.io/docs/
  helmet        : true,
  helmetOptions : {}
}

module.exports = SERVER
