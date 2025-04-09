const mysql = require('mysql');

var dbEnergy = mysql.createConnection({
    port: 3300,
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'dbenergy',
    multipleStatements: true
});

dbEnergy.connect((err, con) => {
    if (err) {
        throw err;
    }
});

exports.getDate = (req, res) => {
    if ((/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(req.params.date_str)) == false) {
        return res.status(400).json({
            message: "Bad request. Date should be in YYYY-MM-DD format",
            status: '400'
        });
    }
    let AreaName = req.params.AreaName;
    let Resolution = req.params.Resolution;
    let date_str = req.params.date_str.split("-");
    let Year = date_str[0];
    let Month = date_str[1];
    let Day = date_str[2];
    if (Day[0] == 0) Day = Day[1];
    if (Month[0] == 0) Month = Month[1];
    dbEnergy.query(
          /*`SELECT nextT.TotalLoadValue, nextT.UpdateTime, nextT.DateTime, map.mapCodeText, area.AreaTypeCodeText
          FROM dayaheadtotalloadforecast as nextT
          INNER JOIN areatypecode as area on nextT.AreaTypeCodeId = area.Id
          INNER JOIN mapcode as map on nextT.MapCodeId = map.Id
          INNER JOIN resolutioncode as res on nextT.ResolutionCodeId = res.Id
          INNER JOIN allocatedeicdetail as alocD on nextT.AreaCodeId = alocD.Id
          WHERE nextT.Year = ? AND nextT.Month = ? AND nextT.Day = ? AND alocD.LongNames = ? AND res.ResolutionCodeText = ?;`,*/

          `SELECT nextT.TotalLoadValue, nextT.UpdateTime, nextT.DateTime, map.mapCodeText, area.AreaTypeCodeText
          FROM dayaheadtotalloadforecast as nextT
          INNER JOIN areatypecode as area on nextT.AreaTypeCodeId = area.Id
          INNER JOIN mapcode as map on nextT.MapCodeId = map.Id
          INNER JOIN resolutioncode as res on nextT.ResolutionCodeId = res.Id
          WHERE nextT.Year = ? AND nextT.Month = ? AND nextT.Day = ? AND nextT.AreaName = ? AND res.ResolutionCodeText = ?
          ORDER BY nextT.DateTime;`,

        [Year, Month, Day, AreaName, Resolution],
        (err, result) => {
            if (!err) {
                if (result.length < 1) res.status(403).json({
                    message: "No data for the date or wrong input",
                    status: "403"
                });
                else {
                    var stack = [];
                    result.forEach(element => {
                        var jsonObj = {
                            Source: "entso-e",
                            Dataset: "DayAheadTotalLoadForecast",
                            AreaName: AreaName,
                            AreaTypeCode: element.AreaTypeCodeText,
                            MapCode: element.mapCodeText,
                            ResolutionCode: Resolution,
                            Year: Year,
                            Month: Month,
                            Day: Day,
                            DateTimeUTC: element.DateTime,
                            DayAheadTotalLoadForecastValue: element.TotalLoadValue,
                            UpdateTimeUTC: element.UpdateTime
                        };
                        stack.push(jsonObj);
                    });
                    res.status(200).json(stack);
                }
            }
            else {
                throw err;
            }
        }
    );
}

