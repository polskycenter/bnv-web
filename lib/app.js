const cwd = __dirname;

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const debug = require('debug')('@polskycenter/bnv-web:router');
const ejs = require('ejs');
const express = require('express');
const favicon = require('serve-favicon');
const healthcheck = require('middle-pinger');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const proxy = require('express-http-proxy');

const authenticate = require('./middleware/authenticate');
const env = require('./env');
const generateAssetHashes = require('./utils/generateAssetHashes');
const minifyHtml = require('./middleware/minifyHtml');
const routes = require('./routes');

const HOST_API = env('HOST_API');
const HOST_CLIENT = env('HOST_CLIENT');
const IS_PRODUCTION = env('IS_PRODUCTION');
const PUBLIC_FOLDER = path.join(cwd, '../public');
const SECRET = env('SECRET');

const fileHashes = generateAssetHashes(PUBLIC_FOLDER);
const staticOptions = { maxAge: IS_PRODUCTION ? '1y' : 0 };

const app = express();

function localStylesheet(asset) {
  const href = `/public/css/${asset}`;

  if (!IS_PRODUCTION) {
    return `<link href="${href}" rel="stylesheet" />`;
  }

  const integrity = `sha256-${fileHashes[`css/${asset}`]}`;

  return `<link href="${href}" integrity="${integrity}" rel="stylesheet" />`;
}

function localScript(asset) {
  const src = `/public/js/${asset}`;

  if (!IS_PRODUCTION) {
    return `<script src="${src}"></script>`;
  }

  const integrity = `sha256-${fileHashes[`js/${asset}`]}`;

  return `<script integrity="${integrity}" src="${src}"></script>`;
}

app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(morgan(IS_PRODUCTION ? 'tiny' : 'dev'));
app.use(healthcheck());
app.use(helmet());

app.use(favicon(path.join(PUBLIC_FOLDER, 'favicon.ico')));
app.use('/public', cors(), express.static(PUBLIC_FOLDER, staticOptions));
app.use((req, res, next) => {
  res.locals.css = localStylesheet; // eslint-disable-line no-param-reassign
  res.locals.js = localScript; // eslint-disable-line no-param-reassign

  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(SECRET));

app.get('/activate', routes.signin.activate);
app.get('/signin', minifyHtml, routes.signin.get);
app.post('/signin', routes.signin.post);
app.get('/verify', routes.signin.verify);

app.use(authenticate);

app.get('/signout', routes.signout.get);

app.use(bodyParser.json());
app.use(
  '/api',
  proxy(
    HOST_API,
    {
      https: !HOST_API.startsWith('http://localhost'),
      proxyReqPathResolver(req) {
        return `/v1${req.url}`;
      },
      proxyReqOptDecorator(reqProxy, req) {
        reqProxy.auth = `${req.session.key}:`; // eslint-disable-line no-param-reassign
        reqProxy.headers['X-Forwarded-For'] = req.ip; // eslint-disable-line no-param-reassign, max-len

        return reqProxy;
      }
    }
  )
);

app.use((req, res, next) => {
  res.locals.account = JSON.stringify(req.account); // eslint-disable-line no-param-reassign
  res.locals.host = HOST_CLIENT; // eslint-disable-line no-param-reassign

  next();
});

app.get('/accounts*', minifyHtml, (req, res) => res.render('index'));
app.get('/calculators*', minifyHtml, (req, res) => res.render('index'));
app.get('/', (req, res) => res.redirect('/calculators'));

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  debug('error', err);
  return res.status(err.isBoom ? err.output.statusCode : 500).send(err.message);
});

module.exports = app;
