import { FormControlLabel, FormGroup, Paper } from "@mui/material";
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/joy/Avatar';
import FormLabel from '@mui/joy/FormLabel';
import Radio, { radioClasses } from '@mui/joy/Radio';
import Checkbox, { checkboxClasses } from '@mui/joy/Checkbox';
import RadioGroup from '@mui/joy/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import Box from "@mui//joy/Box";
import { useState } from "react";
import Button from "@mui/material/Button"
import { message } from "antd"

const Voting = ({ electionDetails }) => {
    const [checkedValues, setCheckedValues] = useState([]);

    const maxChecked = 2//use electionDetails.numberOfWinners value here

    const handleVote = () => {
        console.log("Checked Values:", checkedValues);
    };

    const handleCheckboxChange = (value) => (event) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            if (checkedValues.length < maxChecked) {
                setCheckedValues((prevCheckedValues) => [...prevCheckedValues, value]);
            }
            else {
                event.preventDefault();
                message.warning('Cannot choose more than ' + maxChecked + ' candidates', 5)
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
        <>
            <List
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 2
                }}
            >
                {
                    ['Person1', 'Person2', 'Person3'].map((value) => {
                        const isChecked = checkedValues.includes(value);
                        return <ListItem
                            key={value}

                            sx={{
                                borderRadius: 'md',
                                // boxShadow: 'sm',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1.5,
                                p: 2,
                                minWidth: 120,
                                border: '0.1px solid',
                                borderColor: 'lightgrey',

                                [`& .${checkboxClasses.checked}`]: {
                                    [`& .${checkboxClasses.action}`]: {
                                        inset: -1,
                                        border: '3px solid',
                                        borderColor: 'primary.500',
                                        borderRadius: '8px'
                                    },
                                },
                                [`& .${checkboxClasses.checkbox}`]: {
                                    display: 'contents',
                                    '& > svg': {
                                        zIndex: 2,
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-8px',
                                        bgcolor: 'Background',
                                        // p: 0
                                        // borderRadius: '100px'
                                    },
                                },

                            }}
                        >
                            <Checkbox id={value} value={value}
                                checked={isChecked}
                                checkedIcon={<CheckBoxIcon color="info" />}
                                overlay
                                slotProps={{ action: { className: checkboxClasses.checked } }}
                                onChange={handleCheckboxChange(value)}
                            />
                            <Avatar variant="soft" size="lg" />
                            <FormLabel htmlFor={value}>{value}</FormLabel>
                        </ListItem>

                    })

                }
            </List >

            <Button onClick={handleVote} variant="contained" color="primary">
                Vote
            </Button>
        </>

    );
}

export default Voting;