// -----------------------------------------------
// author: Suthicha Poonakaow
// date: 2018.01.05
// description: an interface shipment from mssql database.
// email: <isuthicha@gmail.com>
// -----------------------------------------------
var mssql = require('mssql')
var httpMsg = require('../core/httpMsg')
var statmentBuilder = require('../core/statmentBuilder')
var settings = require('../settings')


// -----------------------------------------------
// find shipment information from job control system.
// -----------------------------------------------
exports.findJobs = (req, resp, fromdate, todate, refno) => {
    try{
        // create sql command text.
        const commandText = statmentBuilder.getShipmentCommandText (fromdate, todate, refno)
        
        // init sqlconnection and executed.
        var conn = new mssql.Connection(settings.dbSysfConfig)
        conn.connect()
            .then(()=> {
                var cmd = new mssql.Request(conn)
                cmd.query(commandText)
                .then((data)=>{ httpMsg.sendJson(req, resp, data) })
                .catch((error) => { httpMsg.show404(req, resp) })
            })
            .catch((error)=> { throw new Error(error.message)})

    }
    catch (error) {
        httpMsg.show500(req, resp, error.message);
    }
}


