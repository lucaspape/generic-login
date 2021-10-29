const mysql = require('mysql');
const { v4: uuidv4 } = require('uuid');

const DBNAME = 'userdb';

const mysqlConnection = mysql.createConnection({
    host: 'mariadb',
    user: 'root',
    password: 'password',
    database: DBNAME
  });

const CONFIG = require('./config.json');

function createTables(callback){
  let create_user_table_query = 'create table if not exists users (id varchar(64) NOT NULL PRIMARY KEY, username TEXT, password TEXT';

  CONFIG.required_fields.forEach((field) => {
    create_user_table_query += ', ' + field.name + ' ' + field.type;
  });

  create_user_table_query += ');';

  console.log('Creating table: ' + create_user_table_query);

  const CREATE_SESSION_TABLE = 'create table if not exists sessions (id varchar(64) NOT NULL PRIMARY KEY, userId varchar(64) NOT NULL);';

  mysqlConnection.query(create_user_table_query, (err, result) => {
    if(err){
      callback(err);
    }else{
      mysqlConnection.query(CREATE_SESSION_TABLE, (err, result) => {
        if(err){
          callback(err);
        }else{
          callback();
        }
      });
    }
  });
}

function getSession(sessionId, callback){
  const GET_SESSION_QUERY = 'select id,userId from `' + DBNAME + '`.`sessions` where id = ' + mysqlConnection.escape(sessionId) + ';';

  mysqlConnection.query(GET_SESSION_QUERY, (err, result) => {
    if(err){
      callback(err);
    }else{
      callback(undefined, result[0]);
    }
  });
}

function getUser(userId, withPassword, callback){
  let get_user_query = 'select id, username';

  if(withPassword){
    get_user_query += ', password';
  }

  CONFIG.required_fields.forEach((field) => {
    get_user_query += ', ' + field.name;
  });

  get_user_query += ' from `' + DBNAME + '`.`users` where id = ' + mysqlConnection.escape(userId) + ';';

  console.log(get_user_query);

  mysqlConnection.query(get_user_query, (err, result) => {
    if(err){
      callback(err);
    }else{
      callback(undefined, result[0]);
    }
  });
}

function checkUserObject(user){
  if(!user.username){
    return "No username";
  }else if(!user.password){
    return "No password";
  }else{
    CONFIG.required_fields.forEach((field) => {
      if(!user[field.name]){
        return "No " + field.name;
      }
    });
  }
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

  getRequiredFields: function(){
    let returnArray = [
      {
        name: 'username',
        display_name: 'Username',
        type: 'text'
      },
      {
        name: 'password',
        display_name: 'Password',
        type: 'password'
      }
    ];

    returnArray.push(...CONFIG.required_fields);

    return(returnArray);
  },

  register: function(user, callback){
    const userId = uuidv4().replaceAll('-', '');

    const error = checkUserObject(user);

    if(!error){
      let insert_user_query = 'insert into `' + DBNAME + '`.`users` (id, username, password';

      CONFIG.required_fields.forEach((field) => {
        insert_user_query += ', ' + field.name;
      });

      insert_user_query += ') values (' + mysqlConnection.escape(userId) + ', ' + mysqlConnection.escape(user.username) + ', ' + mysqlConnection.escape(user.password)

      CONFIG.required_fields.forEach((field) => {
        insert_user_query += ', ' + mysqlConnection.escape(user[field.name]);
      });

      insert_user_query += ');';

      console.log('Inserting user: ' + insert_user_query);

      mysqlConnection.query(insert_user_query, (err, result) => {
        if(err){
          callback(err);
        }else{
          callback(undefined);
        }
      });

    }else{
      callback(error);
    }
  },

  login: function(username, password, callback){
    const GET_USER_QUERY = 'select id, username, password from `' + DBNAME + '`.`users` where username = ' + mysqlConnection.escape(username);

    mysqlConnection.query(GET_USER_QUERY, (err, result) => {
      if(err){
        callback(err);
      }else{
        if(result[0]){
          if(result[0].password === password){
            const sessionId = uuidv4().replaceAll('-', '');

            const INSERT_SESSION_QUERY = 'insert into `' + DBNAME + '`.`sessions` (id, userId) values (' + mysqlConnection.escape(sessionId) + ', ' + mysqlConnection.escape(result[0].id) + ');';

            mysqlConnection.query(INSERT_SESSION_QUERY, (err, result) => {
              if(err){
                callback(err);
              }else{
                callback(undefined, { sessionId: sessionId });
              }
            });
          }else{
            callback(401);
          }
        }else{
          callback(401);
        }
      }
    });
  },

  checkLogin: function(sessionId, callback){
    getSession(sessionId, (err, result) => {
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
    getSession(sessionId, (err, result) => {
      if(err){
        callback(err);
      }else{
        if(result){
          getUser(result.userId, false, (err, result) => {
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
        }else{
          callback(401);
        }
      }
    });
  }
}
