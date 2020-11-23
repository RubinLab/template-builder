function createID() {
  let uid = `2.25.${Math.floor(1 + Math.random() * 9)}`;
  for (let index = 0; index < 38; index += 1) {
    uid += Math.floor(Math.random() * 10);
  }
  return uid;
}

function createTemplateQuestion(ques, authors, index, characteristic) {
  const { questionType, explanatoryText, id, showConfidence } = ques;
  // eslint-disable-next-line radix
  const minCardinality = parseInt(ques.minCard);
  // eslint-disable-next-line radix
  const maxCardinality = parseInt(ques.maxCard);
  const allowedTerm = ques.selectedTerms
    ? Object.values(ques.selectedTerms).map(el => el.allowedTerm)
    : [];
  const component = {
    label: ques.question,
    itemNumber: index,
    authors,
    explanatoryText,
    minCardinality,
    maxCardinality,
    shouldDisplay: true,
    id,
  };

  component.AllowedTerm = allowedTerm;

  if (questionType === 'anatomic' && !characteristic) {
    component.AnatomicEntity = {
      annotatorConfidence: showConfidence,
    };
  } else if (questionType === 'observation' && !characteristic) {
    component.ImagingObservation = {
      annotatorConfidence: showConfidence,
    };
  } else {
    component.annotatorConfidence = showConfidence;
  }
  return component;
}

export { createTemplateQuestion, createID };
