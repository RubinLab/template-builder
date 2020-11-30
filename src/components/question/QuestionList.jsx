import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useSnackbar } from 'notistack';

import Question from './Question.jsx';

export default function QuestionsList(props) {
  const [questions, setQuestions] = useState([...props.questions]);
  const {
    handleDelete,
    handleEdit,
    getList,
    characteristics,
    getDetails
  } = props;

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const newList = [...questions];
    const newLength = props.questions.length;
    const diff = newLength - questions.length;
    if (diff !== 0) {
      if (diff > 0) {
        for (let i = 1; i <= diff; i += 1) {
          newList.push({ ...props.questions[newLength - i] });
        }
        setQuestions(newList);
      } else {
        setQuestions([...props.questions]);
      }
    }
    if (!_.isEqual(props.questions, questions)) {
      setQuestions([...props.questions]);
    }
  }, [props.questions]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  function handleReorder(...args) {
    const result = args[0];
    const char = args[2];
    if (!result.destination) {
      return;
    }
    const start = result.source.index;
    const end = result.destination.index;
    // if charLengths both bigger than 0
    // source index and destination indexes both
    // must be in the same charsset
    let anaLen;
    let obsLen;
    if (char) {
      anaLen = char.anatomic.length;
      obsLen = char.observation.length;
      if (anaLen > 0 && obsLen > 0) {
        const areSameType =
          start < anaLen ? end < anaLen : start >= anaLen && end >= anaLen;
        if (!areSameType) {
          enqueueSnackbar(
            'Only same type of characteristics can be reordered!',
            { variant: 'error' }
          );
          return;
        }
      }
    }
    const items = reorder([...questions], start, end);
    setQuestions(items);
    if (char) {
      const newChar = { ...char };
      newChar.anatomic = items.slice(0, anaLen);
      newChar.observation = items.slice(anaLen);
      getDetails(newChar);
    } else getList(items);
  }

  return (
    <DragDropContext
      onDragEnd={(...args) => handleReorder(...args, characteristics)}
    >
      <Droppable key={1} droppableId={`${1}`}>
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {questions.map((item, index) => (
              <Question
                key={`${item.id}-${index}`}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
                question={item}
                index={index}
                handleAnswerLink={props.handleAnswerLink}
                handleQuestionLink={props.handleQuestionLink}
                linkTextMap={props.linkTextMap}
                linkedIdMap={props.linkedIdMap}
                handleDeleteLink={props.handleDeleteLink}
                creation={props.creation}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

QuestionsList.propTypes = {
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  questions: PropTypes.array,
  handleAnswerLink: PropTypes.func,
  handleQuestionLink: PropTypes.func,
  linkTextMap: PropTypes.object,
  linkedIdMap: PropTypes.object,
  handleDeleteLink: PropTypes.func,
  creation: PropTypes.bool,
  getList: PropTypes.func,
  characteristics: PropTypes.object,
  getDetails: PropTypes.func
};
