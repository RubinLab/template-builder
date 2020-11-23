import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import QuestionItem from './QuestionItem.jsx';

export default function Question(props) {
  const { handleDelete, handleEdit, question, index } = props;
  const [characteristics, setCharacteristics] = useState([]);

  useEffect(() => {
    let char = [];
    const imagingObservationChar =
      props.question.ImagingObservation &&
      props.question.ImagingObservation.ImagingObservationCharacteristic;
    const anatomicEntChar =
      props.question.AnatomicEntity &&
      props.question.AnatomicEntity.AnatomicEntityCharacteristic;
    const anatomicEntObsChar =
      props.question.AnatomicEntity &&
      props.question.AnatomicEntity.ImagingObservationCharacteristic;

    if (imagingObservationChar) {
      char = [
        ...char,
        ...props.question.ImagingObservation.ImagingObservationCharacteristic,
      ];
    }

    if (anatomicEntChar) {
      char = [
        ...char,
        ...props.question.AnatomicEntity.AnatomicEntityCharacteristic,
      ];
    }

    if (anatomicEntObsChar) {
      char = [
        ...char,
        ...props.question.AnatomicEntity.ImagingObservationCharacteristic,
      ];
    }

    setCharacteristics(char);
  }, [props.question]);

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
      characteristics,
      result.source.index,
      result.destination.index
    );
    setCharacteristics(items);
  };

  // TODO if reorder happens, sent the new characteristics
  // to the parent component so it can be updated

  return (
    <Draggable key={question.id} draggableId={question.id} index={index}>
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <QuestionItem
            key={`${question.id}-${index}`}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            question={question}
            index={index}
            level={0}
            handleAnswerLink={props.handleAnswerLink}
            handleQuestionLink={props.handleQuestionLink}
            linkTextMap={props.linkTextMap}
            linkedIdMap={props.linkedIdMap}
            handleDeleteLink={props.handleDeleteLink}
          />
          {characteristics && characteristics.length > 0 && (
            <DragDropContext onDragEnd={handleReorder}>
              <Droppable key={characteristics.id} droppableId={question.id}>
                {provided1 => (
                  <div ref={provided1.innerRef} {...provided1.droppableProps}>
                    {characteristics.map((el, i) => (
                      <Draggable key={el.id} draggableId={el.id} index={i}>
                        {provided2 => (
                          <div
                            ref={provided2.innerRef}
                            {...provided2.draggableProps}
                            {...provided2.dragHandleProps}
                          >
                            <QuestionItem
                              key={`${el.id}-${i}`}
                              handleDelete={handleDelete}
                              handleEdit={handleEdit}
                              question={el}
                              index={i}
                              level={1}
                              handleAnswerLink={props.handleAnswerLink}
                              handleQuestionLink={props.handleQuestionLink}
                              linkTextMap={props.linkTextMap}
                              linkedIdMap={props.linkedIdMap}
                              handleDeleteLink={props.handleDeleteLink}
                              creation={props.creation}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided1.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      )}
    </Draggable>
  );
}

Question.propTypes = {
  handleDelete: PropTypes.func,
  handleEdit: PropTypes.func,
  question: PropTypes.object,
  index: PropTypes.number,
  handleAnswerLink: PropTypes.func,
  handleQuestionLink: PropTypes.func,
  linkTextMap: PropTypes.object,
  linkedIdMap: PropTypes.object,
  handleDeleteLink: PropTypes.func,
  creation: PropTypes.bool,
};
