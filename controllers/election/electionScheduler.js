import cron from "node-cron";
import Elections from "../../models/election/election.model.js";


const today = new Date();
today.setHours(0, 0, 0, 0);

const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

// Define a function to handle registration start
async function startRegistration() {
  try {
    const elections = await Elections.find({
      registrationStart: { $gte: today, $lt: tomorrow },
    });

    await Promise.all(
      elections.map(async (election) => {
        election.status = "Registration";
        await election.save();
        console.log(`Registration started for election: ${election.title}`);
      })
    );
  } catch (error) {
    console.error("Error starting registration:", error.message);
  }
}

// Define a function to handle registration end
async function endRegistration() {
  try {
    const elections = await Elections.find({
      status: "Registration",
      registrationEnd: { $gte: yesterday, $lt: today },
    });

    await Promise.all(
      elections.map(async (election) => {
        election.status = "Pending";
        await election.save();
        console.log(`Registration ended for election: ${election.title}`);

        
      })
    );
  } catch (error) {
    console.error("Error ending registration:", error);
  }
}

// Define a function to handle voting start
async function startVoting() {
  try {
    const elections = await Elections.find({
      votingStart: { $gte: today, $lt: tomorrow },
    });

    await Promise.all(
      elections.map(async (election) => {
        election.status = "Ongoing";
        await election.save();
        console.log(`Voting started for election: ${election.title}`);

        
      })
    );
  } catch (error) {
    console.error("Error starting voting:", error);
  }
}

// Define a function to handle voting end
async function endVoting() {
  try {
    const elections = await Elections.find({
      status: "Ongoing",
      votingEnd: { $gte: yesterday, $lt: today },
    });

    await Promise.all(
      elections.map(async (election) => {
        election.status = "Finished";
        await election.save();
        console.log(`Voting ended for election: ${election.title}`);

        
      })
    );
  } catch (error) {
    console.error("Error ending voting:", error);
  }
}

// // Schedule tasks using cron expressions
// cron.schedule('0 0 * * *', startRegistration); // Everyday at 12:00 AM
// cron.schedule('0 0 * * *', endRegistration); // Everyday at 12:00 AM
// cron.schedule('0 0 * * *', startVoting); // Everyday at 12:00 AM
// cron.schedule('0 0 * * *', endVoting); // Everyday at 12:00 AM

const scheduleElections = async () => {
  console.log("please wait for scheduling elections");
  // Await all functions
  await Promise.all([
    startRegistration(),
    endRegistration(),
    startVoting(),
    endVoting(),
  ]);
  console.log("done scheduling elections");
};

export default scheduleElections;
