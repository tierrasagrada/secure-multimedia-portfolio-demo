import csurf from "csurf";

const csrfProtection = csurf({

  cookie: {

    httpOnly: true,

    secure:
      process.env.NODE_ENV ===
      "production",

    sameSite: "Strict",
  },
});

export default csrfProtection;