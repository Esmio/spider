import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import './controller/LoginController';
import './controller/CrawlerController';
import router from './router';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  cookieSession({
    name: 'session',
    keys: ['teacher simon'],
    maxAge: 24 * 60 * 60 * 60,
  })
);
app.use(router);

app.listen(7001, () => {
  console.log('server is on 7001');
});
