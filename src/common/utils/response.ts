export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  data?: null;
};

export const success = <T>(
  data: T,
  message: string = 'Success',
): ApiSuccessResponse<T> => {
  return {
    data,
    message,
    success: true,
  };
};

export const error = (message: string = 'Error'): ApiErrorResponse => {
  return {
    data: null,
    message,
    success: false,
  };
};
