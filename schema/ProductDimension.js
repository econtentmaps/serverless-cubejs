cube(`ProductDimension`, {
  sql: `SELECT * FROM mock_data.products`,

  joins: {
    SupplierDimension: {
      sql: `${CUBE}.supplier_id = ${SupplierDimension}.supplier_id`,
      relationship: `belongsTo`,
    },
  },

  measures: {
    count: {
      type: `count`,
      drillMembers: [productName, supplierId, brandName],
    },
  },

  dimensions: {
    upc: {
      sql: `upc`,
      type: `string`,
      primaryKey: true,
      shown: true,
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

    supplierId: {
      sql: `supplier_id`,
      type: `string`,
    },

    brandName: {
      sql: `brand_name`,
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
