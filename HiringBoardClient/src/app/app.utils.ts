import { HttpParams } from '@angular/common/http';

export function toHttpParams(paramsObject: { [key: string]: any }): HttpParams {
  let params = new HttpParams();

  Object.keys(paramsObject).forEach((key) => {
    const value = paramsObject[key];
    if (!value) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => {
        params = params.append(key, item);
      });
      return;
    }
    params = params.set(key, value);
  });

  return params;
}
