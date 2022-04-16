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
        return res.send({ data: createdTemp });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "something went wrong"});
    }
};

exports.getMyTemps = async function (req, res) {
    try{
        const user = req.user;
        const myTemps = await Temp.find({email:user.email,deleted:false}).lean();
        return res.send({ data: myTemps });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "something went wrong"});
    }
};

exports.getAllTemps = async function (req, res) {
    try{
        const user = req.user;
        const allTemps = await Temp.find({deleted:false}).lean();
        return res.send({ data: allTemps });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "something went wrong"});
    }
};

exports.deleteTemp = async function (req, res) {
    try{
        const user = req.user;
        const tempId = req.params.tempId;
        const deletedTemp = await Temp.findOneAndUpdate(tempId,{deleted:true,deletedOn:new Date()}).lean();
        return res.send({ data: deletedTemp });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: "something went wrong"});
    }
};