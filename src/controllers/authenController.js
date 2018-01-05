var jwt = require('jsonwebtoken');
var mssql = require('mssql');
var httpMsg = require('../core/httpMsg');
var settings = require('../settings');

exports.authenticate = function(req, resp) {
    if (!req.body) throw new Error("Input not valid");    
    try{
      var objUser = req.body;
      if(objUser){
          var conn = new mssql.Connection(settings.dbConfig);
          conn.connect()
            .then(function() {
                var request = new mssql.Request(conn);
                request.input('LoginName', objUser.LoginName)
                .input('Password', objUser.Password)
                .execute("sp_auth_user")
                .then(function(data) {
                    var userInfo = data[0][0];
                    var encodeTokenString = '';
                    var isAuthenticate = false;

                    if (userInfo.LoggedStatus == 200) {
                        isAuthenticate = true;
                        encodeTokenString = jwt.sign({
                            LoginName: objUser.LoginName,
                            UserID: userInfo.UserID,
                            UserGroupID: 1
                        }, settings.secert, { expiresIn: 86400});    
                    }
                    
                    httpMsg.sendJson(req, resp, {
                        auth:{
                            authenticate: isAuthenticate,
                            status: userInfo.LoggedStatus,
                            token: encodeTokenString
                        },
                        user: userInfo
                    });
                })
                .catch(function(error) { 
                    httpMsg.show500(req, resp, error);
                })
            });
      }
      else {
          // throw new Error("Input not valid");

      }
  }catch (ex) {
      httpMsg.show500(req, resp, ex);
  }
};
