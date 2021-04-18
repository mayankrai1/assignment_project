const Joi = require('joi');
const helper = require('../utils/helper');

const ProspectsSchema = Joi.object({
    user_id: Joi.string().required(),
    product_id: Joi.string().required(),
    product_name: Joi.string().required(),
    product_type: Joi.string().required(),
    product_quantity: Joi.number().required(),
   

})

module.exports = {
    insert
}

function insert(prospect) { return helper.validator(prospect, ProspectsSchema) }