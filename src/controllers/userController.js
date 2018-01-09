// -----------------------------------------------
// author: Suthicha Poonakaow
// date: 08.01.2018
// description: user controller.
// email: <isuthicha@gmail.com>
// -----------------------------------------------

var mssql = require('mssql')
var httpMsg = require('../core/httpMsg')
var settings = require('../settings')


// -----------------------------------------------
// register a new user.
// -----------------------------------------------
exports.register = (req, resp) => {
    try {
        if(!req.body) throw new Error('Input not valid');
        
        const { LoginName, Password, FirstName, LastName, Email, PhoneNO } = req.body;
        var conn = new mssql.Connection(settings.dbConfig);
        conn.connect()
            .then(()=> {
                var cmd = new mssql.Request(conn);
                cmd.input('LoginName', LoginName)
                .input('Password', Password)
                .input('FirstName', FirstName)
                .input('LastName', LastName)
                .input('Email', Email)
                .input('PhoneNO', PhoneNO)
                .execute('sp_insert_user')
                .then(()=>{httpMsg.show200(req, resp)})
                .catch((error)=>{httpMsg.show500(req, resp, error)})
            }
        )

    }catch(err){
        httpMsg.show500(req, resp, err);
    }
};


// -----------------------------------------------
// update user information.
// -----------------------------------------------
exports.update = (req, resp, id) => {
    try {
        if(!id) throw new Error("Input not valid");
        
        const { LoginName, FirstName, LastName, Email, PhoneNO, UserGroupID } = req.body;
        var conn = new mssql.Connection(settings.dbConfig);
        conn.connect()
            .then(()=> {
                var cmd = new mssql.Request(conn);
                cmd.input('UserID', id)
                .input('LoginName', LoginName)
                .input('FirstName', FirstName)
                .input('LastName', LastName)
                .input('Email', Email)
                .input('PhoneNO', PhoneNO)
                .input('UserGroupID', UserGroupID)
                .execute('sp_update_user')
                .then(()=>{httpMsg.show200(req, resp)})
                .catch((error)=>{httpMsg.show500(req, resp, error)})
            }
        )
    }catch(error) {
        httpMsg.show500(req, resp, error);
    }
};


// -----------------------------------------------
// delete user
// -----------------------------------------------
exports.delete = (req, resp, id) => {
    try {
        
        if(!id) throw new Error("Input not valid");
        var conn = new mssql.Connection(settings.dbConfig)
        conn.connect()
            .then(()=>{
                var cmd = new mssql.Request(conn)
                cmd.input('UserID', id)
                .execute('sp_delete_user')
                .then(()=>{ httpMsg.show200(req, resp)})
                .catch((error)=>{ httpMsg.show500(req, resp, error)})
            }
        )

    }catch (error) {
        httpMsg.show500(req, resp, error)
    }
}


// -----------------------------------------------
// reset user password.
// -----------------------------------------------
exports.resetPassword = (req, resp) => {
    try {
        if (!req.body) throw new Error('Input not valid');
        
        const { UserID, LoginName, Password } = req.body;
        var conn = new mssql.Connection(settings.dbConfig);
        conn.connect()
            .then(()=>{
                var cmd = new mssql.Request(conn);
                cmd.input('UserID', UserID)
                .input('LoginName', LoginName)
                .input('NewPassword', Password)
                .execute('sp_reset_password')
                .then(()=>{ httpMsg.show200(req, resp) })
                .catch((error)=>{ httpMsg.show500(req, resp, error)})
            }
        )
    }catch(error) {
        httpMsg.show500(req, resp, error);
    }
};


// -----------------------------------------------
// retrive all user.
// -----------------------------------------------
exports.getAll = (req, resp, id) => {
    try {
        if (!id) throw new Error('Input not valid');
        
        var conn = new mssql.Connection(settings.dbConfig);
        conn.connect()
            .then(()=> {
                var cmd = new mssql.Request(conn);
                cmd.input("UserID", id)
                .execute('sp_select_users')
                .then((data)=>{ httpMsg.sendJson(req, resp, data[0])})
                .catch((error)=>{ httpMsg.show500(req, resp, error)})
            }
        )
    }catch(error){
        httpMsg.show500(req, resp, error);
    }
};