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
    "courses": {
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
    "divisions": {
        type: [String],
        required: [true, 'Division is required'],
        enum: {
            values: ['A', 'B'],
            message: 'Invalid Division'
        }
    },
    "genders": {
        type: [String],
        required: [true, 'Gender is required'],
        enum: {
            values: ['Male', 'Female'],
            message: 'Invalid Gender'
        }
    },
    "status": {
        type: String,
        required: [true, 'Status is required'],
        enum: {
            values: ['Pending', 'Registration', 'Ongoing', 'Paused', 'Finished'],
            message: 'Invalid Status'
        }
    },
    registrationStart: {
        type: Date,
        required: [true, 'Registration Start Date is required'],
        validate: {
            validator: validator.isDate,
            message: "Invalid Registration Start Date"
        }
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
            validator: function (value) {


                return (
                    validator.isDate(value)
                    && (value > this.registrationEnd)
                )
            },
            message: 'Voting can start after registration ends'
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
    candidates: [Candidate], // array of candidates
    // votersWhoHaveVoted: [Users],
    votersWhoHaveVoted: [Voter]

}, { timestamps: true });

// Query-performance indexes for list endpoint (filters + sorting).
electionSchema.index({ status: 1, registrationStart: -1 });
electionSchema.index({ courses: 1, divisions: 1, registrationStart: -1 });
electionSchema.index({ votingStart: -1 });
electionSchema.index({ createdAt: -1 });
electionSchema.index({ title: 1 });

const Elections = model('elections', electionSchema);

export default Elections
