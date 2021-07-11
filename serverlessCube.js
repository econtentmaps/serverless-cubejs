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
    console.log("req.securityContext: ", req.securityContext);
  },

  scheduledRefreshContexts: async () => [
    {
      securityContext: {
        ["custom:orgId"]: "none",
      },
    },
  ],

  queryTransformer: (query, { securityContext }) => {
    const user = securityContext;
    if (user["custom:orgId"] && user["custom:orgId"] !== "none") {
      console.log("query: ", JSON.stringify(query));
      const cubes = query.measures.map((measure) => {
        return measure.split(".")[0];
      });
      cubes.forEach((cube) => {
        query.filters.push({
          member: cube + ".supplierId",
          operator: "equals",
          values: [user["custom:orgId"]],
        });
      });
    }
    return query;
  },

  // TODO: enable this next section for per-tenant pre-aggs
  // preAggregationsSchema: ({ securityContext }) =>
  //   `cubejs_${process.env.STAGE}_${securityContext["custom:orgId"]}`,
  // contextToAppId: ({ securityContext }) =>
  //   `APP_${securityContext["custom:orgId"]}`,

  // and disable this for per-tenant pre-aggs
  preAggregationsSchema: `cubejs_${process.env.STAGE}`,

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

  // Don't send telemetry
  telemetry: false,
  // Set base path to hide it's Cube.js
  basePath: "/api",
});
