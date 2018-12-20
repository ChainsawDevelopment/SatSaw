const express = require('express')
const request = require('request')

const app = express()
const port = (+(process.argv[2])) || 3000
const allowAllOrigins = (+(process.argv[3]) || 0) == 1

app.get('/tle/:noradId', (req, res) => {
    if (allowAllOrigins) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }

    request('https://www.celestrak.com/satcat/tle.php?CATNR='+req.params.noradId, (error, response, body) => {
        const regex = /<pre>[\r\n]+([.\(\)\-A-Za-z0-9 \r\n]*)[\r\n]+<\/pre>/gm;
        const match = regex.exec(body)
        if (match) {
            res.send(match[1]);
        } else {
            res.send("error: " + body);
        }
    });
})

app.listen(port, () => console.log(`Celestrak TLE API Wrapper listening on ${port}!`))