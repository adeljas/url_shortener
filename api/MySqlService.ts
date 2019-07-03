import { connect } from "tls";
import Hashids from 'hashids';

const mysql = require('mysql');

class MySqlService {

  private con = null;
  private hashids: Hashids = null;

  // @todo, move to a queries constants file & use palceholder for table name
  private sqlInsert: string = `INSERT INTO short_url_map (source_url, user_agent, remote_ip) VALUES ?`; 
  private sqlUpdateToken: string = `UPDATE short_url_map SET token = ? WHERE id = ?`;
  private sqlQueryToken: string = `SELECT source_url from short_url_map WHERE token = ?`;
  private sqlQueryURL: string = `SELECT token from short_url_map WHERE source_url = ?`;
  // normally date formatting should be done in the frontend, at this stage im doing it this way to keep things simpler ( no moment.js )
  private sqlQueryLatest: string = `SELECT DATE_FORMAT(created_at, "%W %D %M %Y %H:%i") as created_at, token, source_url, user_agent FROM short_url_map ORDER BY created_at DESC LIMIT ?`;

  constructor(MySqlConfig){

    this.con = mysql.createConnection({
      host: MySqlConfig.hostname,
      user: MySqlConfig.username,
      password: MySqlConfig.password,
      database: MySqlConfig.dbname
    });

    this.hashids = new Hashids('UrlShortener');
  }

  // check if a given url has a token generated already, so we won't generate another one
  checkUrlHasToken(source_url: string) {
    const sqlQueryURL = this.sqlQueryURL;
    const connection = this.con;

    const promise = new Promise(function(resolve, reject){
      connection.query(sqlQueryURL, [source_url], function (err, result) {
        if (err) throw err;
        
        if (!result[0]) {
          reject(true);
        } else {
          resolve(result[0].token);
        }
      });
    });

    return promise;  }

  // adds new url and generates a token for it
  addUrl(source_url: string, user_agent: string, remote_ip: string) {
    const connection = this.con;
    const sqlInsert = this.sqlInsert;
    const sqlUpdateToken = this.sqlUpdateToken;
    const hashids = this.hashids;

    const values = [[source_url, user_agent, remote_ip]];
    
    const promise = new Promise(function(resolve, reject){
        connection.query(sqlInsert, [values], function (err, result) {
          if (err) throw err;
          const insertId = result['insertId'];
          const token = hashids.encode(insertId);
          connection.query(sqlUpdateToken, [token, insertId], function (err, result) {
            if (err) throw err;
            resolve(token);
          });
        });
    });

    return promise;
  }


  // retrieves a url by a token
  retrieveUrlFromToken(token: string = '') {
    const sqlQueryToken = this.sqlQueryToken;
    const connection = this.con;

    const promise = new Promise(function(resolve, reject){
      connection.query(sqlQueryToken, [token], function (err, result) {
        if (err) throw err;
        
        if (!result[0]) {
          reject('unable to find token');
        } else {
          resolve(result[0].source_url);
        }
      });
    });

    return promise;
  }

  // for showing the table on the homepage, latest entries
  retrieveLatestInsertions(count: number = 20) {
    const sqlQueryLatest = this.sqlQueryLatest;
    const connection = this.con;

    const promise = new Promise(function(resolve, reject){
      connection.query(sqlQueryLatest, [count], function (err, result) {
        if (err) throw err;
        
        if (!result[0]) {
          reject('unable to find any records');
        } else {
          resolve(result);
        }
      });
    });

    return promise;
  }

}

export default MySqlService;