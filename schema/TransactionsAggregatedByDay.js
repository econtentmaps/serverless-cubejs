cube(`Transactions`, {
  sql: `SELECT * FROM mock_data.transactions_aggregated_by_day where ${SECURITY_CONTEXT[
    "custom:orgId"
  ].filter("supplier_id")}`,

  title: "Transactions",

  joins: {},

  measures: {
    unitsSold: {
      sql: `units_sold`,
      type: `count`,
      drillMembers: [productName, retailerName, storeName, county, state],
    },

    totalSales: {
      sql: `total_sales`,
      type: `sum`,
      title: "Total Sales Revenue",
      drillMembers: [productName, retailerName, storeName, county, state],
    },

    averageUnitCost: {
      sql: `average_unit_cost`,
      type: `avg`,
      drillMembers: [productName, retailerName, storeName, country],
    },
  },

  dimensions: {
    location: {
      type: `geo`,
      latitude: {
        sql: `${CUBE}.latitude`,
      },
      longitude: {
        sql: `${CUBE}.longitude`,
      },
    },

    supplierId: {
      sql: `supplier_id`,
      type: `string`,
      shown: false,
    },

    retailerId: {
      sql: `retailer_id`,
      type: `string`,
      shown: false,
    },

    storeId: {
      sql: `store_id`,
      type: `string`,
      shown: false,
    },

    upc: {
      sql: `upc`,
      type: `string`,
      title: "UPC",
    },

    productName: {
      sql: `product_name`,
      type: `string`,
    },

    category: {
      sql: `category`,
      type: `string`,
    },

    subCategory: {
      sql: `sub_category`,
      type: `string`,
    },

    storeName: {
      sql: `store_name`,
      type: `string`,
    },

    postalCode: {
      sql: `postal_code`,
      type: `string`,
    },

    locality: {
      sql: `locality`,
      type: `string`,
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

    supplierName: {
      sql: `supplier_name`,
      type: `string`,
    },

    dayName: {
      sql: `day_name`,
      type: `string`,
    },

    dayAbbrev: {
      sql: `day_abbrev`,
      type: `string`,
    },

    weekdayFlag: {
      sql: `weekday_flag`,
      type: `string`,
    },

    monthName: {
      sql: `month_name`,
      type: `string`,
    },

    monthAbbrev: {
      sql: `month_abbrev`,
      type: `string`,
    },

    monthEndFlag: {
      sql: `month_end_flag`,
      type: `string`,
    },

    day: {
      sql: `day`,
      type: `string`,
    },

    id: {
      sql: `id`,
      type: `string`,
      primaryKey: true,
      shown: false,
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

    // weekBeginDate: {
    //   sql: `week_begin_date`,
    //   type: `time`,
    // },

    // sameDayYearAgo: {
    //   sql: `same_day_year_ago`,
    //   type: `time`,
    // },
  },

  preAggregations: {
    main: {
      sqlAlias: `original`,
      type: `originalSql`,
    },
    monthRollup: {
      type: `rollup`,
      external: true,
      measureReferences: [unitsSold, totalSales],
      dimensionReferences: [upc, retailerName, storeName, county, state],
      timeDimensionReference: fullDate,
      granularity: `day`,
      partitionGranularity: `month`,
    },
  },

  dataSource: `default`,
});
