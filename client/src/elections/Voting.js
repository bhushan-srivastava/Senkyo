import { Typography } from "@mui/material";
import Avatar from "@mui/joy/Avatar";
import FormLabel from "@mui/joy/FormLabel";
import Checkbox, { checkboxClasses } from "@mui/joy/Checkbox";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Box from "@mui/joy/Box";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { message } from "antd";
import { apiFetch } from "../api/fetchClient";

const Voting = ({ election }) => {
  const [checkedValues, setCheckedValues] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [maxChecked, setMaxChecked] = useState(0);

  useEffect(() => {
    if (election && election.candidates) {
      setCandidates(election.candidates);
      setMaxChecked(election.numberOfWinners);
    }
  }, [election]);

  const handleVote = () => {
    apiFetch(`/api/elections/${election._id}`, {
      method: "PATCH",
      body: JSON.stringify({
        action: "vote",
        candidates: { checkedValues }
      }),
    })
      .then(({ data }) => {
        message.success(data.message);
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const handleCheckboxChange = (value) => (event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      if (checkedValues.length < maxChecked) {
        setCheckedValues((prevCheckedValues) => [...prevCheckedValues, value]);
      } else {
        event.preventDefault();
        message.warning(
          "Cannot choose more than " + maxChecked + " candidates",
          5
        );
      }
    } else {
      setCheckedValues((prevCheckedValues) =>
        prevCheckedValues.filter((val) => val !== value)
      );
    }
  };

  /* Voting module (for voters only) */

  //

  return (
    <Box mt={5} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
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
            const isChecked = checkedValues.includes(candidate._id);
            return (
              <ListItem
                key={candidate._id}
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
                  id={candidate._id}
                  value={candidate._id}
                  checked={isChecked}
                  checkedIcon={<CheckBoxIcon color="info" />}
                  overlay
                  slotProps={{ action: { className: checkboxClasses.checked } }}
                  onChange={handleCheckboxChange(candidate._id)}
                />
                <Avatar src={candidate.imgCode} variant="soft" size="lg" />
                <FormLabel htmlFor={candidate._id}>{candidate.name}</FormLabel>
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
