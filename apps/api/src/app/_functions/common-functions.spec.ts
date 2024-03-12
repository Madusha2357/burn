import { NotFoundException } from '@nestjs/common';
import { QUIZ_DOCUMENT_RESPONSE } from '@damen/stubs';
import { checkForNoRecordFound } from './common-functions';

describe('check For No RecordFound', () => {
  it('should throw an error for empty response', () => {
    expect(() => checkForNoRecordFound('')).toThrowError(NotFoundException);
  });

  it('should throw an error for null response', () => {
    expect(() => checkForNoRecordFound(null)).toThrowError(NotFoundException);
  });

  it('should return the input for valid object', () => {
    const response = checkForNoRecordFound(QUIZ_DOCUMENT_RESPONSE);
    expect(response).toEqual(QUIZ_DOCUMENT_RESPONSE);
  });
});
