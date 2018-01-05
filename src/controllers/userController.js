var jwt = require('jsonwebtoken')
var mssql = require('mssql')
var httpMsg = require('../core/httpMsg')
var settings = require('../settings')

exports.register = function(req, resp) {
    
    if(!req.body) throw new Error('Input not valid');
    try {
        var objUser = req.body;
        var conn = new mssql.Connection(settings.dbConfig);
        conn.connect()
            .then(function() {
                var request = new mssql.Request(conn);
                request.input('LoginName', objUser.LoginName)
                .input('Password', objUser.Password)
                .input('FirstName', objUser.FirstName)
                .input('LastName', objUser.LastName)
                .input('Email', objUser.Email)
                .input('PhoneNO', objUser.PhoneNO)
                .execute('sp_insert_user')
                .then(function() {
                    httpMsg.show200(req, resp);
                })
                .catch(function(error) { 
                    httpMsg.show500(req, resp, error);
                })
            });
    }catch(err){
        httpMsg.show500(req, resp, err);
    }
};

exports.update = function(req, resp, id) {
    if(!id) throw new Error("Input not valid");
    try {
        var objUser = req.body;
        var conn = new mssql.Connection(settings.dbConfig);
        conn.connect()
            .then(function() {
                var request = new mssql.Request(conn);
                request.input('UserID', id)
                .input('LoginName', objUser.LoginName)
                .input('FirstName', objUser.FirstName)
                .input('LastName', objUser.LastName)
                .input('Email', objUser.Email)
                .input('PhoneNO', objUser.PhoneNO)
                .input('UserGroupID', objUser.UserGroupID)
                .execute('sp_update_user')
                .then(function() {
                    httpMsg.show200(req, resp);
                })
                .catch(function(error) {
                    httpMsg.show500(req, resp, error);
                })
            });
    }catch(error) {
        httpMsg.show500(req, resp, error);
    }
};

exports.resetPassword = function(req, resp) {
    if (!req.body) throw new Error('Input not valid');
    try {
        var objUser = req.body;
        var conn = new mssql.Connection(settings.dbConfig);
        conn.connect()
            .then(function() {
                var request = new mssql.Request(conn);
                request.input('UserID', objUser.UserID)
                .input('LoginName', objUser.LoginName)
                .input('NewPassword', objUser.Password)
                .execute('sp_reset_password')
                .then(function() {
                    httpMsg.show200(req, resp);
                })
                .catch(function(error) {
                    httpMsg.show500(req, resp, error);
                })
            });
    }catch(error) {
        httpMsg.show500(req, resp, error);
    }
};

exports.getList = function(req, resp, id) {
    if (!id) throw new Error('Input not valid');
    try {
        var conn = new mssql.Connection(settings.dbConfig);
        conn.connect()
            .then(function() {
                var request = new mssql.Request(conn);
                request.input("UserID", id)
                .execute('sp_select_users')
                .then(function(data) {
                    httpMsg.sendJson(req, resp, data[0]);
                })
                .catch(function(error) {
                    httpMsg.show500(req, resp, error);
                })
            });
    }catch(error){
        httpMsg.show500(req, resp, error);
    }
};