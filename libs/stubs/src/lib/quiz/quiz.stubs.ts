import { ICreateQuizDto, RecordStatus, UpdateQuizDto } from '@damen/models';

export const QUIZ_DOCUMENT_RESPONSE = {
  _id: '63bfe1b80410a10ac9e6ca6d',
  createdBy: 'user@gmail.com',
  name: 'Quiz six',
  startTime: '2022-12-30T18:27:36.526Z',
  endTime: '2022-12-30T18:27:36.526Z',
  status: RecordStatus.ACTIVE,
  minimalAnswerCountForWinning: 16,
  questions: [],
  createdAt: '2023-01-12T10:32:24.263Z',
  updatedAt: '2023-01-13T11:36:01.715Z',
};

export const QUIZ_CREATE_DTO: ICreateQuizDto = {
  name: 'Quiz six',
  startTime: new Date('2022-12-30T18:27:36.526Z'),
  endTime: new Date('2022-12-30T18:27:36.526Z'),
  status: RecordStatus.ACTIVE,
  minimalAnswerCountForWinning: 15,
};

export const QUIZ_UPDATE_DTO_NAME: UpdateQuizDto = {
  name: 'Quiz Name Update',
};

export const QUIZ_UPDATE_DTO_START_DATE: UpdateQuizDto = {
  startTime: new Date('2022-01-30T18:27:36.526Z'),
};

export const QUIZ_UPDATE_DTO_END_DATE: UpdateQuizDto = {
  endTime: new Date('2023-12-30T18:27:36.526Z'),
};

export const QUIZ_UPDATE_DTO_STATUS_ACTIVE: UpdateQuizDto = {
  status: RecordStatus.ACTIVE,
};

export const QUIZ_UPDATE_DTO_STATUS_INACTIVE: UpdateQuizDto = {
  status: RecordStatus.INACTIVE,
};

export const QUIZ_UPDATE_DTO_START_WIN_COUNT: UpdateQuizDto = {
  minimalAnswerCountForWinning: 6,
};

export const INVALID_DOCUMENT = {
  id: '63bfe1b80410a10ac9e6ca6d',
};

export const QUIZ_PAGE_1_DATA = {
  data: [],
  page: {
    length: 7,
    pageIndex: 1,
    pageSize: 5,
  },
};
