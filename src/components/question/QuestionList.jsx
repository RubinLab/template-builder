import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Question from './Question.jsx';

export default function QuestionsList(props) {
  const [questions, setQuestions] = useState([...props.questions]);
  const { handleDelete, handleEdit } = props;

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
  }, [props.questions, questions]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const handleReorder = result => {
    if (!result.destination) {
      return;
    }
    const items = reorder(
      questions,
      result.source.index,
      result.destination.index
    );
    setQuestions(items);
  };

  return (
    <DragDropContext onDragEnd={handleReorder}>
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
  creation: PropTypes.bool
};
