const jwt = require("jsonwebtoken");
const Err = require("../mw/err");

const jsonWebTokenErrorWrapper = (fn) => (token) => {
  try {
    return fn(token);
  } catch (error) {
    if (error === "JsonWebTokenError") throw new Err(401, "Invalid token");
    else throw new Err(401, error.message);
  }
};
 
const signIn = jsonWebTokenErrorWrapper((username) =>
  jwt.sign({ username }, process.env.SECRET_ACCESS_TOKEN)
);

const verify = jsonWebTokenErrorWrapper((token) =>
  jwt.verify(token, process.env.SECRET_ACCESS_TOKEN)
);

const decode = jsonWebTokenErrorWrapper((token) =>
  jwt.decode(token, process.env.SECRET_ACCESS_TOKEN)
);

module.exports = {
  signIn,
  decode,
  verify,
};
