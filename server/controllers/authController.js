const objectId = require('mongoose').Types.ObjectId;
var ManagementClient = require('auth0').ManagementClient;

exports.registerCheck = async function (req, res) {
    try{
      const email = req.params.email;
      if(!email)
        return res.status(400).send({error: 'email is required'});
      var management = new ManagementClient({
        domain: 'dev-c04n2wmg.us.auth0.com',
        clientId: 'tpUfz8UPXqU3p85T2swJAiIxURlwkW9I',
        clientSecret: 'krWg_s_UimxQYenCaMlwcKDp_39E8mK1Wj4HxJ4KYYkAfV17gPUGEWncswX37Eif',
        scope: 'create:users read:users update:users',
      });
      const users = await management.getUsersByEmail(email);
      return res.send({ data: users.length>0 });
    } catch (err) {
      console.log(err);
      return res.status(400).send({ error: "something went wrong"});
    }
};
exports.register = async function (req, res) {
  try{
    const email = req.body.email;
    const name = req.body.name;
    if(!email)
      return res.status(400).send({error: 'Email is required'});
    var management = new ManagementClient({
      domain: 'dev-c04n2wmg.us.auth0.com',
      clientId: 'tpUfz8UPXqU3p85T2swJAiIxURlwkW9I',
      clientSecret: 'krWg_s_UimxQYenCaMlwcKDp_39E8mK1Wj4HxJ4KYYkAfV17gPUGEWncswX37Eif',
      scope: 'create:users read:users update:users',
    });
    const users = await management.getUsersByEmail(email);
    if(users.length>0) return res.status(400).send({error: 'this email is already registered, please proceed to login'});
    const createdUser = await management.createUser({
      email: email,
      name: name,
      connection: 'email',
      email_verified: true
    });
    return res.send({ data: "user created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "something went wrong"});
  }
};