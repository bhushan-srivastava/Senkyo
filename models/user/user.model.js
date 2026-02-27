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
        validate: [
            {
                validator: validator.isEmail,
                message: 'Please fill a valid email address'
            },
            {
                validator: function (value) {
                    return value.endsWith('@ves.ac.in');
                },
                message: 'Please use your VES email ID'
            }
        ],
        required: [true, 'Email is required']
    },
    "course": {
        type: String,
        required: [true, 'Course is required'],
        enum: {
            values: [
                "FY MCA", "SY MCA",
                "FY CMPN", "SY CMPN", "TY CMPN", "BE CMPN",
                "FY INFT", "SY INFT", "TY INFT", "BE INFT"
            ],
            message: 'Invalid Course'
        }
    },
    "division": {
        type: String,
        required: [true, 'Division is required'],
        enum: {
            values: ['A', 'B'],
            message: 'Invalid Division'
        }
    },
    "gender": {
        type: String,
        required: [true, 'Gender is required'],
        enum: {
            values: ['Male', 'Female'],
            message: 'Invalid Gender'
        }
    },
    "imgCode": {
        type: String,
        required: [true, 'User\'s image is required']
    },
    verified: {
        type: Boolean,
        default: false,
    },
    activeTokens: {
        type: [String],
        default: []
    }

}, { timestamps: true });

const Users = model('users', userSchema);

export default Users
