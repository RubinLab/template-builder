import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useSnackbar } from 'notistack';
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

const QuantificationDialog = props => {
  const [value, setValue] = React.useState('Scale');
  const [name, setName] = React.useState('');
  const [annotatorConfidence, setAnnotatorConfidence] = React.useState(false);
  const [quantification, setQuantification] = React.useState([]);
  const [lastScaleType, setLastScaleType] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const getQuantificationInput = (obj, type) => {
    const result = [...quantification];
    const lastIndex = quantification.length
      ? quantification.length - 1
      : quantification.length;
    const keys = Object.keys(obj);
    const values = Object.values(obj);
    const item = {};
    values.forEach((el, i) => {
      if (el && keys[i] !== 'scaleType') item[keys[i]] = el;
    });

    if (type === 'Scale') {
      // if last scaleType and last item in the array is Scale
      if (
        lastScaleType === obj.scaleType &&
        quantification[lastIndex] &&
        quantification[lastIndex].Scale &&
        quantification[lastIndex].name === name
      ) {
        // push the object to ScaleLevel attribute of the last item in the array
        result[lastIndex].Scale.ScaleLevel.push(item);
      } else {
        // if not create a new scale quantification
        // set the scale type to new scale type
        const newScale = {
          name,
          annotatorConfidence,
          Scale: {
            scaleType: obj.scaleType,
            ScaleLevel: [item]
          }
        };
        result.push(newScale);
        setLastScaleType(obj.scaleType);
      }
    } else if (
      quantification[lastIndex] &&
      quantification[lastIndex][type] &&
      quantification[lastIndex].name === name
    ) {
      result[lastIndex][type].push(item);
    } else {
      const quant = {
        name,
        annotatorConfidence,
        [type]: [item]
      };
      result.push(quant);
      setLastScaleType('');
    }

    setQuantification(result);
    return result;
  };

  const renderForm = () => {
    switch (value) {
      case 'Scale': {
        return (
          <Scale
            postFormInput={getQuantificationInput}
            setNewScaleType={setLastScaleType}
            validateName={() => setSubmitted(true)}
            name={name}
          />
        );
      }
      case 'Numerical': {
        return (
          <Numerical
            postFormInput={getQuantificationInput}
            validateName={() => setSubmitted(true)}
            name={name}
          />
        );
      }
      case 'Interval': {
        return (
          <Interval
            postFormInput={getQuantificationInput}
            validateName={() => setSubmitted(true)}
            name={name}
          />
        );
      }
      case 'Quantile': {
        return (
          <Quantile
            postFormInput={getQuantificationInput}
            validateName={() => setSubmitted(true)}
            name={name}
          />
        );
      }
      case 'NonQuantifiable': {
        return (
          <NonQuantifiable
            postFormInput={getQuantificationInput}
            handleBioportalSearch={props.handleBioportalSearch}
            ontologyLibs={props.ontologyLibs}
            handleSearchInput={props.handleSearchInput}
            handleOntologyInput={props.handleOntologyInput}
            saveTerm={props.saveTerm}
            searchTerm={props.searchTerm}
            getUploadedTerms={props.getUploadedTerms}
            ontology={props.ontology}
            searchStatus={props.searchStatus}
            nonquantifiableTerm={props.nonquantifiableTerm}
            clearSearchTerm={props.clearSearchTerm}
            validateName={() => setSubmitted(true)}
            name={name}
          />
        );
      }
      default:
        return (
          <Scale
            postFormInput={getQuantificationInput}
            validateName={() => setSubmitted(true)}
            name={name}
          />
        );
    }
  };

  const handleDone = () => {
    if (!name) {
      enqueueSnackbar('Please fill the required fields!', { variant: 'error' });
      setSubmitted(true);
    } else {
      props.saveQuantification(quantification);
      setSubmitted(false);
      setName('');
    }
  };

  return (
    <Dialog open={props.open}>
      <DialogContent>
        <FormControl className={classes.formControl}>
          <TextField
            // className={classes.textField}
            value={name}
            label="Quantification Name"
            name="name"
            onChange={e => setName(e.target.value)}
            required
            error={!name && submitted}
          />
          <InputLabel>Quantification type:</InputLabel>
          <Select
            onChange={e => {
              setValue(e.target.value);
              props.clearSearchTerm();
            }}
            value={value}
            label="Qantification Type"
          >
            <option value={'Scale'}>Scale</option>
            <option value={'Numerical'}>Numerical</option>
            <option value={'Interval'}>Interval</option>
            <option value={'Quantile'}>Quantile</option>
            <option value={'NonQuantifiable'}>NonQuantifiable</option>
          </Select>

          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                name="annotatorConfidence"
                checked={annotatorConfidence}
                onChange={e => setAnnotatorConfidence(e.target.checked)}
              />
            }
            label="Annotator Confidence"
            labelPlacement="end"
          />
          {renderForm()}
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            props.onCancel();
            setName('');
            setSubmitted(false);
          }}
          color="secondary"
        >
          Cancel
        </Button>
        <Button onClick={handleDone} color="primary">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuantificationDialog;

QuantificationDialog.propTypes = {
  saveQuantification: PropTypes.func,
  open: PropTypes.bool,
  handleBioportalSearch: PropTypes.func,
  ontologyLibs: PropTypes.object,
  handleSearchInput: PropTypes.func,
  handleOntologyInput: PropTypes.func,
  searchTerm: PropTypes.string,
  saveTerm: PropTypes.func,
  getUploadedTerms: PropTypes.func,
  ontology: PropTypes.string,
  searchStatus: PropTypes.object,
  nonquantifiableTerm: PropTypes.object,
  clearSearchTerm: PropTypes.func,
  onCancel: PropTypes.func
};
