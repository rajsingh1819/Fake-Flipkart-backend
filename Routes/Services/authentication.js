require("dotenv").config();
const jwt = require("jsonwebtoken");

function authenticationToken(req, resp, next) {
  const autHeader = req.headers["authorization"];
  const token = autHeader && autHeader.split(" ")[1];
  if (token == null) return resp.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, response) => {
    if (err) return resp.sendStatus(403);

    resp.locals = response;
    next();
  });
}

module.exports = { authenticationToken: authenticationToken };
