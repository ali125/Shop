const { body } = require('express-validator/check');

exports.categoryValidation = [
    body('name', 'Please fill the name field')
        .isString()
        .trim()
        .isLength({ min: 2 })
];

exports.tagValidation = [
    body('name', 'Please fill the name field')
        .isString()
        .trim()
        .isLength({ min: 2 })
];

exports.userValidation = [
    body('first_name', 'Please fill first name field')
        .isString()
        .trim()
        .isLength({ min: 2 }),
    body('last_name', 'Please fill last name field')
        .isString()
        .trim()
        .isLength({ min: 2 }),
    body('email', 'Please fill email field correctly')
        .isEmail()
        .trim(),
    body('mobile', 'Please fill mobile field correctly')
        .isMobilePhone('fa-IR')
        .trim()
        .isLength({ min: 2 }),
    body('role_id', 'Please fill role field correctly')
        .notEmpty()
        .trim()
];

exports.productValidation = [
    body('title', 'Please fill title field')
        .isString()
        .trim()
        .isLength({ min: 3 }),
    body('stock[0].price', 'Please fill at lease one price field')
        .trim()
        .isNumeric(),
    body('stock[0].count', 'Please fill count field')
        .trim()
        .isNumeric(),
    body('stock[0].sizes', 'Please fill at lease one size field')
        .trim()
        .isNumeric(),
];
