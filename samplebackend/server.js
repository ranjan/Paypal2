
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 8000;


app.use(bodyParser.json());

const route = function(app){
    app.get('/testendpoint', async (req, res) => {
        console.log("testendpoint gets called");
        await res.send({data: 'teste'});
    });
}

route(app);
require('./middleware')(app);

app.listen(port, () => {
    console.log("Server is listening at " + port);
});

