var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken')
var settings = require('./settings')
var httpMsg = require('./core/httpMsg')
var authController = require('./controllers/authController')
var userController  = require('./controllers/userController')
var jobController = require('./controllers/jobController')
var orderController = require('./controllers/orderController')
var companyController = require('./controllers/companyController')
var app = express()

app.set('secert', settings.secert)
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false  }))
app.use(bodyParser.json())

// -----------------------------------------------
// show web api port.
// -----------------------------------------------
app.get('/', function(req, resp) {
    resp.send('The API is at the http://localhost:' + settings.webPort + '/api')
});

var router = express.Router()

router.put('/register', function(req, resp) { 
    userController.register(req, resp)
});

router.post('/login', function(req, resp) {
    authController.login(req, resp)
});

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
router.use((req, resp, next) => {  
    if (req.method == 'POST' && req.url == '/register') {
      next();
    }
    else {
      var token = req.body.token || req.param('token') || req.headers['x-access-token'];
      if (token){
        // verifies secret and checks exp
        jwt.verify(token, app.get('secert'), function(err, decoded) {
          if (err) {
            return resp.json({ auth: { authenticated: false, message: 'Failed to authenticate token.'} });
          } else {
            // if everything is good, save to request for use in other routes
            req.decoded = decoded;
            next();
          }
        });
      }
      else {
          return resp.status(403).send({
            success: false,
            message: 'No token provided.'
          });
      }
    }
})


// -----------------------------------------------
// User controller.
// -----------------------------------------------
router.get('/users/:id', (req, resp) => {
    const { id } = req.params
    userController.getAll(
        req, 
        resp, 
        id,
    )
})

router.post('/user/:id', (req, resp) => { 
    const { id } = req.params
    userController.update(
        req, 
        resp, 
        id,
    )
})

router.post('/user/recoverpassword', (req, resp) => {
    userController.resetPassword(
        req,
        resp,
    )
})

router.delete('/user/:id', (req, resp) => {
    const { id } = req.params
    userController.delete(
        req,
        resp,
        id,
    )
})

// -----------------------------------------------
// company routes.
// -----------------------------------------------
router.get('/company/:id', (req, resp) => {
    const { id } = req.params
    companyController.getCompanies(
        req,
        resp,
        id,
    )
})

router.put('/company/:id', (req, resp) => {
    const { id } = req.params
    companyController.add(
        req,
        resp,
        id,
    )
})

router.post('/company/:id', (req, resp) => {
    const { id } = req.params
    companyController.update(
        req,
        resp,
        id,
    )
})

router.delete('/company/:id', (req, resp) => {
    const { id } = req.params
    companyController.delete(
        req,
        resp,
        id,
    )
})


// -----------------------------------------------
// job shipment routes.
// -----------------------------------------------
router.get('/jobs/:etd', (req, resp) => {
    const { etd } = req.params
    jobController.findJobs(
      req, 
      resp, 
      etd,
    )
})

router.get('/booking/:refno', (req, resp) => {
    const { refno } = req.params
    jobController.findBooking(
      req, 
      resp, 
      refno,
    )
})



// -----------------------------------------------
// order routes.
// -----------------------------------------------
router.get('/orders/:etd', (req, resp) => {
    const { etd } = req.params
    orderController.findOrderByEtd(
        req, 
        resp, 
        etd,
    )
})

router.get('/orders/:fromdate/:todate', (req, resp) => {
    const { fromdate, todate } = req.params
    orderController.findOrders(
        req, 
        resp, 
        fromdate, 
        todate,
    )
})

router.put('/order/:id', (req, resp) => {
    const { id } = req.params
    orderController.execute(
        req,
        resp,
        id,
    )
})


router.get('/', (req, resp) => {
    httpMsg.showHome(req, resp);
});

app.use('/api', router);
app.listen(settings.webPort);
console.log('Service started at http://localhost:' + settings.webPort);
