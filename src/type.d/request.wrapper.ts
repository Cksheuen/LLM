export interface RequestResponse<D> {
  data: D;
  requestId: string;
}

export interface RequestError {
  code: number;
  message: string;
}

export interface ServiceBase<R, B> {
  response: R;
  Body: B;
  Error: RequestError;
}

export type ServiceAPI = string;

export interface IConfig {
  title: string;
  logo: string;
  [key: string]: string;
}

type DataAttributeKey = `data-${string}`;

export interface HTMLAttributes extends React.HTMLAttributes<any> {
  [dataAttribute: DataAttributeKey]: any;
}
export interface CommonResponse<T> {
  data: T;
  message: string;
  code: number;
  error: Array<string>;
}
