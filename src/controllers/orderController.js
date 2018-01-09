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
exports.execute = (req, resp, id) => {
    try{
        if(!id || !req.body) throw new Error('input not valid')
        
        // create sql command text.
        const order = Object.assign({}, req.body)

        // init sqlconnection and executed.
        var conn = new mssql.Connection(settings.dbSysfConfig)
        conn.connect()
            .then(()=> {
                var cmd = new mssql.Request(conn)
                cmd.input('MasterJobNo', order.MasterJobNo)
                .input('JobNo', order.JobNo)
                .input('TaxNo', order.TaxNo)
                .input('BranchNo', order.BranchNo)
                .input('BookingNo', order.BookingNo)
                .input('CustomerNo', order.CustomerNo)
                .input('CustomerName', order.CustomerName)
                .input('CarrierBookingNo', order.CarrierBookingNo)
                .input('OBL', order.OBL)
                .input('HBL', order.HBL)
                .input('DestCode', order.DestCode)
                .input('DestName', order.DestName)
                .input('DepartureDate', order.DepartureDate)
                .input('MotherVessel', order.MotherVessel)
                .input('FeederVessel', order.FeederVessel)
                .input('ArrivalDate', order.ArrivalDate)
                .input('ContainerNo', order.ContainerNo)
                .input('PortOfDischargeCode', order.PortOfDischargeCode)
                .input('PortOfDischargeName', order.PortOfDischargeName)
                .input('PortOfLoadingCode', order.PortOfLoadingCode)
                .input('PortOfLoadingName', order.PortOfLoadingName)
                .input('DeliveryDate', order.DeliveryDate)
                .input('UserID', order.UserID)
                .input('CreateDateTime', order.CreateDateTime)
                .input('UpdateBy', id)
                .input('UpdateDateTime', order.UpdateDateTime)
                .input('ShipmentStatus', order.ShipmentStatus)
                .input('Remark', order.Remark)
                .input('RefId', order.RefId)
                .input('TrxNo', order.TrxNo)
                .execute('sp_post_shipment')
                .then(()=>{ httpMsg.show200(req, resp) })
                .catch((error) => { httpMsg.show404(req, resp) })
            })
            .catch((error)=> { throw new Error(error.message)})

    }
    catch (error) {
        httpMsg.show500(req, resp, error.message);
    }
}

// -----------------------------------------------
// find order by condition.
// -----------------------------------------------
exports.findOrders = (req, resp, fromdate, todate) => {
    try{
        if(!fromdate || !todate) throw new Error('input not valid')

        var conn = new mssql.Connection(settings.dbConfig)
        conn.connect()
            .then(()=> {
                var cmd = new mssql.Request(conn)
                cmd.input('fromdate', fromdate)
                .input('todate', todate)
                .execute('sp_shipment_select')
                .then((data)=> { httpMsg.sendJson(req, resp, data)})
                .catch((error)=> { httpMsg.show404(req, resp)})
            })

    }catch (error) {
        httpMsg.show500(req, resp, error);
    }
}

// -----------------------------------------------
// find order by etd.
// -----------------------------------------------
exports.findOrderByEtd = (req, resp, etd) => {
    try{
        if (!etd) throw new Error('input not valid')
        
        var conn = new mssql.Connection(settings.dbConfig)
        conn.connect()
            .then(()=> {
                var cmd = new mssql.Request(conn)
                cmd.input('etd', etd)
                .execute('sp_order_select_etd')
                .then((data)=> { httpMsg.sendJson(req, resp, data) })
                .catch((error)=> { httpMsg.show404(req, resp) })
            })

    }catch (error) {
        httpMsg.show500(req, resp, error)
    }
}
