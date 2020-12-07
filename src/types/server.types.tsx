export interface ServerError {
  response: {
    status: number;
    data: any;
    message: string;
  };
}
