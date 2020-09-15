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

exports.permissionValidation = [
    body('title', 'Please fill the title field')
        .isString()
        .trim()
        .isLength({ min: 2 }),
    body('section_title', 'Please fill the section title field')
        .isString()
        .trim()
        .isLength({ min: 2 }),
    body('route_url', 'Please fill the route url field')
        .isString()
        .trim()
        .isLength({ min: 2 }),
];

exports.roleValidation = [
    body('title', 'Please fill the title field')
        .isString()
        .trim()
        .isLength({ min: 2 }),
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
exports.profileValidation = [
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
        .isLength({ min: 2 })
];
exports.addressValidation = [
    body('title', 'Please fill title field')
        .isString()
        .trim()
        .isLength({ min: 3 }),
    // body('state_id', 'Please fill state field'),
    body('city_id', 'Please fill city field'),
    body('address', 'Please fill address field')
        .isString()
        .trim(),
    body('mobile', 'Please fill mobile field correctly')
        .isMobilePhone('fa-IR')
        .trim()
        .isLength({ min: 2 }),
    body('phone', 'Please fill phone field')
        .trim()
        .isLength({ min: 2 })
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

exports.adminOrderValidation = [];
