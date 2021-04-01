cube(`RetailerDimension`, {
  sql: `SELECT * FROM mock_data.retailers`,

  joins: {},

  measures: {
    count: {
      type: `count`,
      drillMembers: [retailerId, retailerName],
    },
  },

  dimensions: {
    retailerId: {
      sql: `retailer_id`,
      type: `string`,
      primaryKey: true,
      shown: false,
    },

    retailerName: {
      sql: `retailer_name`,
      type: `string`,
    },

    year: {
      sql: `year`,
      type: `string`,
    },

    month: {
      sql: `month`,
      type: `string`,
    },

    day: {
      sql: `day`,
      type: `string`,
    },
  },

  dataSource: `default`,
});
