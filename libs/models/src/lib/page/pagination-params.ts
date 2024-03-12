import { SortOrder } from 'mongoose';
/**
 * This class will contain the two parameters which required for the pagination
 * skip : the number of page needs to retrieve
 * limit: page size
 */

//TODO: set individual variables
export const DEFAULT_SKIP = 0;
export const DEFAULT_LIMIT = 100;
export const DEFAULT_PROJECTION = 'data-table';
export const DEFAULT_SORT_BY_FIELD = 'createdAt';
export const DEFAULT_ORDER: SortOrder = 'desc';

//set constants for question schema specific
export const QUESTION_SORT_BY_FIELD = 'displayOrder';
export const QUESTION_ORDER: SortOrder = 'asc';
