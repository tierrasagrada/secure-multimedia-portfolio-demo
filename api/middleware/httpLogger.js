import pinoHttp from "pino-http";

const httpLogger = pinoHttp({

  base: null,

  customProps: (req) => ({
    ip: req.ip
  }),

  serializers: {

    req(req) {

      return {
        method: req.method,
        url: req.url
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
},

  serializers: {

    req(req) {

      return {

        method: req.method,

        url: req.url,

        ip: req.ip,
      };
    },

    res(res) {

      return {

        statusCode: res.statusCode,
      };
    },
  },
});

export default httpLogger;