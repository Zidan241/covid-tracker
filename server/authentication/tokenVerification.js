const auth0 = require('auth0-js');
const axios = require('axios')

module.exports= (req, res, next)=>{
    const token= req.headers.auth_token;
    console.log(token)
    if(!token)  
    {
        return res.status(401).send({error: "please login"});
    }
    try{
        //token is an opaque token used only for the userinfo endpoint
        //auth0 handles the validation
        axios
        .get('https://dev-c04n2wmg.us.auth0.com/userinfo',{
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            req.user = res.data;
            next();
        })
        .catch(error => {
            console.error(error)
        })
    }
    catch(err){
        console.log(err)
        return res.status(400).send({error: "please login"});
    }
}