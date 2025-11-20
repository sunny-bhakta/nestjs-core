import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  getCommonData() {
    return { message: 'Common data' };
  }
}

