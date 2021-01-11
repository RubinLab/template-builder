import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
// import { useSnackbar } from 'notistack';
import NonQuantifiable from './NonQuantifiable.jsx';
import Interval from './Interval.jsx';
import Numerical from './Numerical.jsx';
import Quantile from './Quantile.jsx';
import Scale from './Scale.jsx';

const useStyles = makeStyles(theme => ({
  accordionRoot: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightBold
  },
  searchButton: {
    width: 'fit-content',
    background: '#E3E0D8',
    height: 'fit-content',
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1),
    '&:hover': {
      background: '#CCBC8E'
    }
  }
}));

const QuantificationWrap = props => {
  const [value, setValue] = React.useState('Scale');
  //   const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const getQuantificationInput = type => {
    console.log(' got it!!', type);
  };

  const renderForm = () => {
    switch (value) {
      case 'Scale': {
        return <Scale postFormInput={getQuantificationInput} />;
      }
      case 'Numerical': {
        return <Numerical postFormInput={getQuantificationInput} />;
      }
      case 'Interval': {
        return <Interval postFormInput={getQuantificationInput} />;
      }
      case 'Quantile': {
        return <Quantile postFormInput={getQuantificationInput} />;
      }
      case 'NonQuantifiable': {
        return <NonQuantifiable postFormInput={getQuantificationInput} />;
      }
      default:
        return <Scale postFormInput={getQuantificationInput} />;
    }
  };

  return (
    <FormControl className={classes.formControl}>
      <InputLabel>Quantification type:</InputLabel>
      <Select onChange={e => setValue(e.target.value)} value={value}>
        <option value={'Scale'}>Scale</option>
        <option value={'Numerical'}>Numerical</option>
        <option value={'Interval'}>Interval</option>
        <option value={'Quantile'}>Quantile</option>
        <option value={'NonQuantifiable'}>NonQuantifiable</option>
      </Select>
      {renderForm()}
    </FormControl>
  );
};

export default QuantificationWrap;

QuantificationWrap.propTypes = {
  saveCalculation: PropTypes.func
};
