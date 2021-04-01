const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-1" });
const documentClient = new AWS.DynamoDB.DocumentClient();

import { transformDimensions, transformMeasures } from "./utils";

const Hashids = require("hashids");
const hashids = new Hashids();

const capitalise = (string) => {
  if (typeof string !== "string") return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const params = {
  TableName: "Product-znsvd3u5cvazno25lompnhhblm-master",
  IndexName: "byClaimedBySupplier", // Main one
  Limit: 100,
  KeyConditionExpression: "claimed = :partitionKey",
  ExpressionAttributeValues: {
    ":partitionKey": "yes",
  },
};

const getAllClaimedProducts = async (params) => {
  const _getAllData = async (params, startKey) => {
    if (startKey) {
      params.ExclusiveStartKey = startKey;
    }
    return documentClient.query(params).promise();
  };
  let lastEvaluatedKey = null;
  let rows = [];
  do {
    const result = await _getAllData(params, lastEvaluatedKey);
    rows = rows.concat(result.Items);
    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);
  return rows;
};

asyncModule(async () => {
  const products = await getAllClaimedProducts(params);
  const suppliers = products.reduce((prev, curr) => {
    if (!prev.includes(curr.supplierId)) {
      return [...prev, curr.supplierId];
    } else return prev;
  });

  const skusPerStorePerMonthDefinition = {
    sql: (totalSales, totalStores) => `${totalSales} / ${totalStores}`,
    type: `number`,
  };

  suppliers.forEach((supplier) => {
    let hex = buffer.from(supplier.id, "utf8").toString("hex");
    let tableName = hashids.encodeHex(hex);

    let sql = "SELECT * FROM master_supplier." + tableName;

    let measures = transformMeasures({
      itemsSold: {
        sql: `items_sold`,
        type: `sum`,
        title: `Number of units sold`,
        drillMembers: ["retailerId", "storeId"],
      },

      totalSales: {
        sql: `total_sales / 100.0`,
        type: `sum`,
        format: `currency`,
        title: `Total sales revenue`,
        drillMembers: ["retailerId", "storeId"],
      },

      averageUnitCost: {
        sql: `average_unit_cost / 100.0`,
        type: `avg`,
        format: `currency`,
        title: `Average unit cost`,
        drillMembers: ["retailerId", "storeId"],
      },

      totalStores: {
        sql: `store_id`,
        type: `count`,
        shown: false,
      },
    });

    let dimensions = transformDimensions({
      id: {
        sql: `id`,
        type: `string`,
        primaryKey: true,
      },
      upc: {
        sql: `upc`,
        type: `string`,
        title: `UPC`,
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

      retailerId: {
        sql: `retailer_id`,
        type: `string`,
      },

      storeId: {
        sql: `store_id`,
        type: `string`,
      },

      dateKey: {
        sql: `date_key`,
        type: `number`,
        shown: false,
      },

      year: {
        sql: `year`,
        type: `string`,
        shown: false,
      },

      month: {
        sql: `month`,
        type: `string`,
        shown: false,
      },

      day: {
        sql: `day`,
        type: `string`,
        shown: false,
      },
    });

    cube(tableName, {
      sql: sql,
      title: supplier.name,

      joins: {
        DateDimension: {
          relationship: `belongsTo`,
          sql: `${CUBE}.date_key = ${DateDimension}.date_key`,
        },

        SupplierDimension: {
          relationship: `belongsTo`,
          sql: `${CUBE}.supplier_id = ${SupplierDimension}.supplier_id`,
        },

        RetailerDimension: {
          relationship: `belongsTo`,
          sql: `${CUBE}.retailer_id = ${RetailerDimension}.retailer_id`,
        },

        StoreDimension: {
          relationship: `belongsTo`,
          sql: `${CUBE}.store_id = ${StoreDimension}.store_id`,
        },

        ProductDimension: {
          relationship: `belongsTo`,
          sql: `${CUBE}.upc = ${ProductDimension}.upc`,
        },
      },
      measures: {
        ...measures,
        skusPerStorePerMonth: skusPerStorePerMonthDefinition,
      },
      dimensions: dimensions,
    });
  });
});
