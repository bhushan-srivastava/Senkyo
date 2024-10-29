import Web3 from 'web3';

import ElectionABI from '../../blockchain/client/src/contracts/ElectionManager.json' assert { type: 'json' };


// import dotenv from "dotenv";
// dotenv.config();




// Initialize web3 with the network you are using (Ganache or testnet)
const web3 = new Web3("HTTP://127.0.0.1:7545");

const contract_add = '0xA12bEB5f8659f1F6b263e2f200E73c989d7aA8b0';


// Contract address obtained after deployment
const electionContract = new web3.eth.Contract(ElectionABI.abi, contract_add);

// Helper to get account for transaction
const getBlockchainAccount = async () => {
  return process.env.ACCOUNT_ADDRESS;
};



// Function to create a new election on the blockchain
export const blockchainAddElection = async (electionID, title) => {
  try {
    const account = await getBlockchainAccount();
    const gas = await electionContract.methods.addElection(electionID, title)
      .estimateGas({ from: account })
      .catch(error => {
        console.error(`Gas estimation failed for adding election [ID: ${electionID}, Title: ${title}]:`, error.message);
        throw error;
      });
    const receipt = await electionContract.methods.addElection(electionID, title).send({ from: account, gas });
    console.log('Election added successfully on blockchain:', receipt);
    return receipt;
  } catch (error) {
    console.error(`Error adding election [ID: ${electionID}, Title: ${title}] on blockchain:`, error);
    return { success: false, message: error.message };
  }
};

// Function to add a candidate to an election on the blockchain
export const blockchainAddCandidate = async (electionID, candidateID, noOfVotes = 0) => {
  try {
    const account = await getBlockchainAccount();
    const gas = await electionContract.methods.addCandidate(electionID, candidateID, noOfVotes)
      .estimateGas({ from: account })
      .catch(error => {
        console.error(`Gas estimation failed for adding candidate [Election ID: ${electionID}, Candidate ID: ${candidateID}] on blockchain:`, error.message);
        throw error;
      });
    const receipt = await electionContract.methods.addCandidate(electionID, candidateID, noOfVotes).send({ from: account, gas });
    console.log('Candidate added successfully on blockchain:', receipt);
    return receipt;
  } catch (error) {
    console.error(`Error adding candidate [Election ID: ${electionID}, Candidate ID: ${candidateID}] on blockchain:`, error);
    return { success: false, message: error.message };
  }
};

// Function to cast a vote on the blockchain
export const blockchainVote = async (electionID, candidateID, voterID) => {
  try {
    const account = await getBlockchainAccount();
    const gas = await electionContract.methods.vote(electionID, candidateID, voterID)
      .estimateGas({ from: account })
      .catch(error => {
        console.error(`Gas estimation failed for casting vote [Election ID: ${electionID}, Candidate ID: ${candidateID}, Voter ID: ${voterID}] on blockchain:`, error.message);
        throw error;
      });
    const receipt = await electionContract.methods.vote(electionID, candidateID, voterID).send({ from: account, gas });
    console.log('Vote cast successfully on blockchain:', receipt);
    return receipt;
  } catch (error) {
    console.error(`Error casting vote [Election ID: ${electionID}, Candidate ID: ${candidateID}, Voter ID: ${voterID}] on blockchain:`, error);
    return { success: false, message: error.message };
  }
};

// Function to get details of a candidate in a specific election from the blockchain
export const blockchainGetCandidate = async (electionID, candidateID) => {
  try {
    const result = await electionContract.methods.getCandidate(electionID, candidateID).call();
    console.log(`Candidate ${candidateID} details from blockchain:`, result);
    return result;
  } catch (error) {
    console.error(`Error getting candidate details [Election ID: ${electionID}, Candidate ID: ${candidateID}] from blockchain:`, error);
    return { success: false, message: error.message };
  }
};

// Function to get the title of an election from the blockchain
export const blockchainGetElectionTitle = async (electionID) => {
  try {
    const title = await electionContract.methods.getElectionTitle(electionID).call();
    console.log(`Election title for ${electionID} from blockchain:`, title);
    return title;
  } catch (error) {
    console.error(`Error getting election title [Election ID: ${electionID}] from blockchain:`, error);
    return { success: false, message: error.message };
  }
};

