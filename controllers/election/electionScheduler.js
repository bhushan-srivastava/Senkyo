import cron from 'node-cron';
import Elections from "../../models/election/election.model.js"

const today = new Date();
today.setHours(0, 0, 0, 0);

const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000));

const tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));

// Define a function to handle registration start
async function startRegistration() {
    try {
        const elections = await Elections.find({
            // status: 'Pending',
            registrationStart: { $gte: today, $lt: tomorrow } // Find elections where registration is scheduled to start today
        });

        // Update the status of elections to 'Registration'
        for (const election of elections) {
            election.status = 'Registration';
            await election.save();
            console.log(`Registration started for election: ${election.title}`);
        }
    } catch (error) {
        console.error('Error starting registration:', error.message);
    }
}

// Define a function to handle registration end
async function endRegistration() {
    try {
        const elections = await Elections.find({
            status: 'Registration',
            registrationEnd: { $gte: yesterday, $lt: today } // Find elections where registration was scheduled to end yesterday at 11:59pm
        });

        // Update the status of elections to 'Ongoing'
        for (const election of elections) {
            election.status = 'Pending';
            await election.save();
            console.log(`Registration ended for election: ${election.title}`);
        }
    } catch (error) {
        console.error('Error ending registration:', error);
    }
}

// Define a function to handle voting start
async function startVoting() {
    try {
        const elections = await Elections.find({
            status: 'Ongoing',
            votingStart: { $gte: today, $lt: tomorrow } // Find elections where voting is scheduled to start now
        });

        // Update the status of elections to 'Voting'
        for (const election of elections) {
            election.status = 'Voting';
            await election.save();
            console.log(`Voting started for election: ${election.title}`);
        }
    } catch (error) {
        console.error('Error starting voting:', error);
    }
}

// Define a function to handle voting end
async function endVoting() {
    try {
        const elections = await Elections.find({
            status: 'Voting',
            votingEnd: { $gte: yesterday, $lt: today } // Find elections where voting is scheduled to end now
        });

        // Update the status of elections to 'Finished'
        for (const election of elections) {
            election.status = 'Finished';
            await election.save();
            console.log(`Voting ended for election: ${election.title}`);
        }
    } catch (error) {
        console.error('Error ending voting:', error);
    }
}

// Schedule tasks using cron expressions
cron.schedule('0 0 * * *', startRegistration); // Everyday at 12:00 AM
cron.schedule('0 0 * * *', endRegistration); // Everyday at 12:00 AM
cron.schedule('0 0 * * *', startVoting); // Everyday at 12:00 AM
cron.schedule('0 0 * * *', endVoting); // Everyday at 12:00 AM