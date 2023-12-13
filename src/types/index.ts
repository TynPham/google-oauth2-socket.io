export type ResponseData<T> = {
  message: string;
  result: T;
};
export type ResponseDataWithPagination<T> = {
  message: string;
  result: T;
  limit: number;
  page: number;
  total_page: number;
};
