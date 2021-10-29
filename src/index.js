const config = require('./config.json');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
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