exports.getMonth = (req, res) => {
    if ((/([12]\d{3}-(0[1-9]|1[0-2]))/.test(req.params.date_str)) == false) {
        return res.status(400).json({
            message: "Bad request. Date should be in YYYY-MM format",
            status: '400'
        });
    }
    let AreaName = req.params.AreaName;
    let Resolution = req.params.Resolution;
    let date_str = req.params.date_str.split("-");
    let Year = date_str[0];
    let Month = date_str[1];
    if (Month[0] == 0) Month = Month[1];
    dbEnergy.query(
        /*`SELECT SUM(nextT.TotalLoadValue) as count, nextT.Day, map.mapCodeText, area.AreaTypeCodeText
          FROM dayaheadtotalloadforecast as nextT
          LEFT JOIN dbenergy.areatypecode as area on nextT.AreaTypeCodeId = area.Id
          LEFT JOIN dbenergy.mapcode as map on nextT.MapCodeId = map.Id
          LEFT JOIN dbenergy.resolutioncode as res on nextT.ResolutionCodeId = res.Id
          LEFT JOIN dbenergy.allocatedeicdetail as alocD on nextT.AreaCodeId = alocD.Id
          WHERE nextT.Year = ? AND nextT.Month = ? AND alocD.LongNames = ? AND res.ResolutionCodeText = ?
          GROUP BY nextT.Day
          ORDER BY nextT.Day ASC;`,*/
           `SELECT SUM(nextT.TotalLoadValue) as count, nextT.Day, map.mapCodeText, area.AreaTypeCodeText,nextT.UpdateTime, nextT.DateTime
           FROM dayaheadtotalloadforecast as nextT
           LEFT JOIN dbenergy.areatypecode as area on nextT.AreaTypeCodeId = area.Id
           LEFT JOIN dbenergy.mapcode as map on nextT.MapCodeId = map.Id
           LEFT JOIN dbenergy.resolutioncode as res on nextT.ResolutionCodeId = res.Id
           WHERE nextT.Year = ? AND nextT.Month = ? AND nextT.AreaName = ? AND res.ResolutionCodeText = ?
           GROUP BY nextT.Day
           ORDER BY nextT.Day ASC;`,          
        [Year, Month, AreaName, Resolution],
        (err, result) => {
            if (!err) {
                if (result.length < 1) res.status(403).json({
                    message: "No data for the date or wrong input",
                    status: '403'
                });
                else {
                    var stack = [];
                    result.forEach(element => {
                        var jsonObj = {
                            Source: "entso-e",
                            Dataset: "DayAheadTotalLoadForecast",
                            AreaName: AreaName,
                            AreaTypeCode: element.AreaTypeCodeText,
                            MapCode: element.mapCodeText,
                            ResolutionCode: Resolution,
                            Year: Year,
                            Month: Month,
                            Day: element.Day,
                            DayAheadTotalLoadForecastByDayValue: element.count,
                        };
                        stack.push(jsonObj);
                    });
                    res.status(200).json(stack);
                }
            }
            else {
                throw err;
            }
        }
    );
}

exports.getYear = (req, res) => {
    if ((/([12]\d{3})/.test(req.params.date_str)) == false) {
        return res.status(400).json({
            message: "Bad request. Date should be in YYYY format",
            status: '400'
        });
    }
    let AreaName = req.params.AreaName;
    let Resolution = req.params.Resolution;
    let Year = req.params.date_str;
    dbEnergy.query(
        /*`SELECT COUNT(nextT.TotalLoadValue) as count, nextT.Month, map.mapCodeText, area.AreaTypeCodeText
          FROM dayaheadtotalloadforecast as nextT
          INNER JOIN dbenergy.areatypecode as area on nextT.AreaTypeCodeId = area.Id
          INNER JOIN dbenergy.mapcode as map on nextt.MapCodeId = map.Id
          INNER JOIN dbenergy.resolutioncode as res on nextt.ResolutionCodeId = res.Id
          INNER JOIN dbenergy.allocatedeicdetail as alocD on nextt.AreaCodeId = alocD.Id
          WHERE nextT.Year = ? AND nextT.LongNames = ? AND res.ResolutionCodeText = ?
          GROUP BY nextt.Month
          ORDER BY nextt.Month ASC;`*/
          `SELECT SUM(nextT.TotalLoadValue) as count, nextt.Month, map.mapCodeText, area.AreaTypeCodeText,nextT.UpdateTime, nextT.DateTime
          FROM dayaheadtotalloadforecast as nextT
          INNER JOIN dbenergy.areatypecode as area on nextt.AreaTypeCodeId = area.Id
          INNER JOIN dbenergy.mapcode as map on nextt.MapCodeId = map.Id
          INNER JOIN dbenergy.resolutioncode as res on nextt.ResolutionCodeId = res.Id
          WHERE nextT.Year = ? AND nextT.AreaName = ? AND res.ResolutionCodeText = ?
          GROUP BY nextT.Month
          ORDER BY nextT.Month ASC;`,
        [Year, AreaName, Resolution],
        (err, result) => {
            if (!err) {
                if (result.length < 1) res.status(403).json({
                    message: "No data for the date or wrong input",
                    status: '403'
                });
                else {
                    var stack = [];
                    result.forEach(element => {
                        var jsonObj = {
                            Source: "entso-e",
                            Dataset: "DayAheadTotalLoadForecast",
                            AreaName: AreaName,
                            AreaTypeCode: element.AreaTypeCodeText,
                            MapCode: element.mapCodeText,
                            ResolutionCode: Resolution,
                            Year: Year,
                            Month: element.Month,
                            DayAheadTotalLoadForecastByMonthValue: element.count
                        };
                        stack.push(jsonObj);
                    });
                    res.status(200).json(stack);
                }
            }
            else {
                throw err;
            }
        }
    );
}