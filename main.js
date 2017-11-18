// * ———————————————————————————————————————-——-——————————————— * //
// *  Rest API for monitoring Urls, author: landsmanv@gmail.com
// * ————————————————————————————————————————--———————————————— * //

const restify = require('restify');
const errors = require('restify-errors');
const mysql = require('mysql');
const request = require('request');
const validUrl = require('valid-url');
const config = require('./config');
var con = config.db.get; // get mysql connection
var intervalId = {}; // array of monitoring tasks, position correspond to MonitoredEndpoint.Id

// import default empty tables from file to mysql + insert two Users
config.db.importCon;
config.db.importSql.then( () => {
  // after sql promise, start loading monitoring tasks
  startMonitoring()
})

// configure server
const server = restify.createServer({
  name: config.name,
  version: config.version,
  handleUncaughtExceptions: true
});

// load some server plugins
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.authorizationParser());

server.use(function (req, res, next) {
  // check some input params, and raise error if problem found
  if (req.body.monitoredInterval && req.body.monitoredInterval < 1) {
    return next(new errors.InvalidArgumentError("monitoredInterval (" + req.body.monitoredInterval + ") have to be grater than 0"));
  }
  if (req.body.Url && !validUrl.isUri(req.body.Url)) {
    return next(new errors.InvalidArgumentError("Url (" + req.body.Url + ") is not valid URI"));
  }
  if (req.body.monitoredInterval && isNaN(req.body.monitoredInterval)) {
    return next(new errors.InvalidArgumentError("MonitoredInterval (" + req.body.monitoredInterval + ") is not number"));
  }
  if (req.body.Id && isNaN(req.body.Id)) {
    return next(new errors.InvalidArgumentError("Id (" + req.body.Id + ") is not number"));
  }
  if (req.params.Id && isNaN(req.params.Id)) {
    return next(new errors.InvalidArgumentError("Id (" + req.params.Id + ") is not number"));
  }
  // simply check if user exists in table and have valid credentials in auth. header
  con.query('select * from User where `Name`=? and `AccessToken`=?', [req.username, req.authorization.credentials], function (error, results, fields) {
    if (error) throw error
    if (results.length > 0) { 
      next();
    } else {
      return next(new errors.UnauthorizedError(req.username));
    }
  });
});

// lets start server
server.listen(config.port, function () {
  console.log('%s listening at %s', server.name, server.url);
});

// rest api to get all monitoredEndpoint for User (req.username is simply matched from authorization header)
server.get('/monitoredEndpoint', function (req, res) {
  con.query('select * from MonitoredEndpoint where `User`=?', [req.username], function (error, results, fields) {
    if (error) throw error;
      res.end(JSON.stringify(results));
  });
});

// rest api to push new monitoredEndpoint
server.post('/monitoredEndpoint', function (req, res, next) {
  req.body.User = req.username;
  if (!req.body.Url || !req.body.monitoredInterval || !req.body.Name) {
    return next(new errors.InvalidArgumentError("Missing some input params"));
  }
  con.query('insert into MonitoredEndpoint set ?', req.body, function (error, results, fields) {
    if (error) throw error;
    // create new periodic task for given Url
    planTask(req.body.Url, results.insertId, req.body.monitoredInterval);
    res.end(JSON.stringify(results));
  });
});

// rest api to update one monitoredEndpoint Id
server.put('/monitoredEndpoint', function (req, res, next) {
  if (!req.body.Url || !req.body.monitoredInterval || !req.body.Name) {
    return next(new errors.InvalidArgumentError("Missing some input params"));
  }
  con.query('update `MonitoredEndpoint` set `Name`=?, `Url`=?, `monitoredInterval`=? where `Id`=? and `User`=?', [req.body.Name, req.body.Url, req.body.monitoredInterval, req.body.Id, req.username], function (error, results, fields) {
    if (error) throw error;
    if (results.affectedRows == 1) {
      // something changed, so renew periodic task
      clearInterval(intervalId[req.body.Id]);
      planTask(req.body.Url, req.body.Id, req.body.monitoredInterval);
    }
    res.end(JSON.stringify(results));
  });
});

// rest api to delete one monitoredEndpoint with given Id
server.del('/monitoredEndpoint/:Id', function (req, res) {
  con.query('delete from `MonitoredEndpoint` where `Id`=? and `User`=?', [req.params.Id, req.username], function (error, results, fields) {
    if (error) throw error;
    if (results.affectedRows == 1) {
      // stop periodic checking task
      clearInterval(intervalId[req.params.Id]);
    }
    res.end(JSON.stringify(results));
  });
});

// rest api to get last 10 monitoringResult for User with given Id
server.get('/monitoringResult/:monitoredEndpointId', function (req, res) {
  con.query('select * from MonitoringResult join MonitoredEndpoint on MonitoringResult.monitoredEndpointId=MonitoredEndpoint.Id where `monitoredEndpointId`=? and `User`=? limit 10' , [req.params.monitoredEndpointId, req.username], function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

// create periodic task for given Url
planTask = function(Url, Id, monitoredInterval) {
  intervalId[Id] = setInterval( () => { openRequest(Url, Id); }, monitoredInterval * 1000, Url, Id);
}

// get status and payload of given Url
openRequest = function(Url, Id) {
  request(Url, function (error, response, body) {
    if (error) throw error;
    // write results to MonitoringResult table
    con.query('insert into MonitoringResult set `http_status`=?, `payload`=?, `monitoredEndpointId`=?, `Url`=?', [response.statusCode, body, Id, Url], function (error, results) {
      if (error) throw error;
      // update last checked time of Url in MonitoredEndpoint table
      con.query('update MonitoredEndpoint set Checked_on = now() where `Id`=?', [Id], function (error, results) {
        if (error) throw error;
      });
    });
  });
}

// get all Records from MonitoredEndpoint and plan periodic checking (triggered once app started)
startMonitoring = function() {
  con.query('select * from MonitoredEndpoint', function (error, results, fields) {
    if (error) throw error;
    for(var i = 0; i < results.length; i++) {
      planTask(results[i].Url, results[i].Id, results[i].monitoredInterval);
    }
  });
}