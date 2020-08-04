import * as cheerio from 'cheerio';
import * as fs from 'fs';
import { Analyzer } from './crawler';

interface Course {
  title: string;
  count: number;
}

interface CourseResult {
  time: number;
  data: Course[];
}

interface Content {
  [propsName: number]: Course[];
}

export default class DellAnalyzer implements Analyzer {
  private static instance: DellAnalyzer;

  static getInstance() {
    if (!DellAnalyzer.instance) {
      DellAnalyzer.instance = new DellAnalyzer();
    }
    return DellAnalyzer.instance;
  }

  private getCourseInfo(html: string) {
    const $ = cheerio.load(html);
    const courseItems = $('.course-item');
    const courseInfo: Course[] = [];
    courseItems.map((index, element) => {
      const desc = $(element).find('.course-desc');
      const title = desc.eq(0).text();
      const count = parseInt(desc.eq(1).text().split('：')[1]);
      courseInfo.push({
        title,
        count,
      });
    });
    return {
      time: new Date().getTime(),
      data: courseInfo,
    };
  }

  private generateJsonContent(courseInfo: CourseResult, filePath: string) {
    let fileContent: Content = {};
    if (fs.existsSync(filePath)) {
      fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    fileContent[courseInfo.time] = courseInfo.data;
    return fileContent;
  }

  public analyze(html: string, filePath: string) {
    const courseInfo = this.getCourseInfo(html);
    const fileContent = this.generateJsonContent(courseInfo, filePath);
    return JSON.stringify(fileContent);
  }

  private constructor() {}
}
