import { Schema, model, Types } from 'mongoose';
import validator from "validator"

// details for a candidate
const Candidate = {
    candidateID: {
        type: Types.ObjectId,
        ref: 'users',
        required: [true, 'Candidate ID is required']
    },
    noOfVotesReceived: {
        type: Number,
        default: 0
    }
}

const Voter = {
    voterID: {
        type: Types.ObjectId,
        ref: 'users',
        required: [true, "Voter/User ID is required"]
    }
}

const electionSchema = Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Election Name is required'],
        minLength: [4, 'Name must have atleast 4 characters'] // if err then change to 'minlength' (no camelCase)
    },
    description: {
        type: String,
        trim: true,
    },
    numberOfWinners: {
        type: Number,
        min: [1, 'There cannot be 0 winners in an election'],
        required: [true, 'Number of Winners is required']
    },
    "course": {
        type: [String],
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
        type: [String],
        required: [true, 'Division is required'],
        enum: {
            values: ['A', 'B'],
            message: 'Invalid Division'
        }
    },
    "status": {
        type: String,
        // required: [true, 'Status is required'],
        enum: {
            values: ['Pending', 'Registration', 'Ongoing', 'Finished'],
            message: 'Invalid Status'
        },
    },
    registrationStart: {
        type: Date,
        required: [true, 'Registration Start Date is required'],
        validate: {
            validator: validator.isDate,
            message: 'Date is invalid'
        },
        // validate: {
        //     validator: function (value) {
        //         const today = new Date(value)
        //         today.setHours(0, 0, 0, 0)

        //         return (
        //             validator.isDate(value)
        //             && (value > today)
        //         )
        //     },
        //     message: "Registration Start Date cannot be earlier than Today's Date"
        // }
    },
    registrationEnd: {
        type: Date,
        required: [true, 'Registration End Date is required'],
        validate: {
            validator: function (value) {
                return (
                    validator.isDate(value)
                    && (value > this.registrationStart)
                )
            },
            message: 'Registration End Date cannot be earlier than its Start Date'
        },
    },
    votingStart: {
        type: Date,
        required: [true, 'Voting Start Date is required'],
        validate: {
            validate: {
                validator: function (value) {
                    return (
                        validator.isDate(value)
                        && (value > this.registrationEnd)
                    )
                },
                message: 'Voting can start only after the registration ends'
            },
        },
    },
    votingEnd: {
        type: Date,
        required: [true, 'Voting End Date is required'],
        validate: {
            validator: function (value) {
                return (
                    validator.isDate(value)
                    && (value > this.votingStart)
                )
            },
            message: 'Voting End Date cannot be earlier than its Start Date'
        },
    },
    resultDeclared: {
        type: Boolean,
        default: false,
        validate: {
            validator: function (value) {
                return (
                    this.value == true && this.status == 'Finished'
                )
            },
            message: "Result can be declared only if the election is finished"
        }
    },
    result: {
        type: Object,
    },
    candidates: [Candidate], // array of candidates
    // votersWhoHaveVoted: [Users],
    votersWhoHaveVoted: [Voter]

}, { timestamps: true });

const Elections = model('elections', electionSchema);

export default Elections