import  jwt  from "jsonwebtoken"
import config from "../config.js"

function authenticateToken(req, res, next){

    const token = req.headers['x-access-token']

    jwt.verify(token,config.ACCESS_TOKEN_KEY, function(err){

        if(err){
            return res.sendStatus(401)
        }
        else{
            next()
        }
    })
}

export default authenticateToken