import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import QuestionItem from './QuestionItem.jsx';

export default function Question(props) {
  const { handleDelete, handleEdit, handleLink, question, index } = props;
  const { chracteristics } = question;
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
            handleLink={handleLink}
            question={question}
            index={index}
            level={0}
          />
          {chracteristics && chracteristics.length > 0 && (
            <DragDropContext>
              <Droppable
                key={chracteristics.id}
                droppableId={chracteristics.id}
              >
                {provided1 => (
                  <div
                    ref={provided1.innerRef}
                    // style={getListStyle(snapshot.isDraggingOver)}
                    {...provided1.droppableProps}
                  >
                    {chracteristics.map((el, i) => (
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
                              handleLink={handleLink}
                              question={el}
                              index={i}
                              level={1}
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
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  question: PropTypes.object,
  handleLink: PropTypes.func,
  index: PropTypes.number,
};
