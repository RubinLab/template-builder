import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Question from './Question.jsx';

export default function QuestionsList(props) {
  const [questions, setQuestions] = useState([...props.questions]);
  const { handleDelete, handleEdit, handleLink } = props;

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

  // const handleReorder = ({ oldIndex, newIndex }) => {};
  // const getListStyle = isDraggingOver => ({
  //   background: isDraggingOver ? 'lightblue' : 'lightgrey',
  //   padding: 8,
  //   width: 250,
  // });

  return (
    <DragDropContext>
      <Droppable key={1} droppableId={`${1}`}>
        {provided => (
          <div
            ref={provided.innerRef}
            // style={getListStyle(snapshot.isDraggingOver)}
            {...provided.droppableProps}
          >
            {questions.map((item, index) => (
              <Question
                key={`${item.id}-${index}`}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
                handleLink={handleLink}
                question={item}
                index={index}
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
  handleLink: PropTypes.func,
};
