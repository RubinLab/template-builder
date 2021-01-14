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

const QuantificationDialog = props => {
  const [value, setValue] = React.useState('Scale');
  const [annotatorConfidence, setAnnotatorConfidence] = React.useState(false);
  const [quantification, setQuantification] = React.useState([]);
  const [lastScaleType, setLastScaleType] = React.useState('');

  //   const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();

  const getQuantificationInput = (obj, type) => {
    let result = [...quantification];
    const lastIndex = quantification.length
      ? quantification.length - 1
      : quantification.length;
    const keys = Object.keys(obj);
    const values = Object.values(obj);
    const item = {};
    values.forEach((el, i) => {
      if (el && keys[i] !== 'scaleType') item[keys[i]] = el;
    });
    switch (type) {
      case 'Scale': {
        // if last scaleType and last item in the array is Scale
        if (
          lastScaleType === obj.scaleType &&
          quantification[lastIndex] &&
          quantification[lastIndex].Scale
        ) {
          // push the object to ScaleLevel attribute of the last item in the array
          result[lastIndex].Scale.ScaleLevel.push(item);
        } else {
          // if not
          // create a new scale quantification
          // set the scale type to
          const newScale = {
            name: `scale${obj.scaleType}CharacteristicQuantification`,
            characteristicQuantificationIndex: props.index,
            annotatorConfidence,
            Scale: {
              scaleType: obj.scaleType,
              ScaleLevel: [item]
            }
          };
          result.push(newScale);
          setLastScaleType(obj.scaleType);
        }
        break;
      }
      case 'Numerical': {
        if (quantification[lastIndex] && quantification[lastIndex].Numerical) {
          result[lastIndex].Numerical.push(item);
        } else {
          const newNumerical = {
            name: `NumericalCharacteristicQuantification`,
            characteristicQuantificationIndex: props.index,
            annotatorConfidence,
            Numerical: [item]
          };
          result.push(newNumerical);
          setLastScaleType('');
        }
        // empty last scale type
        break;
      }
      case 'Interval': {
        if (quantification[lastIndex] && quantification[lastIndex].Interval) {
          result[lastIndex].Interval.push(item);
        } else {
          const newInterval = {
            name: `IntervalCharacteristicQuantification`,
            characteristicQuantificationIndex: props.index,
            annotatorConfidence,
            Interval: [item]
          };
          // empty last scale type
          result.push(newInterval);
          setLastScaleType('');
        }
        break;
      }
      case 'Quantile': {
        if (quantification[lastIndex] && quantification[lastIndex].Interval) {
          result[lastIndex].Interval.push(item);
        } else {
          const newQuantile = {
            name: `QuantileCharacteristicQuantification`,
            characteristicQuantificationIndex: props.index,
            annotatorConfidence,
            Quantile: [item]
          };
          // empty last scale type
          result.push(newQuantile);
          setLastScaleType('');
        }
        break;
      }
      case 'NonQuantifiable': {
        result = {
          name: `NonQuantifiableCharacteristicQuantification`,
          characteristicQuantificationIndex: props.index,
          annotatorConfidence
        };
        // empty last scale type
        setLastScaleType('');

        break;
      }
      default:
        return result;
    }
    // props.saveQuantification(result);
    setQuantification(result);
    return result;
    // props.saveCalculation();
  };

  const renderForm = () => {
    switch (value) {
      case 'Scale': {
        return (
          <Scale
            postFormInput={getQuantificationInput}
            setNewScaleType={setLastScaleType}
          />
        );
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
    <Dialog open={props.open}>
      <DialogContent>
        <FormControl className={classes.formControl}>
          <InputLabel>Quantification type:</InputLabel>
          <Select
            onChange={e => setValue(e.target.value)}
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
          onClick={() => props.saveQuantification(quantification)}
          color="primary"
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuantificationDialog;

QuantificationDialog.propTypes = {
  saveQuantification: PropTypes.func,
  index: PropTypes.number,
  onCancel: PropTypes.func,
  open: PropTypes.bool,

  handleBioportalSearch: PropTypes.func,
  ontologyLibs: PropTypes.object,
  handleSearchInput: PropTypes.func,
  handleOntologyInput: PropTypes.func,
  searchTerm: PropTypes.string,
  saveTerm: PropTypes.func,
  getUploadedTerms: PropTypes.func,
  ontology: PropTypes.string,
  searchStatus: PropTypes.object
};
