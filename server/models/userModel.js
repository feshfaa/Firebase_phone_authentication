const mongoose = require('mongoose')

const User = new mongoose.Schema(
    {
        username: { type: String, required: [true, 'Please enter username']},
        fullname: { type:String, required: [true, 'Please enter fullname'],},
        number: { type:String, required: [true, 'Please enter number'], unique: true},
        email: { type:String, required: [true, 'Please enter email'], unique: true},
        password: { type:String, required: [true, 'Please enter password'], minLength: [6, 'Minimum password length is 6']}
    },
    {
        collection: 'users'
    }
)

const model = mongoose.model('Users', User)

module.exports = model