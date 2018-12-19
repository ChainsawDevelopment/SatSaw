const express = require('express')
const request = require('request')

const app = express()
const port = (+(process.argv[2])) || 3000

app.get('/tle/:noradId', (req, res) => {
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