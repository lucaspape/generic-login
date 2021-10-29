const config = require('./config.json');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const database = require('./database.js');

const PORT = 80;

database.connect((err) => {
  if(err){
    console.log(err);
  }else{
    const app = express();

    app.use(cors());
    app.use(cookieParser());
    app.use(bodyParser.json({limit: '1mb'}));
    app.use(bodyParser.urlencoded({
      extended: true,
      limit: '1mb'
    }));

    app.get('/', (req, res) => {
      database.login(json, (err, result) => {
        if(err){
          console.log(err);
          res.status(500).send("Internal server error");
        }else{
          res.cookie('session', result.sessionId, { maxAge: 900000, httpOnly: true, sameSite: 'strict' }).redirect(req.query.origin  + '&sessionId=' + result.sessionId);
        }
      });
    });

    app.post('/login', (req, res) => {
      const username = req.body.username;
      const password = req.body.password;

      database.login(username, password, (err, result) => {
        if(err){
          console.log(err);
          res.status(500).send("Internal server error");
        }else{
          res.cookie('session', result.sessionId, { maxAge: 900000, httpOnly: true, sameSite: 'strict' }).redirect(req.query.origin  + '&sessionId=' + result.sessionId);
        }
      });
    });

    app.post('/register', (req, res) => {
      const user = req.body;

      database.register(user, (err) => {
        if(err){
          console.log(err);
          res.status(500).send("Internal server error");
        }else{
          res.send('OK');
        }
      });
    });

    app.get('/user/:sessionId', (req, res) => {
      const sessionId = req.params.sessionId;

      if(sessionId){
        database.getUserDetails(sessionId, (err, result) => {
          if(err){
            if(err === 401){
              res.status(401).send("Unauthorized");
            }else{
              console.log(err);
              res.status(500).send("Internal server error");
            }
          }else{
            res.send(result);
          }
        });
      }else{
        res.status(400).send("Missing arguments");
      }
    });

    app.listen(PORT, () => {
      console.log('Server started on port ' + PORT);
    });
  }
})
