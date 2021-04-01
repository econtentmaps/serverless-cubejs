const HandlerClass = require("@cubejs-backend/serverless-aws");
const MySQLDriver = require("@cubejs-backend/mysql-driver");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");
const jwks = JSON.parse(fs.readFileSync("./jwks.json"));
const _ = require("lodash");

module.exports = new HandlerClass({
  checkAuth: async (req, auth) => {
    const decoded = jwt.decode(auth, { complete: true });
    const jwk = _.find(jwks.keys, (x) => x.kid === decoded.header.kid);
    const pem = jwkToPem(jwk);
    req.securityContext = jwt.verify(auth, pem);
    // contextToAppId: ({ securityContext }) => `APP_${securityContext.userId}`;
    // preAggregationsSchema: ({ securityContext }) =>
    //   `pre_aggregations_${securityContext.userId}`;
    console.log("req.securityContext: ", req.securityContext);
  },
  // See
  // * https://github.com/cube-js/cube.js/blob/master/packages/cubejs-server-core/core/index.js#L190
  // * https://github.com/cube-js/cube.js/blob/d29a483606af5fc4abfd87213b6f148db990212c/examples/web-analytics/index.js#L18
  externalDbType: "mysql",
  externalDriverFactory: () =>
    new MySQLDriver({
      host: process.env.CUBEJS_EXT_DB_HOST,
      database: process.env.CUBEJS_EXT_DB_NAME,
      port: process.env.CUBEJS_EXT_DB_PORT,
      user: process.env.CUBEJS_EXT_DB_USER,
      password: process.env.CUBEJS_EXT_DB_PASS,
      // See https://stackoverflow.com/a/56524162/1603357
      ssl: true,
    }),
  preAggregationsSchema: `cubejs_${process.env.STAGE}`,
  // Don't send telemetry
  telemetry: false,
  // Set base path to hide it's Cube.js
  basePath: "/api",
});
