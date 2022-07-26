const expressJwt = require("express-jwt");
const config = require("../secret.json");

function jwt() {
  const { secret } = config;
  return expressJwt({ secret, algorithms: ["RS256", "HS256"] }).unless({
    path: ["/signin/fillsignin"],
  });
}
module.exports = jwt;


