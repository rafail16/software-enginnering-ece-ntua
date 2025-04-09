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
  if((/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(req.params.date_str)) == false){
        return res.status(400).json({
            message:"Bad request. Date should be in YYYY-MM-DD format",
            status: '400'
        });
    }
    let AreaName = req.params.AreaName;
    let ProductionType = req.params.ProductionType;
    let Resolution = req.params.Resolution; 
    let date_str = req.params.date_str.split("-");
    let Year = date_str[0];
    let Month = date_str[1];
    let Day = date_str[2];
    if (Day[0] == 0) Day = Day[1];
    if(Month[0] == 0) Month = Month[1];
    if (ProductionType == 'AllTypes') {
        dbEnergy.query(
          /*  `SELECT aggr.ActualGenerationOutput, aggr.UpdateTime, aggr.DateTime, prod.ProductionTypeText, map.mapCodeText, area.AreaTypeCodeText
            FROM aggregatedgenerationpertype as aggr
            INNER JOIN areatypecode as area on aggr.AreaTypeCodeId = area.Id
            INNER JOIN mapcode as map on aggr.MapCodeId = map.Id
            INNER JOIN resolutioncode as res on aggr.ResolutionCodeId = res.Id
            INNER JOIN allocatedeicdetail as alocD on aggr.AreaCodeId = alocD.Id
            INNER JOIN productiontype as prod on aggr.ProductionTypeId = prod.Id
            WHERE aggr.Year = ? AND aggr.Month = ? AND aggr.Day = ? AND alocD.LongNames = ? AND res.ResolutionCodeText = ?;`,
            [Year, Month, Day, AreaName, Resolution], */
            //to alocD.Id den exei sxesh me to areacode 
            `SELECT aggr.ActualGenerationOutput, aggr.UpdateTime, aggr.DateTime, prod.ProductionTypeText, map.mapCodeText, area.AreaTypeCodeText
            FROM aggregatedgenerationpertype as aggr
            INNER JOIN areatypecode as area on aggr.AreaTypeCodeId = area.Id
            INNER JOIN mapcode as map on aggr.MapCodeId = map.Id
            INNER JOIN resolutioncode as res on aggr.ResolutionCodeId = res.Id
            INNER JOIN productiontype as prod on aggr.ProductionTypeId = prod.Id
            WHERE aggr.Year = ? AND aggr.Month = ? AND aggr.Day = ? AND aggr.AreaName = ? AND res.ResolutionCodeText = ?
            ORDER BY aggr.DateTime;`,
            
            [Year, Month, Day, AreaName, Resolution],
            (err, result) => {
                if (!err) {
                    if(result.length < 1) res.status(403).json({
                        message: "No data for the date or wrong input",
                        status: '403'
                    });
                    else {
                        var stack = [];
                        result.forEach(element => {
                            var jsonObj = {
                                Source: "entso-e",
                                Dataset: "AggregatedGenerationPerType",
                                AreaName: AreaName,
                                AreaTypeCode: element.AreaTypeCodeText,
                                MapCode: element.mapCodeText,
                                ResolutionCode: Resolution,
                                Year: Year,
                                Month: Month,
                                Day: Day,
                                ProductionType: element.ProductionTypeText,
                                DateTimeUTC: element.DateTime,
                                ActualGenerationOutputValue: element.ActualGenerationOutput,
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
    else {
        dbEnergy.query(
           /* `SELECT aggr.ActualGenerationOutput, aggr.UpdateTime, aggr.DateTime, map.mapCodeText, area.AreaTypeCodeText
            FROM aggregatedgenerationpertype as aggr
            INNER JOIN areatypecode as area on aggr.AreaTypeCodeId = area.Id
            INNER JOIN mapcode as map on aggr.MapCodeId = map.Id
            INNER JOIN resolutioncode as res on aggr.ResolutionCodeId = res.Id
            INNER JOIN allocatedeicdetail as alocD on aggr.AreaCodeId = alocD.Id
            INNER JOIN productiontype as prod on aggr.ProductionTypeId = prod.Id
            WHERE aggr.Year = ? AND aggr.Month = ? AND aggr.Day = ? AND alocD.LongNames = ? AND res.ResolutionCodeText = ? AND prod.ProductionTypeText = ?;`,
            [Year, Month, Day, AreaName, Resolution, ProductionType],*/ 
            `SELECT aggr.ActualGenerationOutput, aggr.UpdateTime, aggr.DateTime, map.mapCodeText, area.AreaTypeCodeText
            FROM aggregatedgenerationpertype as aggr
            INNER JOIN areatypecode as area on aggr.AreaTypeCodeId = area.Id
            INNER JOIN mapcode as map on aggr.MapCodeId = map.Id
            INNER JOIN resolutioncode as res on aggr.ResolutionCodeId = res.Id
            INNER JOIN productiontype as prod on aggr.ProductionTypeId = prod.Id
            WHERE aggr.Year = ? AND aggr.Month = ? AND aggr.Day = ? AND aggr.AreaName = ? AND res.ResolutionCodeText = ? AND prod.ProductionTypeText = ?
            ORDER BY aggr.DateTime;`,
            [Year, Month, Day, AreaName, Resolution, ProductionType],
            (err, result) => {
                if (!err) {
                    if(result.length < 1) res.status(403).json({
                        message: "No data for the date or wrong input",
                        status: '403'
                    });
                    else {
                        var stack = [];
                        result.forEach(element => {
                            var jsonObj = {
                                Source: "entso-e",
                                Dataset: "AggregatedGenerationPerType",
                                AreaName: AreaName,
                                AreaTypeCode: element.AreaTypeCodeText,
                                MapCode: element.mapCodeText,
                                ResolutionCode: Resolution,
                                Year: Year,
                                Month: Month,
                                Day: Day,
                                ProductionType: ProductionType,
                                DateTimeUTC: element.DateTime,
                                ActualGenerationOutputValue: element.ActualGenerationOutput,
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
}

exports.getMonth = (req, res) => {
  if((/([12]\d{3}-(0[1-9]|1[0-2]))/.test(req.params.date_str)) == false){
        return res.status(400).json({
            message:"Bad request. Date should be in YYYY-MM format",
            status: '400'
        });
    }
    let AreaName = req.params.AreaName;
    let ProductionType = req.params.ProductionType;
    let Resolution = req.params.Resolution; 
    let date_str = req.params.date_str.split("-");
    let Year = date_str[0];
    let Month = date_str[1];
    if(Month[0] == 0) Month = Month[1];
    if (ProductionType == 'AllTypes') {
        dbEnergy.query(
          /*  `SELECT SUM(aggr.ActualGenerationOutput) as count, aggr.Day, prod.ProductionTypeText, map.mapCodeText, area.AreaTypeCodeText
            FROM aggregatedgenerationpertype as aggr
            INNER JOIN areatypecode as area on aggr.AreaTypeCodeId = area.Id
            INNER JOIN mapcode as map on aggr.MapCodeId = map.Id
            INNER JOIN resolutioncode as res on aggr.ResolutionCodeId = res.Id
            INNER JOIN allocatedeicdetail as alocD on aggr.AreaCodeId = alocD.Id
            INNER JOIN productiontype as prod on aggr.ProductionTypeId = prod.Id
            WHERE aggr.Year = ? AND aggr.Month = ? AND alocD.LongNames = ? AND res.ResolutionCodeText = ?
            GROUP BY aggr.Day
            ORDER BY aggr.Day ASC;`,
            [Year, Month, AreaName, Resolution],*/
            `SELECT SUM(aggr.ActualGenerationOutput) as count, aggr.Day, prod.ProductionTypeText, map.mapCodeText, area.AreaTypeCodeText
            FROM aggregatedgenerationpertype as aggr
            INNER JOIN areatypecode as area on aggr.AreaTypeCodeId = area.Id
            INNER JOIN mapcode as map on aggr.MapCodeId = map.Id
            INNER JOIN resolutioncode as res on aggr.ResolutionCodeId = res.Id
            INNER JOIN productiontype as prod on aggr.ProductionTypeId = prod.Id
            WHERE aggr.Year = ? AND aggr.Month = ? AND aggr.AreaName = ? AND res.ResolutionCodeText = ?
            GROUP BY aggr.Day
            ORDER BY aggr.Day ASC;`,
            [Year, Month, AreaName, Resolution],

            (err, result) => {
                if (!err) {
                    if(result.length < 1) res.status(403).json({
                        message: "No data for the date or wrong input",
                        status: '403'
                    });
                    else {
                        var stack = [];
                        result.forEach(element => {
                            var jsonObj = {
                                Source: "entso-e",
                                Dataset: "AggregatedGenerationPerType",
                                AreaName: AreaName,
                                AreaTypeCode: element.AreaTypeCodeText,
                                MapCode: element.mapCodeText,
                                ResolutionCode: Resolution,
                                Year: Year,
                                Month: Month,
                                Day: element.Day,
                                ProductionType: element.ProductionTypeText,
                                ActualGenerationOutputByDayValue: element.count,
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
    else {
        dbEnergy.query(
            /*`SELECT SUM(aggr.ActualGenerationOutput) as count, aggr.Day, map.mapCodeText, area.AreaTypeCodeText
            FROM aggregatedgenerationpertype as aggr
            INNER JOIN areatypecode as area on aggr.AreaTypeCodeId = area.Id
            INNER JOIN mapcode as map on aggr.MapCodeId = map.Id
            INNER JOIN resolutioncode as res on aggr.ResolutionCodeId = res.Id
            INNER JOIN allocatedeicdetail as alocD on aggr.AreaCodeId = alocD.Id
            INNER JOIN productiontype as prod on aggr.ProductionTypeId = prod.Id
            WHERE aggr.Year = ? AND aggr.Month = ? AND alocD.LongNames = ? AND res.ResolutionCodeText = ? AND prod.ProductionTypeText = ?
            GROUP BY aggr.Day
            ORDER BY aggr.Day ASC;`,*/
            `SELECT SUM(aggr.ActualGenerationOutput) as count, aggr.Day, map.mapCodeText, area.AreaTypeCodeText
            FROM aggregatedgenerationpertype as aggr
            INNER JOIN areatypecode as area on aggr.AreaTypeCodeId = area.Id
            INNER JOIN mapcode as map on aggr.MapCodeId = map.Id
            INNER JOIN resolutioncode as res on aggr.ResolutionCodeId = res.Id
            INNER JOIN productiontype as prod on aggr.ProductionTypeId = prod.Id
            WHERE aggr.Year = ? AND aggr.Month = ? AND aggr.AreaName = ? AND res.ResolutionCodeText = ? AND prod.ProductionTypeText = ?
            GROUP BY aggr.Day
            ORDER BY aggr.Day ASC;`,

            [Year, Month, AreaName, Resolution,ProductionType], 
            (err, result) => {
                if (!err) {
                    if(result.length < 1) res.status(403).json({
                        message: "No data for the date or wrong input",
                        status: '403'
                    });
                    else {
                        var stack = [];
                        result.forEach(element => {
                            var jsonObj = {
                                Source: "entso-e",
                                Dataset: "AggregatedGenerationPerType",
                                AreaName: AreaName,
                                AreaTypeCode: element.AreaTypeCodeText,
                                MapCode: element.mapCodeText,
                                ResolutionCode: Resolution,
                                Year: Year,
                                Month: Month,
                                Day: element.Day,
                                ProductionType: ProductionType,
                                ActualGenerationOutputByDayValue: element.count,
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
}

exports.getYear = (req, res) => {
  if((/([12]\d{3})/.test(req.params.date_str)) == false){
        return res.status(400).json({
            message: "Bad request. Date should be in YYYY format",
            status: '400'
        });
    }
    let AreaName = req.params.AreaName;
    let ProductionType = req.params.ProductionType;
    let Resolution = req.params.Resolution; 
    let Year = req.params.date_str;
    if (ProductionType == 'AllTypes') {
        dbEnergy.query(
            /*`SELECT SUM(aggr.ActualGenerationOutput) as count, aggr.Month, prod.ProductionTypeText, map.mapCodeText, area.AreaTypeCodeText
            FROM aggregatedgenerationpertype as aggr
            INNER JOIN areatypecode as area on aggr.AreaTypeCodeId = area.Id
            INNER JOIN mapcode as map on aggr.MapCodeId = map.Id
            INNER JOIN resolutioncode as res on aggr.ResolutionCodeId = res.Id
            INNER JOIN allocatedeicdetail as alocD on aggr.AreaCodeId = alocD.Id
            INNER JOIN productiontype as prod on aggr.ProductionTypeId = prod.Id
            WHERE aggr.Year = ? AND alocD.LongNames = ? AND res.ResolutionCodeText = ?
            GROUP BY aggr.Month
            ORDER BY aggr.Month ASC;`,*/
            `SELECT SUM(aggr.ActualGenerationOutput) as count, aggr.Month, prod.ProductionTypeText, map.mapCodeText, area.AreaTypeCodeText
            FROM aggregatedgenerationpertype as aggr
            INNER JOIN areatypecode as area on aggr.AreaTypeCodeId = area.Id
            INNER JOIN mapcode as map on aggr.MapCodeId = map.Id
            INNER JOIN resolutioncode as res on aggr.ResolutionCodeId = res.Id
            INNER JOIN productiontype as prod on aggr.ProductionTypeId = prod.Id
            WHERE aggr.Year = ? AND aggr.AreaName = ? AND res.ResolutionCodeText = ?
            GROUP BY aggr.Month
            ORDER BY aggr.Month ASC;`,

            [Year, AreaName, Resolution], 
            (err, result) => {
                if (!err) {
                    if(result.length < 1) res.status(403).json({
                        message: "No data for the date or wrong input",
                        status: '403'
                    });
                    else {
                        var stack = [];
                        result.forEach(element => {
                            var jsonObj = {
                                Source: "entso-e",
                                Dataset: "AggregatedGenerationPerType",
                                AreaName: AreaName,
                                AreaTypeCode: element.AreaTypeCodeText,
                                MapCode: element.mapCodeText,
                                ResolutionCode: Resolution,
                                Year: Year,
                                Month: element.Month,
                                ProductionType: element.ProductionTypeText,
                                ActualGenerationOutputByMonthValue: element.count,
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
    else {
        dbEnergy.query(
           /* `SELECT SUM(aggr.ActualGenerationOutput) as count, aggr.Month, prod.ProductionTypeText, map.mapCodeText, area.AreaTypeCodeText
            FROM aggregatedgenerationpertype as aggr
            INNER JOIN areatypecode as area on aggr.AreaTypeCodeId = area.Id
            INNER JOIN mapcode as map on aggr.MapCodeId = map.Id
            INNER JOIN resolutioncode as res on aggr.ResolutionCodeId = res.Id
            INNER JOIN allocatedeicdetail as alocD on aggr.AreaCodeId = alocD.Id
            INNER JOIN productiontype as prod on aggr.ProductionTypeId = prod.Id
            WHERE aggr.Year = ? AND alocD.LongNames = ? AND res.ResolutionCodeText = ? AND prod.ProductionTypeText = ?
            GROUP BY aggr.Month
            ORDER BY aggr.Month ASC;`,*/
            `SELECT SUM(aggr.ActualGenerationOutput) as count, aggr.Month, prod.ProductionTypeText, map.mapCodeText, area.AreaTypeCodeText
            FROM aggregatedgenerationpertype as aggr
            INNER JOIN areatypecode as area on aggr.AreaTypeCodeId = area.Id
            INNER JOIN mapcode as map on aggr.MapCodeId = map.Id
            INNER JOIN resolutioncode as res on aggr.ResolutionCodeId = res.Id
            INNER JOIN productiontype as prod on aggr.ProductionTypeId = prod.Id
            WHERE aggr.Year = ? AND aggr.AreaName = ? AND res.ResolutionCodeText = ? AND prod.ProductionTypeText = ?
            GROUP BY aggr.Month
            ORDER BY aggr.Month ASC;`,
            [Year, AreaName, Resolution,ProductionType], 
            (err, result) => {
                if (!err) {
                    if(result.length < 1) res.status(403).json({
                        message: "No data for the date or wrong input",
                        status: '403'
                    });
                    else {
                        var stack = [];
                        result.forEach(element => {
                            var jsonObj = {
                                Source: "entso-e",
                                Dataset: "AggregatedGenerationPerType",
                                AreaName: AreaName,
                                AreaTypeCode: element.AreaTypeCodeText,
                                MapCode: element.mapCodeText,
                                ResolutionCode: Resolution,
                                Year: Year,
                                Month: element.Month,
                                ProductionType: ProductionType,
                                ActualGenerationOutputByMonthValue: element.count,
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
}