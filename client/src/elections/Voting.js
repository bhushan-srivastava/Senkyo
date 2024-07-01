import { FormControlLabel, FormGroup, Paper, Typography } from "@mui/material";
import Avatar from "@mui/joy/Avatar";
import FormLabel from "@mui/joy/FormLabel";
import Radio, { radioClasses } from "@mui/joy/Radio";
import Checkbox, { checkboxClasses } from "@mui/joy/Checkbox";
import RadioGroup from "@mui/joy/RadioGroup";
import Sheet from "@mui/joy/Sheet";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Box from "@mui//joy/Box";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { message } from "antd";

const Voting = ({ election }) => {
  const [checkedValues, setCheckedValues] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [maxChecked, setMaxChecked] = useState(0);

  useEffect(() => {
    console.log("In voting:\t", election);
    if (election) {
      setCandidates(election.candidates);
      setMaxChecked(election.numberOfWinners);
    }

    console.log("Candidates in voting:", candidates);
    console.log("No of Candidates in voting:", maxChecked);
  }, [election, candidates]);

  const handleVote = () => {
    console.log("Checked Values:", checkedValues);
    fetch(`/api/elections/${election._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "vote",
        candidates: { checkedValues }
      }),
    })
      .then(async (response) => {
        // Ensure the response is successful
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Something went wrong");
        }
        return response.json();
      })
      .then((data) => {
        message.success(data.message);
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const handleCheckboxChange = (value) => (event) => {
    const isChecked = event.target.checked;
    console.log("isChecked:", checkedValues.length);
    if (isChecked) {
      if (checkedValues.length <= maxChecked) {
        setCheckedValues((prevCheckedValues) => [...prevCheckedValues, value]);
      } else {
        event.preventDefault();
        message.warning('You cannot vote for more than ' + maxChecked + ' candidates in this election', 8);
      }
    } else {
      setCheckedValues((prevCheckedValues) =>
        prevCheckedValues.filter((val) => val !== value)
      );
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
      <Typography variant="h5">Cast your Votes:</Typography>
      <List
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 2,
          margin: 2
        }}
      >

        {candidates &&
          candidates.map((candidate) => {
            const isChecked = checkedValues.includes(candidate.candidateID);
            return (
              <ListItem
                key={candidate.candidateID}
                variant={isChecked ? "soft" : "outlined"}
                sx={{
                  borderRadius: "md",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1.5,
                  p: 2,
                  minWidth: 120,
                  border: "0.1px solid",
                  borderColor: "lightgrey",
                  [`& .${checkboxClasses.checked}`]: {
                    [`& .${checkboxClasses.action}`]: {
                      inset: -1,
                      border: "3px solid",
                      borderColor: "primary.500",
                      borderRadius: "8px",
                    },
                  },
                  [`& .${checkboxClasses.checkbox}`]: {
                    display: "contents",
                    "& > svg": {
                      zIndex: 2,
                      position: "absolute",
                      top: "-8px",
                      right: "-8px",
                      bgcolor: "Background",
                    },
                  },
                }}
              >
                <Checkbox
                  id={candidate.candidateID}
                  value={candidate.candidateID}
                  checked={isChecked}
                  checkedIcon={<CheckBoxIcon color="info" />}
                  overlay
                  slotProps={{ action: { className: checkboxClasses.checked } }}
                  onChange={handleCheckboxChange(candidate.candidateID)}
                />
                <Avatar src={candidate.imgCode} variant="soft" size="lg" />
                <FormLabel htmlFor={candidate.candidateID}>{candidate.name}</FormLabel>
              </ListItem>
            );
          })}
      </List>

      <Button onClick={handleVote} variant="contained" color="primary" >
        Vote
      </Button>
    </Box>
  );
};

export default Voting;
