import MySqlService from './MySqlService';
import MySqlConfig from './MySqlConfig';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 4000;

const mySqlInstance = new MySqlService(MySqlConfig);

app.use(bodyParser());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/api/shorten', (req, res) => {
    const userAgent = req.headers['user-agent'];
    const url = req.body.url;
    
    mySqlInstance.checkUrlHasToken(url).then((existingToken)=>{
        res.send({tokenUri: existingToken});
    }).catch((token)=>{
        mySqlInstance.addUrl(url, userAgent, '1.1.1.1').then((generatedToken) => {
            res.send({tokenUri: generatedToken});
        });
    });

});

app.get('/api/fetch-url', (req, res) => {
    mySqlInstance.retrieveUrlFromToken(req.query.token).then((data)=>{
        res.send({url: data});
    }).catch(()=>{
        res.send({url: 'unable to find token, please check your shortened URL'}, 404);
    });
});

app.get('/api/latest-entries', (req, res) => {
    mySqlInstance.retrieveLatestInsertions().then((data)=>{
        res.send({latestEntries: data});
    }).catch(()=>{
        res.send({url: 'unable to find any records'}, 404);
    });
});

app.listen(port, () => console.log(`Link Shortener API listening on port ${port}!`));