export interface PaginatedResponseType<T> {
  totalCount: number;
  data: Array<T>;
}
