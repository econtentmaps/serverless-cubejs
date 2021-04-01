cube(`StoreDimension`, {
  sql: `SELECT * FROM mock_data.stores`,

  joins: {
    RetailerDimension: {
      sql: `${CUBE}.retailer_id = ${RetailerDimension}.retailer_id`,
      relationship: `belongsTo`,
    },
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [
        id,
        name,
        assortmentid,
        country,
        retailerid,
        storeId,
        storeName,
        assortmentId,
        retailerId,
      ],
    },
  },

  dimensions: {
    id: {
      sql: `id`,
      type: `string`,
      primaryKey: true,
    },

    name: {
      sql: `name`,
      type: `string`,
    },

    assortmentid: {
      sql: `assortmentid`,
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

    retailerid: {
      sql: `retailerid`,
      type: `string`,
    },

    storeId: {
      sql: `store_id`,
      type: `string`,
    },

    storeName: {
      sql: `store_name`,
      type: `string`,
    },

    assortmentId: {
      sql: `assortment_id`,
      type: `string`,
    },

    retailerId: {
      sql: `retailer_id`,
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
