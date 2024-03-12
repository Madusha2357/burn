import {
  ICreateQuestionDto,
  RecordStatus,
  IUpdateQuestionDto,
  Choice,
  QuestionType,
} from '@damen/models';

const choicesMap: Choice[] = [
  { _id: 'a', text: "'10kmph'", correctAnswer: false },
  { _id: 'b', text: "'20kmph'", correctAnswer: false },
  { _id: 'c', text: "'5kmph'", correctAnswer: true },
  { _id: 'd', text: "'12kmph'", correctAnswer: false },
];

const choicesMapLatest: Choice[] = [
  { _id: 'a', text: "'10kmph'", correctAnswer: false },
  { _id: 'b', text: "'11kmph'", correctAnswer: false },
  { _id: 'c', text: "'12kmph'", correctAnswer: true },
  { _id: 'd', text: "'13kmph'", correctAnswer: false },
];

export const QUIZ_ID_FOR_QUESTION = '63bfe1b80410a10ac9e6ca6d';
export const INVALID_QUIZ_ID_FOR_QUESTION = '54bfe1b80410a10ac9e6ca6d';

export const QUESTION_DOCUMENT_RESPONSE = {
  createdBy: 'user@gmail.com',
  text: 'what is your speed?',
  videoUrl: '/api/status.url',
  choices: [
    { text: '10kmph' },
    { text: '20kmph' },
    { text: '5kmph' },
    { text: '12kmph' },
  ],
  isMultipleChoice: false,
  timerInSeconds: 60,
  displayOrder: 1,
  status: 'Active',
  quiz: QUIZ_ID_FOR_QUESTION,
  _id: '63c289c4d3a8f1ae3527359f',
  createdAt: '2023-01-14T10:53:56.987Z',
  updatedAt: '2023-01-14T10:53:56.987Z',
};

export const QUESTION_CREATE_DTO: ICreateQuestionDto = {
  type: QuestionType.SINGLE_CHOICE,
  text: 'what is your speed?',
  videoUrl: '/api/status.url',
  image: '11',
  imageMobile: '12',
  choices: choicesMap,
  isMultipleChoice: false,
  timerInSeconds: 30,
  displayOrder: 1,
  status: RecordStatus.ACTIVE,
  quiz: {
    _id: QUIZ_ID_FOR_QUESTION,
  },
};

export const QUESTION_UPDATE_DTO_TEXT: IUpdateQuestionDto = {
  text: 'what is your goood speed?',
};

export const QUESTION_UPDATE_DTO_VIDEOURL: IUpdateQuestionDto = {
  videoUrl: '/api/status_new.url',
};

export const QUESTION_UPDATE_DTO_CHOICES: IUpdateQuestionDto = {
  choices: choicesMapLatest,
};

// export const QUESTION_UPDATE_DTO_CORRECR_ANSWER: IUpdateQuestionDto = {
//   correctAnswer: 'c',
// };

export const QUESTION_UPDATE_DTO_TIME_IN_SEC: IUpdateQuestionDto = {
  timerInSeconds: 20,
};

export const QUESTION_UPDATE_DTO_START_DISPLAY_ORDER: IUpdateQuestionDto = {
  displayOrder: 2,
};

export const INVALID_QUESTION_DOCUMENT = {
  id: '63bfe1b80410a10ac9e6ca6d',
};

export const QUESTION_PAGE_1_DATA = {
  data: [],
  page: {
    length: 7,
    pageIndex: 1,
    pageSize: 5,
  },
};
