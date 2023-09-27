import Ajv from 'ajv';
import ajvDraft from 'ajv/lib/refs/json-schema-draft-04.json';
import schema from './AIMTemplate_v2rvStanford_schema.json';

function createID() {
  let uid = `2.25.${Math.floor(1 + Math.random() * 9)}`;
  for (let index = 0; index < 38; index += 1) {
    uid += Math.floor(Math.random() * 10);
  }
  return uid;
}

function createTemplateQuestion(ques, authors, index, characteristic) {
  const {
    questionType,
    explanatoryText,
    id,
    showConfidence,
    requireComment,
    questionTypeTerm
  } = ques;
  // eslint-disable-next-line radix
  const minCardinality = parseInt(ques.minCard);
  // eslint-disable-next-line radix
  const maxCardinality = parseInt(ques.maxCard);

  const component = {
    label: ques.question,
    itemNumber: index,
    authors,
    requireComment,
    explanatoryText,
    minCardinality,
    maxCardinality,
    shouldDisplay: true,
    id
  };
  if (questionTypeTerm) component.QuestionType = questionTypeTerm;

  if (ques.GeometricShape) {
    component.GeometricShape = ques.GeometricShape;
  } else {
    const allowedTerm = ques.selectedTerms
      ? Object.values(ques.selectedTerms).map(el => el.allowedTerm)
      : [];
    component.AllowedTerm = allowedTerm;
  }
  if (questionType === 'anatomic' && !characteristic) {
    component.AnatomicEntity = {
      annotatorConfidence: showConfidence
    };
  } else if (questionType === 'observation' && !characteristic) {
    component.ImagingObservation = {
      annotatorConfidence: showConfidence
    };
  } else if (questionType === 'inference') {
    component.Inference = {
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
    const term = el;
    term.codeMeaning = `${el.codeMeaning}`;
    shapedData[id] = {
      allowedTerm: term,
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

const geometricShapes = {
  Point: 'Point',
  Circle: 'Circle',
  Polyline: 'Polyline',
  Ellipse: 'Ellipse',
  MultiPoint: 'MultiPoint',
  '3DPolygon': '3D Polygon',
  '3DPolyline': '3D Polyline',
  '3DMultiPoint': '3D Multi Point',
  '3DPoint': '3D Point',
  '3DEllipse': '3D Ellipse',
  '3DEllipsoid': '3D Ellipsoid',
  Line: 'Line',
  AnyShape: 'Any Shape',
  AnyClosedShape: 'Any Closed Shape'
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

const updateQuestionMetadata = (key, value, list) => {
  return list.map((el, i) => {
    const newQuestion = { ...el };
    if (key === 'authors') newQuestion[key] = value;
    else if (key === 'itemNumber') newQuestion[key] = i + 1;
    return newQuestion;
  });
};

const validateTemplate = (cont, previousErrors) => {
  const ajv = new Ajv({ schemaId: 'id' });
  ajv.addMetaSchema(ajvDraft);
  const valid = ajv.validate(schema, cont);
  const errors = valid ? [] : ajv.errors;
  const containerExists = cont.TemplateContainer !== undefined;
  const temp = cont.TemplateContainer.Template;
  const templatexists = temp && temp.length > 0;
  const questionExists = temp[0].Component.length > 0;
  const valTemplate =
    previousErrors.length === 0 &&
    errors.length === 0 &&
    containerExists &&
    templatexists;
  return { valTemplate, questionExists, valid, errors };
};

export {
  createTemplateQuestion,
  createID,
  ontologies,
  formAnswerIDFromIndeces,
  getIndecesFromAnswerID,
  shapeSelectedTermData,
  geometricShapes,
  updateQuestionMetadata,
  validateTemplate
};
