const Joi = require('joi');

const submitTempValidation = data => {
const schema =Joi.object({
    //trim removes all whitespaces from string filo pateer=> filopateer
    temp :Joi.number().min(30).max(45).required(),
    long : Joi.number().greater(-180).less(180).required(),
    lat : Joi.number().greater(-90).less(90).required(),
    comment: Joi.string(),
});
return schema.validate(data);
}

module.exports.submitTempValidation=submitTempValidation;
