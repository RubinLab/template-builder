import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accessibility from '@material-ui/icons/Accessibility';
import Visibility from '@material-ui/icons/Visibility';
// import LocalHospital from '@material-ui/icons/LocalHospital';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const materialUseStyles = makeStyles(theme => ({
  formControl: {
    marginTop: theme.spacing(3),
    minWidth: 150
  },
  button: {
    display: 'block',
    marginTop: theme.spacing(2)
  },
  icon: {
    marginRight: theme.spacing(1)
  },
  textField: {
    marginTop: theme.spacing(3),
    minWidth: 400,
    overflowWrap: 'break-word'
  }
}));

export default function Form() {
  const classes = materialUseStyles();

  return (
    <>
      <InputLabel id="demo-controlled-open-select-label">
        Question type
      </InputLabel>
      <Select
        labelId="demo-controlled-open-select-label"
        id="demo-controlled-open-select"
      >
        <MenuItem value={'anatomic'}>
          <Accessibility className={classes.icon} />
          Anotomic Location
        </MenuItem>
        <MenuItem value={'observation'}>
          <Visibility className={classes.icon} />
          Imaging Observation
        </MenuItem>
        {/* <MenuItem value={'history'}>
          <LocalHospital className={classes.icon} />
          {`Clinical hist. & diagnosis`}
        </MenuItem> */}
      </Select>
    </>
  );
}
