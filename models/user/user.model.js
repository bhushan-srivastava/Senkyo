import { Schema, model } from 'mongoose';
import validator from "validator"

const userSchema = Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Name is required'],
        minLength: [4, 'Name must have atleast 4 characters'] // if err then change to 'minlength' (no camelCase)
    },
    email: {
        type: String,
        trim: true,
        unique: [true, 'Email already exists'],
        // match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        validate: {
            validator: validator.isEmail,
            message: 'Please fill a valid email address'
        },
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must have atleast 8 characters'] // if err then change to 'minlength' (no camelCase)
    },
    "course": {
        type: String,
        required: [true, 'Course field is required']
    },
    "division": {
        type: String,
        required: [true, 'division field is required']
    },
    "imgCode": {
        type: String,
        required: [true, 'User image is required']
    },

}, { timestamps: true });

const Users = model('users', userSchema);

export default Users