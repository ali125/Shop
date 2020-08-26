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
