const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: 'string', required: true},
    email: { type: 'string', unique: true, required: true},
    password: { type: 'string', required: true}
})

export default userSchema;