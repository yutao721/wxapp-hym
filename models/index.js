import * as I from '../config/index';
import { Http } from '../lib/http';

const app = getApp();

export class Index extends Http {
  constructor() {
    super();
  }

  getList(data) {
    return this.request(I.getList, 'GET', data);
  }

  getDetail(data) {
    return this.request(I.getDetail, 'GET', data);
  }

}
