const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getMe, logoutUser, findUserWithUsername, verifyPhone, updatePassword } = require('../controllers/userController')
const { protect } = require('../middlewares/authMiddleware')

// router.get('*', protect)
router.post('/signup', registerUser)
router.post('/login',  loginUser)
router.post('/find',  findUserWithUsername)
router.get('/verify',  verifyPhone)
router.patch('/update',  updatePassword)
router.get('/me', protect, getMe)
router.get('/logout', logoutUser)

module.exports = router