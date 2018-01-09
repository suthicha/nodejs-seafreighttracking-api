// -----------------------------------------------
// author: Suthicha Poonakaow
// date: 08.01.2018 
// description: user authentication
// email: <isuthicha@gmail.com>
// -----------------------------------------------

var jwt = require('jsonwebtoken');
var mssql = require('mssql');
var httpMsg = require('../core/httpMsg');
var settings = require('../settings');


// -----------------------------------------------
// login process.
// -----------------------------------------------
exports.login = (req, resp) => {
    try {
        if (!req.body) throw new Error("input not valid.")    

        const { LoginName, Password } = req.body

        var conn = new mssql.Connection(settings.dbConfig)
            conn.connect()
            .then(()=> {
                var cmd = new mssql.Request(conn)
                cmd.input('LoginName', LoginName)
                .input('Password', Password)
                .execute("sp_auth_user")
                .then((data) => {
                    var userInfo = data[0][0];
                    var encodeTokenString = '';
                    var isAuthenticate = false;

                    // check user logged is true.
                    if (userInfo.LoggedStatus == 200) {
                        isAuthenticate = true;

                        // create token with jwt.
                        encodeTokenString = jwt.sign(
                            {
                             LoginName: LoginName,
                             UserID: userInfo.UserID,
                             UserGroupID: 1
                            }, 
                            settings.secert, 
                            { 
                                expiresIn: 86400
                            }
                        )    
                    }
                    
                    // response json message.
                    httpMsg.sendJson(req, resp, 
                        {
                            auth:{
                                authenticate: isAuthenticate,
                                status: userInfo.LoggedStatus,
                                token: encodeTokenString
                            },
                            user: userInfo
                        }
                    )
                })
            })
     
    } catch (error) {
        httpMsg.show500(req, resp, error.message);
    }
}