// Function to retrieve all elections from the blockchain
export const blockchainGetAllElections = async () => {
  //console.log("contract : ", electionContract);
  try {
    const result = await electionContract.methods.getAllElections().call();
    console.log('All elections from blockchain:', result);
    return result;
  } catch (error) {
    console.error('Error retrieving all elections from blockchain:', error);
    return { success: false, message: error.message };
  }
};

// Function to get all candidates and vote counts for an election from the blockchain
export const blockchainGetAllCandidates = async (electionID) => {
  try {
    const result = await electionContract.methods.getAllCandidates(electionID).call();
    console.log(`All candidates for election ${electionID} from blockchain:`, result);

    const ob = {};
    for (let index = 0; index < result[0].length; index++) {
      // Assign the correct vote count to each candidate
      ob[result[0][index]] = Number(result[1][index]);  // Use index to get the correct vote count
    }

    return ob;
  } catch (error) {
    console.error(`Error retrieving all candidates [Election ID: ${electionID}] from blockchain:`, error);
    return { success: false, message: error.message };
  }
};


// Function to remove a candidate from an election on the blockchain
export const blockchainRemoveCandidate = async (electionID, candidateID) => {
  try {
    const account = await getBlockchainAccount();
    const gas = await electionContract.methods.removeCandidate(electionID, candidateID)
      .estimateGas({ from: account })
      .catch(error => {
        console.error(`Gas estimation failed for removing candidate [Election ID: ${electionID}, Candidate ID: ${candidateID}] on blockchain:`, error.message);
        throw error;
      });
    const receipt = await electionContract.methods.removeCandidate(electionID, candidateID).send({ from: account, gas });
    console.log('Candidate removed successfully on blockchain:', receipt);
    return receipt;
  } catch (error) {
    console.error(`Error removing candidate [Election ID: ${electionID}, Candidate ID: ${candidateID}] on blockchain:`, error);
    return { success: false, message: error.message };
  }
};

// Function to finish an election (make inactive) on the blockchain
export const blockchainToggleElectionStatus = async (electionID, status) => {
  try {
    const account = await getBlockchainAccount();
    const gas = await electionContract.methods.toggleElectionStatus(electionID, status)
      .estimateGas({ from: account })
      .catch(error => {
        console.error(`Gas estimation failed for changing election status [Election ID: ${electionID}] on blockchain:`, error.message);
        throw error;
      });
    const receipt = await electionContract.methods.toggleElectionStatus(electionID, status).send({ from: account, gas });
    console.log('Election status changed successfully on blockchain:', receipt);
    return receipt;
  } catch (error) {
    console.error(`Error changing election status [Election ID: ${electionID}] on blockchain:`, error);
    return { success: false, message: error.message };
  }
};

// Function to change the title of an election on the blockchain
export const blockchainChangeElectionTitle = async (electionID, newTitle) => {
  try {
    const account = await getBlockchainAccount();
    const gas = await electionContract.methods.changeElectionTitle(electionID, newTitle)
      .estimateGas({ from: account })
      .catch(error => {
        console.error(`Gas estimation failed for changing election title [Election ID: ${electionID}, New Title: ${newTitle}] on blockchain:`, error.message);
        throw error;
      });
    const receipt = await electionContract.methods.changeElectionTitle(electionID, newTitle).send({ from: account, gas });
    console.log('Election title changed successfully on blockchain:', receipt);
    return receipt;
  } catch (error) {
    console.error(`Error changing election title [Election ID: ${electionID}, New Title: ${newTitle}] on blockchain:`, error);
    return { success: false, message: error.message };
  }
};


//To check we are connected to genache run cmd node blockchainScripts.js

// Check if connected to Ganache
export const checkConnection = async () => {
  try {
    const networkId = await web3.eth.net.getId();
    console.log(`Connected to network ID: ${networkId}`);
    if (networkId == 5777) { // Ganache's default network ID
      console.log("Successfully connected to Ganache.");
    } else {
      console.log("Not connected to Ganache. Connected to a different network.");
    }
  } catch (error) {
    console.error("Failed to connect to the network:", error.message);
  }
};



export const checkAccounts = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      console.log("Successfully connected to Ganache. Accounts available:", accounts);
    } else {
      console.log("Connected to Ganache, but no accounts found.");
    }
  } catch (error) {
    console.error("Failed to retrieve accounts:", error.message);
  }
};

