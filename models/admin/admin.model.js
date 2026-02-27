import { Schema, model } from 'mongoose';
import validator from "validator"
import bcrypt from "bcrypt"

const adminSchema = Schema({
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
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must have atleast 8 characters'] // if err then change to 'minlength' (no camelCase)
    },
    activeTokens: {
        type: [String],
        default: []
    },

}, { timestamps: true });

// fire a function before doc saved to db
adminSchema.pre('insertMany',
    async function (next, docs) {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS)


        try {
            await Promise.all(
                docs.map(
                    async function (doc, index) {
                        // async hash password
                        doc.password = await bcrypt.hash(doc.password, saltRounds);
                    }
                )
            );

        } catch (error) {
            return next(error);
        }

        next();
    }
);

const Admins = model('Admins', adminSchema);

export default Admins
