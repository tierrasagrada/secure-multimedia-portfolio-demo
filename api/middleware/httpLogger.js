import pinoHttp from "pino-http";

const httpLogger = pinoHttp({

  base: null,

  customProps: (req) => ({
    ip: req.ip,
    requestId: req.requestId    
  }),

  serializers: {

req(req) {

  let url = req.url;

  if (url.includes("token=")) {

    url = url.replace(
      /token=[^&]+/,
      "token=[REDACTED]"
    );
  }

  return {
    method: req.method,
    url
  };
},

    res(res) {

      return {
        statusCode: res.statusCode
      };
    }
  },

autoLogging: {

  ignore: (req) => {

    return (

      req.url.startsWith("/assets/")

      ||

      req.url === "/favicon.ico"
    );
  }
}

});

export default httpLogger;