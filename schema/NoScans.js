cube(`NoScans`, {
  sql: `SELECT * FROM mock_data.no_scanswhere ${SECURITY_CONTEXT[
    "custom:orgId"
  ].filter("supplier_id")}`,

  joins: {},

  measures: {
    total: {
      type: `count`,
      drillMembers: [retailerName, storeName, county, state],
    },
  },

  dimensions: {
    upc: {
      sql: `upc`,
      type: `string`,
      title: "UPC",
    },

    storeName: {
      sql: `store_name`,
      type: `string`,
    },

    supplierId: {
      sql: `supplier_id`,
      type: `string`,
    },

    locality: {
      sql: `locality`,
      type: `string`,
      title: "City/Locality",
    },

    county: {
      sql: `county`,
      type: `string`,
    },

    state: {
      sql: `state`,
      type: `string`,
    },

    country: {
      sql: `country`,
      type: `string`,
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

    fullDate: {
      sql: `full_date`,
      type: `time`,
      title: "Date",
    },
  },
  preAggregations: {
    main: {
      sqlAlias: `original`,
      type: `originalSql`,
    },
    monthRollup: {
      type: `rollup`,
      external: true,
      measureReferences: [total],
      dimensionReferences: [upc, retailerName, storeName, county, state],
      timeDimensionReference: fullDate,
      granularity: `day`,
      partitionGranularity: `month`,
    },
  },

  dataSource: `default`,
});
