import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import QuestionForm from './QuestionForm.jsx';
import DetailCreation from './detailsCreation.jsx';
import QuestionList from '../question/QuestionList.jsx';
import { createID, createTemplateQuestion } from '../../utils/helper';

const useStyles = makeStyles(theme => ({
  root: {},
  title: {
    marginBottom: theme.spacing(0),
    paddingBottom: theme.spacing(0)
  },
  button: {
    display: 'block',
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),

    background: '#E3E0D8',
    '&:hover': {
      background: '#CCBC8E'
    }
  },
  checkbox: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(3)
  }
}));

export default function QuestionCreation(props) {
  const classes = useStyles();
  const {
    open,
    templateName,
    handleClose,
    handleSaveQuestion,
    questionID,
    authors,
    index,
    ontology,
    edit,
    templateUID,
    populateLexicon
  } = props;
  const [showDetailCreation, setShowDetailCreation] = useState(false);
  const [details, setDetails] = useState({
    anatomic: [],
    observation: []
  });
  const [question, setQuestion] = useState({});
  const [editPath, setEditPath] = useState(['', null]);
  const [detailsID, setDetailsID] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  const getDetailsFromEdit = () => {
    if (edit) {
      const detailsInEdit = {
        anatomic: [],
        observation: []
      };
      const anatomic = edit.AnatomicEntity;
      if (anatomic) {
        if (anatomic.AnatomicEntityCharacteristic) {
          anatomic.AnatomicEntityCharacteristic.forEach(el => {
            detailsInEdit.anatomic.push(el);
          });
        }
        if (anatomic.ImagingObservationCharacteristic) {
          anatomic.ImagingObservationCharacteristic.forEach(el => {
            detailsInEdit.observation.push(el);
          });
        }
      } else if (
        edit.ObservationEntity &&
        edit.ObservationEntity.ImagingObservationCharacteristic
      ) {
        edit.ObservationEntity.ImagingObservationCharacteristic.forEach(el => {
          detailsInEdit.observation.push(el);
        });
      }
      setDetails(detailsInEdit);
    }
  };

  const handleEdit = i => {
    if (details.anatomic.length > 0 && details.anatomic.length > i) {
      setEditPath(['anatomic', i]);
    } else setEditPath(['observation', i - details.anatomic.length]);
  };

  useEffect(() => {
    getDetailsFromEdit();
  }, [edit]);

  const validateQuestionAttributes = (ques, questionType, char) => {
    const errors = [];
    const invalidMin =
      typeof ques.minCardinality !== 'number' ||
      Number.isNaN(ques.minCardinality);
    const invalidMax =
      typeof ques.maxCardinality !== 'number' ||
      Number.isNaN(ques.maxCardinality);

    if (ques.minCardinality > ques.maxCardinality) {
      errors.push(
        'Minimum cardinaltiy can not be bigger than maximum Cardinality!'
      );
    }
    if (invalidMin || invalidMax) {
      errors.push('Minimum and maximum cardinality fields are both required!');
    }

    if (ques.maxCardinality === 0) {
      errors.push('Maximum Cardinality should be bigger than 0!');
    }

    if (ques.maxCardinality < 0 || ques.minCardinality < 0) {
      errors.push('Cardinality can not be a negative number!');
    }

    if (!ques.label) {
      errors.push('Question text is required!');
    }
    if (!char) {
      if (!questionType) {
        errors.push('Question type is required!');
      }
    }
    errors.map(msg => enqueueSnackbar(msg, { variant: 'error' }));
    return errors.length === 0;
  };

  const handleSaveDetail = detail => {
    const newDetails = { ...details };
    let newDetail;
    let id;
    let valid;
    if (editPath[0]) {
      id = newDetails[editPath[0]][editPath[1]].id;
      newDetail = createTemplateQuestion(
        { ...detail, id },
        authors,
        editPath[1],
        true
      );
      valid = validateQuestionAttributes(newDetail, true, true);
      if (valid) newDetails[editPath[0]][editPath[1]] = newDetail;
      setEditPath(['', null]);
    } else {
      id = detailsID;
      newDetail = { ...detail };
      newDetail.id = id;
      newDetail.questionID = questionID;
      const detailsIndex = details.anatomic.length + details.observation.length;
      newDetail = createTemplateQuestion(
        newDetail,
        authors,
        detailsIndex,
        true
      );
      valid = validateQuestionAttributes(newDetail, true, true);
      if (valid) {
        if (question.questionType === 'anatomic')
          newDetails[detail.questionType].push(newDetail);
        else newDetails.observation.push(newDetail);
      }
    }
    setDetails(newDetails);
    setShowDetailCreation(false);
  };

  const handleSave = () => {
    let updatedQuestion = { ...question };
    updatedQuestion.id = questionID;
    updatedQuestion = createTemplateQuestion(updatedQuestion, authors, index);
    if (
      question.questionType === 'observation' &&
      details.observation.length > 0
    ) {
      updatedQuestion.ImagingObservation.ImagingObservationCharacteristic =
        details.observation;
    }
    if (question.questionType === 'anatomic') {
      if (details.anatomic.length > 0)
        updatedQuestion.AnatomicEntity.AnatomicEntityCharacteristic =
          details.anatomic;
      if (details.observation.length > 0)
        updatedQuestion.AnatomicEntity.ImagingObservationCharacteristic =
          details.observation;
    }
    const valid = validateQuestionAttributes(
      updatedQuestion,
      question.questionType
    );
    if (valid) {
      setQuestion(updatedQuestion);
      handleSaveQuestion(updatedQuestion);
      handleClose(false);
    }
  };

  const handleDelete = (quesIndex, id) => {
    const newDetails = _.cloneDeep(details);
    const len = newDetails.anatomic.length;
    const ana = newDetails.anatomic;
    const obs = newDetails.observation;
    if (len > 0 && len > quesIndex && id === ana[quesIndex].id) {
      newDetails.anatomic.splice(quesIndex, 1);
    } else if (
      obs.length > 0 &&
      quesIndex >= len &&
      id === obs[quesIndex - len].id
    ) {
      newDetails.observation.splice(quesIndex - len, 1);
    }
    setDetails(newDetails);
  };

  const showCharCreateButton =
    edit ||
    question.questionType === 'anatomic' ||
    question.questionType === 'observation';

  const renumberDetails = detailsList => {
    return detailsList.map((el, i) => {
      const newItem = { ...el };
      newItem.itemNumber = i + 1;
      return newItem;
    });
  };

  return (
    <React.Fragment>
      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={open}
        className={classes.root}
        onClose={() => handleClose(false)}
        scroll="body"
      >
        <DialogTitle id="createQuestion-title" className={classes.title}>
          Create Question
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Fill the form and save to add a new question to the template ${templateName}`}
          </DialogContentText>
          <QuestionForm
            postQuestion={q => {
              // console.log(q);
              setQuestion(q);
            }}
            ontology={ontology}
            edit={edit}
            authors={authors}
            templateName={templateName}
            templateUID={templateUID}
            questionID={questionID}
            populateLexicon={populateLexicon}
          />

          {showCharCreateButton && (
            <Button
              variant="outlined"
              className={classes.button}
              onClick={() => {
                setDetailsID(createID());
                setShowDetailCreation(true);
              }}
            >
              Add Characteristics
            </Button>
          )}

          {(details.anatomic.length > 0 || details.observation.length > 0) && (
            <QuestionList
              questions={[...details.anatomic, ...details.observation]}
              creation={true}
              handleDelete={handleDelete}
              characteristics={details}
              getDetails={newDetails => {
                const observation = renumberDetails(newDetails.observation);
                const anatomic = renumberDetails(newDetails.anatomic);
                setDetails({ observation, anatomic });
              }}
              handleEdit={(e, i) => {
                setShowDetailCreation(true);
                handleEdit(i);
              }}
            />
          )}
          {showDetailCreation && (
            <DetailCreation
              open={showDetailCreation}
              handleClose={bool => {
                setShowDetailCreation(bool);
                setDetailsID('');
                setEditPath(['', null]);
              }}
              handleSave={handleSaveDetail}
              setQuestion={setQuestion}
              authors={authors}
              characteristic={question.questionType || editPath[0]}
              ontology={ontology}
              edit={editPath[0] ? details[editPath[0]][editPath[1]] : null}
              detailEdit={editPath}
              templateName={templateName}
              templateUID={templateUID}
              questionID={questionID}
              UID={detailsID}
              populateLexicon={populateLexicon}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

QuestionCreation.propTypes = {
  open: PropTypes.bool,
  templateName: PropTypes.string,
  handleClose: PropTypes.func,
  handleSaveQuestion: PropTypes.func,
  questionID: PropTypes.string,
  authors: PropTypes.string,
  index: PropTypes.number,
  ontology: PropTypes.string,
  edit: PropTypes.object,
  templateUID: PropTypes.string,
  populateLexicon: PropTypes.fun
};
