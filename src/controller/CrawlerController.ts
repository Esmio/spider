import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

import { controller, use, get } from '../decorator';
import Crawler from '../utils/crawler';
import Analyzer from '../utils/analyzer';
import { getResponseData } from '../utils/util';

interface BodyRequest extends Request {
  body: { [key: string]: string | undefined };
}

const checkLogin = (
  req: BodyRequest,
  res: Response,
  next: NextFunction
): void => {
  const isLogin = !!(req.session ? req.session.login : false);
  console.log('checkLogin middleware');
  if (isLogin) {
    next();
  } else {
    res.json(getResponseData(null, '清先登录'));
  }
};

const test = (req: BodyRequest, res: Response, next: NextFunction): void => {
  console.log('test middleware');
  next();
};

@controller('/')
export class CrawlerController {
  @get('/getData')
  @use(checkLogin)
  @use(test)
  getData(req: BodyRequest, res: Response): void {
    const secret = 'x3b174jsx';
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const analyzer = Analyzer.getInstance();
    new Crawler(url, analyzer);
    res.json(getResponseData(true));
  }

  @get('/showData')
  @use(checkLogin)
  showData(req: BodyRequest, res: Response): void {
    try {
      const position = path.resolve(__dirname, '../../data/course.json');
      const result = fs.readFileSync(position, 'utf-8');
      res.json(getResponseData(JSON.parse(result)));
    } catch (e) {
      res.json(getResponseData(false, '尚未爬取到内容'));
    }
  }
}
