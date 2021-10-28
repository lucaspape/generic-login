const mysql = require('mysql');
const { v4: uuidv4 } = require('uuid');

const DBNAME = 'userdb';

const mysqlConnection = mysql.createConnection({
    host: 'mariadb',
    user: 'root',
    password: 'password',
    database: DBNAME
  });

function createTables(callback){
  const CREATE_USER_TABLE = 'create table if not exists users (id varchar(64) NOT NULL PRIMARY KEY, username TEXT, personId TEXT, email TEXT, firstName TEXT, lastName TEXT);';

  mysqlConnection.query(CREATE_USER_TABLE, (err, result) => {
    if(err){
      callback(err);
    }else{
      callback();
    }
  });
}

function getUser(sessionId, callback){
  const GET_USER_QUERY = 'select id,username,personId,email,firstName,lastName from `' + DBNAME + '`.`users` where id = ' + mysqlConnection.escape(sessionId) + ';';

  mysqlConnection.query(GET_USER_QUERY, (err, result) => {
    if(err){
      callback(err);
    }else{
      callback(undefined, result[0]);
    }
  });
}

module.exports = {
  connect: function(callback){
    mysqlConnection.connect((err) => {
      if(err){
        callback(err);
      }else{
        createTables(callback);
      }
    });
  },

  register: function(username, password, personId, email, firstName, lastName, callback){
    const sessionId = uuidv4().replaceAll('-', '');

    const INSERT_USER_QUERY = 'insert into `' + DBNAME + '`.`users` (id, username, email, firstName, lastName) values (' + mysqlConnection.escape(sessionId) + ', ' + mysqlConnection.escape(username) + ', ' + mysqlConnection.escape(personId) + ', ' + mysqlConnection.escape(email) + ', ' + mysqlConnection.escape(firstName) + ', ' + mysqlConnection.escape(lastName) + ');';

    mysqlConnection.query(INSERT_USER_QUERY, (err, result) => {
      if(err){
        callback(err);
      }else{
        callback(undefined, { "sessionId": sessionId });
      }
    });
  },

  login: function(user, callback){

  },

  checkLogin: function(sessionId, callback){
    getUser(sessionId, (err, result) => {
      if(err){
        callback(err);
      }else{
        if(result){
          callback(undefined, { "success": true });
        }else{
          //user not found
          callback(undefined, { "success": false });
        }
      }
    });
  },

  getUserDetails: function(sessionId, callback){
    getUser(sessionId, (err, result) => {
      if(err){
        callback(err);
      }else{
        if(result){
          callback(undefined, result);
        }else{
          callback(401);
        }
      }
    });
  }
}
