
const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

const port = 8000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const routes = function(app){
    
    var CLIENT ='AfYydU6ft4RaMSMdOGe5qLNAeZjJhN3z4WHAhxuHf-IyI_osgGNvdQ9ZGXC-ZW7jysC-fTiJf1UFz0OD';
    var SECRET ='ECo6t2oyN_RGzdHA8YUKejh82rVZ1ro_ZMKXCaO7MyEvR6GOO-0pnqS4_4G2rnz17AbWARJ0yTEUjUPJ';
    var PAYPAL_API = 'https://api.sandbox.paypal.com';

    app.post('/create-payment', async (req, res) => {
        console.log('err');
        request.post(PAYPAL_API + '/v1/payments/payment',
        {
        auth:
        {
            user: CLIENT,
            pass: SECRET
        },
        body:
        {
            intent: 'sale',
            payer:
            {
                payment_method: 'paypal'
            },
            transactions: [
            {
            amount:
            {
                total: '5.99',
                currency: 'USD'
            }
            }],
            redirect_urls:
            {
                return_url: 'https://example.com',
                cancel_url: 'https://example.com'
            }
        },
        json: true
        }, function(err, response)
        {
        if (err)
        {
            console.error(err);
            return res.sendStatus(500);
        }
        // 3. Return the payment ID to the client
        console.log("I am in create payment", response.body);
        res.json(
        {
            id: response.body.id
        });
        });
    });

    app.post('/execute-payment/', async (req, res) => {
        // 2. Get the payment ID and the payer ID from the request body.
        console.log("I am in execute payment", req.body.paymentID, req.body.payerID);
        var paymentID = req.body.paymentID;
        var payerID = req.body.payerID;
        // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
        request.post(PAYPAL_API + '/v1/payments/payment/' + paymentID +
        '/execute',
        {
            auth:
            {
                user: CLIENT,
                pass: SECRET
            },
            body:
            {
            payer_id: payerID,
            transactions: [
            {
                amount:
                {
                total: '5.99',
                currency: 'USD'
                }
            }]
            },
            json: true
        },
        function(err, response)
        {
            console.log(err);
            console.log(JSON.stringify(response.body));
            if (err)
            {
                console.error(err);
                return res.sendStatus(500);
            }
            // 4. Return a success response to the client
            res.json(
            {
            status: 'success'
            });
        });
    });
}

routes(app);

app.listen(port, ()=> {
    console.log("Server is running on port 8000");
});


