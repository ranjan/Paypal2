const jwt = require('jsonwebtoken');

module.exports = function(app) {

    const checkToken = (req, res, next) => {
        let token = req.headers['x-access-token'] || req.headers['authorization'];

        if(token === undefined){
            return res.status(401).send({"error": "Token is not present"});
        }

        if(token.startsWith('Bearer ')){
            token = token.slice(7, token.length);
        }

        if(token) {
            jwt.verify(token, "thisismysecret", (err, decoded) => {
                if(err){
                    return res.json({
                        success: false,
                        message: 'Token is not right..'
                    });
                }
                else{
                    req.decoded = decoded;
                    next();
                }
            });
        }
        else{
            return res.json({
                success: false,
                message: 'Token is not right..'
            });
        }
    }

    app.post('/login', async (req,res) => {

        const loginData = req.body.loginData;
        const userName = "arif";
        const password = "arif";

        if(userName === loginData.userName && password === loginData.password){
            //create token
            const token = jwt.sign({userName: userName, role: 'admin'}, 'thisismysecret', {expiresIn: '24h'});
            return res.status(200).send({toekn: token});
        }

        return res.status(401).send({error: "Invalid user id and password"});

    });

    app.get('/mysecuredendpoint', async (req, res) => {
        checkToken(req, res, () => {
            console.log(req.decoded);
            return res.status(200).send({data: "success"});
        });
    });
}