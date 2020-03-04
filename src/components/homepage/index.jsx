import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';

const materialUseStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2),
    width: 300,
  },
  form: {
    margin: theme.spacing(2),
    width: 300,
  },
  container: {
    direction: 'column',
  },
  textField: {
    marginTop: theme.spacing(3),
    minWidth: 300,
  },
  button: {
    display: 'block',
    marginTop: theme.spacing(2),
  },
  formControl: {
    marginTop: theme.spacing(3),
    minWidth: 150,
  },
}));

export default function homePage() {
  const classes = materialUseStyles();

  return (
    <div className={classes.root}>
      <Grid>
        <form className={classes.form} noValidate autoComplete="off">
          <TextField
            className={classes.textField}
            id="standard-basic"
            label="Template Name"
          />
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-controlled-open-select-label">
              Template Level
            </InputLabel>
            <Select
              labelId="demo-controlled-open-select-label"
              id="demo-controlled-open-select"
              //   open={open}
              //   onClose={handleClose}
              //   onOpen={handleOpen}
              //   value={age}
              //   onChange={handleChange}
            >
              <MenuItem value={'study'}>Study</MenuItem>
              <MenuItem value={'series'}>Series</MenuItem>
              <MenuItem value={'image'}>Image</MenuItem>
            </Select>
          </FormControl>
        </form>
      </Grid>
    </div>
  );
}
