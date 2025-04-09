const express = require('express');
const UserController = require('../controllers/users');
const router = express.Router();
const adminAuth = require('../auth/adminAuth')

//all of the requests require admin privilages

//add new user to the database
router.post('/users', adminAuth, UserController.addUser);
//retrieve the data of a user by his username
router.get('/users/:username', adminAuth, UserController.getUser);
//update a user
router.put('/users/:username', adminAuth, UserController.updateUser);
//import data into energy database
router.post('/:csvfile', adminAuth, UserController.addCSV);

module.exports = router;