var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken')
var settings = require('./settings')
var httpMsg = require('./core/httpMsg')
var authController = require('./controllers/authController')
var userController  = require('./controllers/userController')
var jobController = require('./controllers/jobController')
var orderController = require('./controllers/orderController')

app.set('secert', settings.secert)
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false  }))
app.use(bodyParser.json())

// basic route (http://localhost:<port>)
app.get('/', function(req, resp) {
    resp.send('The API is at the http://localhost:' + settings.webPort + '/api');
});

var router = express.Router();

router.put('/register', function(req, resp) { 
    userController.register(req, resp)
});

router.post('/authenticate', function(req, resp) {
    authController.login(req, resp)
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
// User controller.
// -----------------------------------------------
router.post('/user/:id', (req, resp) => { 
    const { id } = req.params
    userController.update(req, resp, id)
})


router.delete('/user/:id', (req, resp) => {
    const { id } = req.params
})


// -----------------------------------------------
// Job and shipment routes.
// -----------------------------------------------
router.get('/jobs/:fromdate/:todate/:refno', (req, resp) => {
    const { fromdate, todate, refno } = req.params
    jobController.findJobs(
      req, 
      resp, 
      fromdate, 
      todate, 
      refno,
    )
})


// -----------------------------------------------
// order routes.
// -----------------------------------------------
router.get('/orders/:etd', (req, resp) => {
    const { etd } = req.params
    orderController.findOrdersByEtd(req, resp, etd)
})

router.get('/orders/:fromdate/:todate', (req, resp) => {
    const { fromdate, todate } = req.params
    orderController.findOrders(req, resp, fromdate, todate)
})


router.get('/', function(req, resp) {
    httpMsg.showHome(req, resp);
});

app.use('/api', router);
app.listen(settings.webPort);
console.log('Service started at http://localhost:' + settings.webPort);
