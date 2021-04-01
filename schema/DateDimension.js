cube(`DateDimension`, {
  sql: `SELECT * FROM mock_data.date_dimension`,

  measures: {
    count: {
      type: `count`,
      drillMembers: [dayName, monthName, fullDate, weekBeginDate],
      shown: false,
    },
  },

  dimensions: {
    dateKey: {
      sql: `date_key`,
      type: `number`,
      primaryKey: true,
      shown: false,
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

    fullDate: {
      sql: `full_date`,
      type: `time`,
    },

    weekBeginDate: {
      sql: `week_begin_date`,
      type: `time`,
    },

    sameDayYearAgo: {
      sql: `same_day_year_ago`,
      type: `time`,
    },
  },
});
