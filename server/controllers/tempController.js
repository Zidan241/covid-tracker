const Temp = require('../models/Temp');
const { submitTempValidation } = require('../validation/tempControllerValidation');

exports.submitTemp = async function (req, res) {
    try{
        const user = req.user;
        const { error } = submitTempValidation(req.body);
        if (error) return res.status(400).send({ error: error.details[0].message });
        req.body.email = user.email;
        req.body.name = user.name;
        const createdTemp = await Temp.create(req.body);
        console.log(createdTemp);
        return res.send({ data: createdTemp });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "something went wrong"});
    }
};