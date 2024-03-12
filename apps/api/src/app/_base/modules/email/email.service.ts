import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { compile } from 'handlebars';
import { User } from '../../../user/schema/user.schema';
@Injectable()
export class EmailService {
  constructor(private readonly httpService: HttpService) {}

  createInvitationEmailForUser(user: User) {
    const path = this.getTemplatedPath('invitation.hbs');
    const template = this.readFile(path);
    const { registerCode, email } = user;
    const html = template({ registerCode: registerCode.split(''), email });
  }

  readFile(filePath: string) {
    const templateStr = readFileSync(filePath).toString('utf8');
    return compile(templateStr, { noEscape: true });
  }

  getTemplatedPath(fileName: string): string {
    return resolve(`${__dirname}/templates/${fileName}`);
  }
}
