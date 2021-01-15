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
    id
  };

  component.AllowedTerm = allowedTerm;

  if (questionType === 'anatomic' && !characteristic) {
    component.AnatomicEntity = {
      annotatorConfidence: showConfidence
    };
  } else if (questionType === 'observation' && !characteristic) {
    component.ImagingObservation = {
      annotatorConfidence: showConfidence
    };
  } else {
    component.annotatorConfidence = showConfidence;
  }
  return component;
}

const shapeSelectedTermData = data => {
  const shapedData = {};
  data.forEach(el => {
    const id = createID();
    shapedData[id] = {
      allowedTerm: el,
      title: el.codingSchemeDesignator,
      id
    };
  });
  return shapedData;
};

const ontologies = {
  ICD10: {
    name: `International Classification of Diseases, Version 10`,
    acronym: `ICD10`
  },
  RADLEX: { name: `Radiology Lexicon`, acronym: `RADLEX` },
  NCIT: { name: `National Cancer Institute Thesaurus`, acronym: `NCIT` },
  SNOMEDCT: { name: `SNOMED CT`, acronym: `SNOMEDCT` }
};

function formAnswerIDFromIndeces(
  questionIndex,
  answerIndex,
  codeValue,
  charIndex,
  scaleIndex
) {
  let answerID = `${questionIndex}-${answerIndex}-${codeValue}`;
  answerID = charIndex ? `${answerID}/${charIndex}` : answerID;
  answerID = scaleIndex ? `${answerID}/${scaleIndex}` : answerID;
  return answerID;
}

function getIndecesFromAnswerID(answerID) {
  const indeces = answerID.split('-');
  const charIndeces = answerID.split('/');
  const questionIndex = parseInt(indeces[0], 10);
  const answerIndex = parseInt(indeces[1], 10);
  const charIndex =
    charIndeces.length > 1 ? parseInt(charIndeces[1], 10) : null;
  const scaleIndex =
    charIndeces.length > 2 ? parseInt(charIndeces[2], 10) : null;
  return {
    questionIndex,
    answerIndex,
    charIndex,
    scaleIndex
  };
}

export {
  createTemplateQuestion,
  createID,
  ontologies,
  formAnswerIDFromIndeces,
  getIndecesFromAnswerID,
  shapeSelectedTermData
};
