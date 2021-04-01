cube(`SupplierDimension`, {
  sql: `SELECT * FROM mock_data.suppliers`,

  joins: {},

  measures: {
    count: {
      type: `count`,
      drillMembers: [supplierId, supplierName],
    },
  },

  dimensions: {
    supplierId: {
      sql: `supplier_id`,
      type: `string`,
      primaryKey: true,
      shown: false,
    },

    supplierName: {
      sql: `supplier_name`,
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
