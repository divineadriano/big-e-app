const express = require('express')
const router = express.Router()

const CustomerController = require('../controllers/CustomerController')

router.get('/', CustomerController.index)
router.post('/', CustomerController.show)
router.post('/', CustomerController.store)
router.post('/', CustomerController.update)
router.post('/', CustomerController.destroy)

module.exports = router