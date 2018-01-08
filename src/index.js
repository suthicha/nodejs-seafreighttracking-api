var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken')
var settings = require('./settings')
var httpMsg = require('./core/httpMsg')
var userCtrl  = require('./controllers/userController')
var authCtrl = require('./controllers/authenController')
var shipmentCtrl = require('./controllers/shipmentController')

app.set('secert', settings.secert);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false  }));
app.use(bodyParser.json());

// basic route (http://localhost:<port>)
app.get('/', function(req, resp) {
    resp.send('The API is at the http://localhost:' + settings.webPort + '/api');
});

var apiRoute = express.Router();

apiRoute.put('/register', function(req, resp) { 
    userCtrl.register(req, resp);
});

apiRoute.post('/authenticate', function(req, resp) {
    authCtrl.authenticate(req, resp);
});

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
// apiRoute.use(function(req, resp, next) {  
//     if (req.method == 'POST' && req.url == '/register') {
//       next();
//     }
//     else {
//       var token = req.body.token || req.param('token') || req.headers['x-access-token'];
//       if (token){
//         // verifies secret and checks exp
//         jwt.verify(token, app.get('secert'), function(err, decoded) {
//           if (err) {
//             return resp.json({ auth: { authenticated: false, message: 'Failed to authenticate token.'} });
//           } else {
//             // if everything is good, save to request for use in other routes
//             req.decoded = decoded;
//             next();
//           }
//         });
//       }
//       else {
//           return resp.status(403).send({
//             success: false,
//             message: 'No token provided.'
//           });
//       }
//     }
// });

// -----------------------------------------------
// Shipments
// -----------------------------------------------
apiRoute.get('/shipment/:fromdate/:todate/:refno', (req, resp) => {
  shipmentCtrl.getShipments(req, resp, req.params.fromdate, req.params.todate, req.params.refno)
})



apiRoute.get('/', function(req, resp) {
    httpMsg.showHome(req, resp);
});

app.use('/api', apiRoute);
app.listen(settings.webPort);
console.log('Service started at http://localhost:' + settings.webPort);
