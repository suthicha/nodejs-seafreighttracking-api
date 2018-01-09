// -----------------------------------------------
// author: Suthicha Poonakaow
// date: 2018.01.09
// description: an interface shipment from mssql database.
// email: <isuthicha@gmail.com>
// -----------------------------------------------
var mssql = require('mssql')
var httpMsg = require('../core/httpMsg')
var settings = require('../settings')

// -----------------------------------------------
// add new company
// -----------------------------------------------
exports.add = (req, resp, id) => {
    try{
        if (!id) throw new Error('input not valid')

        const { CmpTaxNo, CmpBranch, CmpName, UserID } = req.body

        var conn = new mssql.Connection(settings.dbConfig)
            conn.connect()
            .then(()=>{
                var cmd = new mssql.Request(conn)
                cmd.input('CmpTaxNo', CmpTaxNo)
                .input('CmpBranch', CmpBranch)
                .input('CmpName', CmpName)
                .input('UserID', UserID)
                .execute('sp_insert_company')
                .then(()=>{ httpMsg.show200(req, resp) })
                .catch((error)=>{ throw new Error(error.message) })
            })

    }catch(error){
        httpMsg.show500(req, resp, error)
    }
}


// -----------------------------------------------
// update a company
// -----------------------------------------------
exports.update = (req, resp, id) => {
    try{
        if(!id) throw new Error('input not valid')

        const { CmpID, CmpTaxNo, CmpBranch, CmpName, UserID } = req.body

        var conn = new mssql.Connection(settings.dbConfig)
            conn.connect()
            .then(()=> {
                var cmd = new mssql.Request(conn)
                cmd.input('CmpID', CmpID)
                .input('CmpName', CmpName)
                .input('CmpTaxNo', CmpTaxNo)
                .input('CmpBranch', CmpBranch)
                .input('UserID', UserID)
                .execute('sp_update_company')
                .then(()=>{ httpMsg.show200(req, resp) })
                .catch((error)=>{ throw new Error(error.message) })
            })
    }catch(error){
        httpMsg.show500(req, resp, error)
    }
}

// -----------------------------------------------
// delete a company
// -----------------------------------------------
exports.delete = (req, resp, id) => {
    try{
        if (!id) throw new Error('input not valid')

        const { CmpID } = req.body

        var conn = new mssql.Connection(settings.dbConfig)
            conn.connect()
            .then(()=> {
                var cmd = new mssql.Request(conn)
                cmd.input('CmpID', CmpID)
                .input('UserID', id)
                .execute('sp_delete_company')
                .then(()=>{ httpMsg.show200(req, resp) })
                .catch((error)=> { throw new Error(error.message) })
            })

    }catch(error){
        httpMsg.show500(req, resp, error)
    }
}

// -----------------------------------------------
// get companies
// -----------------------------------------------
exports.getCompanies = (req, resp, id) => {
    try{
        if(!id) throw new Error('input not valid')
        
        var conn = new mssql.Connection(settings.dbConfig)
            conn.connect()
            .then(()=>{
                var cmd = new mssql.Request(conn)
                cmd.input('UserID', id)
                .execute('sp_select_company')
                .then((data)=> { httpMsg.sendJson(req, resp, data)})
                .catch((error)=> { throw new Error(error.message)})
            })

    }catch(error){
        httpMsg.show500(req, resp, error)
    }
}