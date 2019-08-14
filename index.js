const Koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
const {resolve} = require('path');
const handlerError = require(resolve(__dirname, 'utils/handleError.js'));
const handleDate = require(resolve(__dirname, 'utils/handleDate.js'));
const { getClientIP, getClientDevice} = require(resolve(__dirname, 'utils/getClientInfo.js'));

const app = new Koa();
const router = new Router();

app.use(bodyParser());
app.use(static(resolve(__dirname, './')));
app.use(handlerError);

const render = () => { // 读取首页
  return new Promise((resolve, reject) => {
    fs.readFile('static/index.html', 'utf8', (err, data) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

const getJson = () => { // 获取json数据
  return new Promise((resolve, reject) => {
    fs.readFile('static/data.json', 'utf8', (err, data) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

router.get('/', async (ctx, next) => {
  ctx.response.type = 'html';
  ctx.response.body = await render();

  try{
    let ip = getClientIP(ctx.request);
    let device = getClientDevice(ctx.request);
    let timestamp = new Date().getTime();
    let visitDate = handleDate(timestamp);
    console.log("来访日期：" + visitDate + ", 来访IP：" + ip + ", 访问设备：" + device);
  }catch(e) {
    console.log(e);
  }

  next();
})

router.get('/home/getArticleList', async (ctx, next) => {
  try {
    ctx.set("Content-Type", "application/json");
    let data = await getJson();
    ctx.body = data;
  } catch(error) {
    console.log(error);
  }

  next();
})

app.use(router.routes())
  .use(router.allowedMethods());


app.on('error', function (err) {
  console.log('logging error ', err.message);
  console.log(err);
});

app.listen(3000, () => {
  console.log('====your app is running at port 3000=====')
})
