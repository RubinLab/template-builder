function createID() {
  const id = Math.random()
    .toString(16)
    .substr(2, 8);
  return id;
}

function createTemplateQuestion(ques, authors) {
  const { questionType, explanatoryText, id, showConfidence } = ques;
  const allowedTerm = ques.selectedTerms
    ? Object.values(ques.selectedTerms).map(el => el.allowedTerm)
    : [];
  const component = {
    label: ques.question,
    // TODO what is itemnumber ??
    // itemNumber: 0,
    authors,
    explanatoryText,
    minCardinality: ques.minCard,
    maxCardinality: ques.maxCard,
    shouldDisplay: true,
    id,
  };

  component.AllowedTerm = allowedTerm;

  if (questionType === 'anatomic') {
    component.AnatomicEntity = {
      annotatorConfidence: showConfidence,
    };
  } else if (questionType === 'observation') {
    component.ImagingObservation = {
      annotatorConfidence: showConfidence,
    };
  } else {
    component.annotatorConfidence = showConfidence;
  }
  return component;
}

export { createTemplateQuestion, createID };
