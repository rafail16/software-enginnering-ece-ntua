const mysql = require('mysql');
const JsonParser = require('json2csv').Parser;
const fs = require('fs');

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
    //const ws = fs.createWriteStream('result.csv');
    if((/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(req.params.date_str)) == false){
        console.log('400');
        return res.status(400).json({
            message:"Bad request. Date should be in YYYY-MM-DD format",
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
    if(Month[0] == 0) Month = Month[1];

    dbEnergy.query(
      /*  `SELECT actual.TotalLoadValue, actual.UpdateTime, actual.DateTime, map.MapCodeText, area.AreaTypeCodeText
        FROM actualtotalload as actual
        INNER JOIN areatypecode as area on actual.AreaTypeCodeId = area.Id
        INNER JOIN mapcode as map on actual.MapCodeId = map.Id
        INNER JOIN resolutioncode as res on actual.ResolutionCodeId = res.Id
        INNER JOIN allocatedeicdetail as alocD on actual.AreaCodeId = alocD.Id
        WHERE actual.Year = ? AND actual.Month = ? AND actual.Day = ? AND alocD.LongNames = ? AND res.ResolutionCodeText = ?;`,*/
        `SELECT actual.TotalLoadValue, actual.UpdateTime, actual.DateTime, map.MapCodeText, area.AreaTypeCodeText
        FROM actualtotalload as actual
        INNER JOIN areatypecode as area on actual.AreaTypeCodeId = area.Id
        INNER JOIN mapcode as map on actual.MapCodeId = map.Id
        INNER JOIN resolutioncode as res on actual.ResolutionCodeId = res.Id
        WHERE actual.Year = ? AND actual.Month = ? AND actual.Day = ? AND actual.AreaName = ? AND res.ResolutionCodeText = ?
        ORDER BY actual.DateTime;`,
        
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
                            Dataset: "ActualTotalLoad",
                            AreaName: AreaName,
                            AreaTypeCode: element.AreaTypeCodeText,
                            MapCode: element.MapCodeText,
                            ResolutionCode: Resolution,
                            Year: Year,
                            Month: Month,
                            Day: Day,
                            DateTimeUTC: element.DateTime,
                            ActualTotalLoadValue: element.TotalLoadValue,
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
  if((/([12]\d{3}-(0[1-9]|1[0-2]))/.test(req.params.date_str)) == false){
        return res.status(400).json({
            message:"Bad request. Date should be in YYYY-MM format",
            status: '400'
        });
    }
    let AreaName = req.params.AreaName;
    let Resolution = req.params.Resolution; 
    let date_str = req.params.date_str.split("-");
    let Year = date_str[0];
    let Month = date_str[1];
    if(Month[0] == 0) Month = Month[1];
    dbEnergy.query(
       /* `SELECT SUM(actual.TotalLoadValue) as count, actual.Day, map.mapCodeText, area.AreaTypeCodeText
        FROM actualtotalload as actual
        INNER JOIN areatypecode as area on actual.AreaTypeCodeId = area.Id
        INNER JOIN mapcode as map on actual.MapCodeId = map.Id
        INNER JOIN resolutioncode as res on actual.ResolutionCodeId = res.Id
        INNER JOIN allocatedeicdetail as alocD on actual.AreaCodeId = alocD.Id
        WHERE actual.Year = ? AND actual.Month = ? AND alocD.LongNames = ? AND res.ResolutionCodeText = ?
        GROUP BY actual.Day
        ORDER BY actual.Day ASC;`,*/
        `SELECT SUM(actual.TotalLoadValue) as count, actual.Day, map.mapCodeText, area.AreaTypeCodeText
                FROM actualtotalload as actual
                INNER JOIN areatypecode as area on actual.AreaTypeCodeId = area.Id
                INNER JOIN mapcode as map on actual.MapCodeId = map.Id
                INNER JOIN resolutioncode as res on actual.ResolutionCodeId = res.Id
                WHERE actual.Year = ? AND actual.Month = ? AND actual.AreaName = ? AND res.ResolutionCodeText = ?
                GROUP BY actual.Day
                ORDER BY actual.Day ASC;`,

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
                            Dataset: "ActualTotalLoad",
                            AreaName: AreaName,
                            AreaTypeCode: element.AreaTypeCodeText,
                            MapCode: element.mapCodeText,
                            ResolutionCode: Resolution,
                            Year: Year,
                            Month: Month,
                            Day: element.Day,
                            ActualTotalLoadValue: element.count,
                        };
                        stack.push(jsonObj)
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
    if((/[12]\d{3}/.test(req.params.date_str)) == false){
        return res.status(400).json({
            message:"Bad request. Date should be in YYYY format" ,
            status: '400'
        });
    }
    let AreaName = req.params.AreaName;
    let Resolution = req.params.Resolution; 
    let Year = req.params.date_str;
    dbEnergy.query(
        /*`SELECT SUM(actual.TotalLoadValue) as count, actual.Month, map.mapCodeText, area.AreaTypeCodeText
        FROM actualtotalload as actual
        INNER JOIN areatypecode as area on actual.AreaTypeCodeId = area.Id
        INNER JOIN mapcode as map on actual.MapCodeId = map.Id
        INNER JOIN resolutioncode as res on actual.ResolutionCodeId = res.Id
        INNER JOIN allocatedeicdetail as alocD on actual.AreaCodeId = alocD.Id
        WHERE actual.Year = ? AND alocD.LongNames = ? AND res.ResolutionCodeText = ?
        GROUP BY actual.Month
        ORDER BY actual.Month ASC;`,*/
        `SELECT SUM(actual.TotalLoadValue) as count, actual.Month, map.mapCodeText, area.AreaTypeCodeText
                FROM actualtotalload as actual
                INNER JOIN areatypecode as area on actual.AreaTypeCodeId = area.Id
                INNER JOIN mapcode as map on actual.MapCodeId = map.Id
                INNER JOIN resolutioncode as res on actual.ResolutionCodeId = res.Id
                WHERE actual.Year = ? AND actual.AreaName = ? AND res.ResolutionCodeText = ?
                GROUP BY actual.Month
                ORDER BY actual.Month ASC;`,

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
                            Dataset: "ActualTotalLoad",
                            AreaName: AreaName,
                            AreaTypeCode: element.AreaTypeCodeText,
                            MapCode: element.mapCodeText,
                            ResolutionCode: Resolution,
                            Year: Year,
                            Month: element.Month,
                            ActualTotalLoadValue: element.count,
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