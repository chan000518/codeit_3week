# codeit_3week
코드잇 백엔드 수강 3주차 실습 내용입니다(자바스크립트 백엔드 개발 시작하기)

# 자바스크립트 백엔드 개발 시작하기

## Front End

- **웹사이트 화면** + **인터랙티브한 요소들**

## Back End

- **데이터 관리** + **프론트엔드에 전송**
- 정보 흐름: 어디로, 어떻게
- **엔드포인트**: `HTTP 메소드 + URL`
    - 이 모음을 API (REST API)
    - GET, POST, DELETE 등의 HTTP 메소드를 사용하여 행위를 정의
    
    ### **REST API**:
    
    - REST는 Representational State Transfer의 약자로, 자원을 이름(자원 - Resource)의 형태로 구분하여 해당 자원의 상태(정보)를 주고받는 모든 것을 의미합니다.
    - 각 엔드포인트는 특정한 자원에 대한 CRUD(Create, Read, Update, Delete) 작업을 수행하기 위해 HTTP 메소드(GET, POST, PUT, DELETE 등)를 사용합니다.

## 주요 기술 스택

### Node.js

- **런타임 환경**: 브라우저 바깥에서 자바스크립트를 실행 가능하게 함
- **API 제공**: 브라우저 외부에서 별도로 실행

### Express

- **프레임워크**: 서버를 만들기 위한 최소한의 프레임워크
- **구조 관리**: 높은 자유도로 인해 관리가 어려움

### **Node.js와 Express의 관계**:

- Node.js는 JavaScript 런타임 환경으로, 브라우저 외부에서 JavaScript를 실행할 수 있게 해줍니다.
- Express는 Node.js에서 서버를 쉽게 구축할 수 있게 해주는 프레임워크로, 라우팅 및 미들웨어 기능을 제공합니다.

### MongoDB

- **NoSQL 데이터베이스**: 관계형 DB와 다르게 테이블이 아닌 문서 형태로 데이터 저장
    - **컬렉션**: 문서 모음
    - **도큐먼트**: 문서 하나
- NoSQL 데이터베이스로, JSON 형태의 유연한 스키마를 사용하여 데이터를 저장
- 높은 확장성 및 성능을 제공하며, 컬렉션(collection)과 도큐먼트(document) 단위로 데이터를 관리

## Express 예제 코드

```jsx
jsx코드 복사
import express from 'express';
import tasks from './data/mock.js';

const app = express();

app.get('/hello', (req, res) => {
    res.send('Hello Express!!!');
});

app.get('/tasks', (req, res) => {
    res.send(tasks);
});

app.listen(3000, () => console.log('Server Started'));

```

### 코드 설명

- `app.get("경로", 함수(req, res))`
    - `app`으로 `GET` 요청을 처리하는 함수
- `app.listen(포트번호, 함수)`
    - 서버 실행 함수, 해당 포트를 계속 열고 통신을 기다림

### 퀴리스트링

url

```jsx
app.get('/tasks',(req,res) => {
    const sort = req.query.sort;
    const count = Number(req.query.count);
    
    // ???? 어느 나라 문법임? 
    // 그 정렬에 함수로 들어가 정렬 기준이 되는 듯 
    const compareFn = 
        sort === "oldest"
            ? (a,b) => a.createdAt - b.createdAt
            : (a,b) => b.createdAt - a.createdAt
    
    let newTasks = tasks.sort(compareFn);

    if (count){
        newTasks = newTasks.slice(0, count);
    }
    res.send(newTasks);
});
```

const compareFn = 
        sort === "oldest"
            ? (a,b) => a.createdAt - b.createdAt
            : (a,b) => b.createdAt - a.createdAt

    sort함수에 정렬 기준이 되는 함수 

<aside>
💡 **삼항 연산자:**  조건 ? 참일 때 반환할 값 : 거짓일 때 반환할 값

</aside>

해당 조건이 참이면 첫째 줄 (a,b) => a.createdAt - b.createdAt 로 정렬

### 다이나믹한 url

```jsx
app.get("/tasks/:id",(req,res)=>{
    const id = Number(req.params.id);
    const task = tasks.find((task) => task.id === id);
    if(task){
        res.send(task);
    }else{
	    // 서버에 없으면 404
        res.status(404).send({ message : "id에 해당하는 내용 없음"})
    }
})
```

### post, patch, delete

```jsx
app.post("/tasks",(req,res)=>{
    const newTask = req.body;
    // 아이디 처리 <- 데베 없어서 직접
    const ids = tasks.map((task)=> task.id)
    // 이전 모든 id와 안겹치게
    newTask.id = Math.max(...ids) + 1
    newTask.isComplete = false;
    newTask.createdAt = new Date();
    newTask.updatedAt = new Date();
    tasks.push(newTask);
    res.status(201).send(newTask)
})

app.patch("/tasks/:id",(req,res)=>{
    const id = Number(req.params.id);
    const task = tasks.find((task) => task.id === id);
    // 어떤 속성을 바디에 넣고 요청한지 몰라
    // 모든 속성처리가 가능하게
    if(task){
		    // 객체의 열쇠(key)들을 배열로 반환하는 메서드
        Object.keys(req.body).forEach((key) =>{
            task[key] = req.body[key];
        });
        task.updatedAt = new Date();
        res.send(task);
    }else{
        res.status(404).send({ message : "id에 해당하는 내용 없음"})
    }
})

app.delete("/tasks/:id",(req,res)=>{
    const id = Number(req.params.id);
    const Idx = tasks.findIndex((task) => task.id === id);
    if(Idx >= 0 ){
		    // 인덱스 부터 하나 제거
        tasks.splice(Idx, 1);
        res.sendStatus(204);
    }else{
        res.status(404).send({ message : "id에 해당하는 내용 없음"})
    }
})
```

## 정리

# **Express 뼈대 코드**

```jsx

import express from 'express';

const app = express();

// 라우트 정의

app.listen(3000, () => console.log('Server Started'));

```

# **라우트(Route) 정의**

Express 라우트는 아래와 같이 정의할 수 있습니다.

```jsx

app.method(path, handler)

```

- `method`: HTTP 메소드 이름
- `path`: 엔드포인트 경로
- `handler`: 리퀘스트 로직을 처리하고 리스폰스를 돌려주는 핸들러 함수. 첫 번째 파라미터로 리퀘스트 객체, 두 번째 파라미터로 리스폰스 객체를 받습니다.

```jsx

// Arrow Function 핸들러

app.get('/some/path', (req, res) => {
  // 리퀘스트 처리
});

```

```jsx

// 핸들러 함수 선언

function handler(req, res) {
  // 리퀘스트 처리
}

app.get('/some/path', handler);

```

# **리퀘스트 객체**

## **`req.query`**

쿼리스트링 파라미터를 프로퍼티로 담고 있는 객체입니다. 파라미터는 항상 문자열이라는 점 주의해 주세요.

예시: `GET /some/path?foo=1&bar=2`

```jsx

app.get('/some/path', (req, res) => {
  console.log(req.query);  // { foo: '1', bar: '2' }
  // ...
});

```

## **`req.params`**

URL 파라미터를 프로퍼티로 담고 있는 객체입니다. 파라미터는 항상 문자열이라는 점 주의해 주세요.

예시: `GET /some/1/path/james`

```jsx

app.get('/some/:id/path/:name', (req, res) => {
  console.log(req.params);  // { id: '1', name: 'james' }
  // ...
});

```

## **`req.body`**

리퀘스트 바디 내용을 담고 있는 객체입니다. 바디 내용을 `req.body`로 접근하려면 `express.json()`이라는 함수를 이용해야 합니다.

예시: `POST /some/path`

```

{
  "field1": "value1",
  "field2": "value2"
}

```

```jsx

app.use(express.json());

app.post('/some/path', (req, res) => {
  console.log(req.body);  // { field1: 'value1', field2: 'value2' }
  // ...
});

```

# **리스폰스 객체**

## **`res.send()`**

리스폰스를 보냅니다. 아규먼트로 전달되는 값에 따라 `Content-Type` 헤더를 설정하고 적절한 바디 내용으로 변환해 줍니다. API 서버를 만들 때는 주로 객체나 배열을 전달하는데요. 그러면 `Content-Type` 헤더를 `application/json`으로 설정하고 객체나 배열을 JSON 문자열로 바꿔서 전달해 줍니다. 디폴트 상태 코드는 `200`(OK)입니다.

```jsx

app.get('/some/path', (req, res) => {
  res.send({ field1: 'value1', field2: 'value2' });
});

```

```

GET /some/path

HTTP/1.1 200 OK
Content-Type: application/json

{
  "field1": "value1",
  "field2": "value2"
}

```

## **`res.status()`**

리스폰스의 상태 코드를 설정합니다.

```jsx

app.get('/some/path', (req, res) => {
  // ...
  res.status(404).send(...);
});

```

## **`res.sendStatus()`**

리스폰스로 바디 없이 상태 코드만 보냅니다.

```jsx

app.get('/some/path', (req, res) => {
  // ...
  res.sendStatus(204);
});
```

## 몽고디비

## 연결

```jsx
import mongoose from 'mongoose';
import { DATABASE_URL } from './env.js';

mongoose.connect(DATABASE_URL).then(() => console.log('Connected to DB'));
```

## 스키마

```jsx
import mongoose from "mongoose"

const TaskSchema = new mongoose.Schema(
    {
        titile : {
            type: String,
        },
        description : {
            type: String,
        },
        isComplete: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps : true,
    },
);

const Task = mongoose.model('Task', TaskSchema);

export default Task;
```

## 시드 데이터

```jsx
import mongoose from 'mongoose';
import data from "./mock.js"
import Task from '../models/Task.js';
import { DATABASE_URL } from './env.js';

mongoose.connect(DATABASE_URL);

await Task.deleteMany({});
await Task.insertMany(data);

mongoose.connection.close()
```

```jsx
"scripts": {
    "dev": "nodemon app.js",
    "start": "node app.js",
    "seed": "node data/seed.js"
  }
```

## 데이터 베이스 조회

```jsx

app.get("/tasks/:id", async (req,res)=>{
    const id = req.params.id;
    // 쿼리(데이터 베이스로 쿼리가 날라가고 이를 비동기로 기다림)
    const task = await Task.findById(id);
    if(task){
        res.send(task);
    }else{
        res.status(404).send({ message : "id에 해당하는 내용 없음"})
    }
})

app.get('/tasks', async (req,res) => {
    const sort = req.query.sort;
    const count = Number(req.query.count);
    
    const sortOption = { createdAt: sort === 'oldest' ? 'asc' : 'desc'};
    // 퀴리에 필터 조건을 여러개를 걸 수 있고
    // await 이후엔 결과(객체)를 반환
    const tasks = await Task.find().sort(sortOption).limit(count);

    res.send(tasks);
});
```

## 데이터 생성과 유효성검사

```jsx
import mongoose from "mongoose"

const TaskSchema = new mongoose.Schema(
    {
        titile : {
            type: String,
            require: true,
            // 30글자 이하
            maxLength: 30,
            // 두 단어 이상
            validate:{
                validator: function(title){
                    return title.split(' ').length > 1;
                },
                message : "Must contain at least 2 단어."
            }
        },
        description : {
            type: String,
        },
        isComplete: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps : true,
    },
);

const Task = mongoose.model('Task', TaskSchema);

export default Task;
```

## 비동기 에러 처리

```jsx
// 콜백함수 받음
function asyncHandler(handler){
    return async function(req,res) {
        try{
		        // 콜백함수 실행
            await handler(req,res);
        } catch (e) {
            if (e.name === 'ValidationError'){
                res.status(400).send({message : e.message})
            }else if( e.name === 'castError'){
                res.status(404).send({message: 'Cannot find'})
            }else {
                res.status(500).send({ message: e.message})
            }
        }
    }
}

```

## 정리

# **MongoDB와 Mongoose**

MongoDB는 데이터를 문서 형태로 저장하는 데이터베이스입니다. 데이터, 즉 문서 하나를 '도큐먼트'라고 부르고 도큐먼트의 모음을 '컬렉션'이라고 부릅니다. MongoDB가 제공하는 클라우드 서비스, [Atlas](https://www.mongodb.com/atlas/database)를 이용하면 쉽게 데이터베이스를 셋업하고 사용할 수 있습니다.

Atlas 클러스터에서 데이터베이스를 생성하고 이에 대한 URL을 통해 접속하는 방법입니다. 자바스크립트 프로그램에서 MongoDB에 접속할 때는 Mongoose라는 라이브러리를 이용할 수 있습니다.

# **데이터베이스 접속**

```jsx

import mongoose from 'mongoose';

mongoose.connect('mongodb+srv://...');

```

`mongodb+srv://...`은 Atlas에서 복사한 URL입니다. 이런 URL은 별도의 파일이나 나중에 배울 환경 변수에 저장해 두는 것이 좋습니다.

# **스키마와 모델**

'스키마'는 데이터(도큐먼트)의 틀입니다. 이 스키마를 기반으로 데이터를 생성하고 조회하고 수정, 삭제할 수 있는 인터페이스를 '모델'이라고 합니다. Mongoose로 어떤 데이터를 다루려면 항상 스키마와 모델을 가장 먼저 정의해야 합니다.

models/Task.js

```jsx

import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 30,
    },
    description: {
      type: String,
    },
    isComplete: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', TaskSchema);

export default Task;

```

위와 같이 필드 이름과 필드에 대한 정보를 객체 형태로 정의하면 됩니다. 자주 사용하는 필드 타입은 `String`, `Number`, `Boolean`, `Date`이고 `default` 프로퍼티로 기본값을 설정할 수 있습니다. id 필드는 정의하지 않아도 Mongoose가 알아서 관리합니다.

`timestamps: true` 옵션을 사용하면 `createdAt`, `updatedAt` 필드를 Mongoose가 알아서 생성하고 관리합니다.

유효성 검사에 대한 정보도 스키마에 정의합니다. 자주 사용하는 프로퍼티는 아래와 같습니다.

- `required`: 데이터를 생성할 때 꼭 있어야 하는 필드입니다.
- 문자열 필드: `maxLength`(최대 길이), `minLength`(최소 길이), `enum`(특정 값 중 하나여야 할 때), `match`(특정 패턴이어야 할 때)
- 숫자형 필드: `min`(최소), `max`(최대)

커스텀 Validator를 사용할 수도 있습니다.

```jsx

{
  title: {
    type: String,
    required: true,
    maxLength: 30,
    validate: {
       validator: function (title) {
         return title.split(' ').length > 1;
       },
       message: 'Must contain at least 2 words.',
     },
  },
  // ...
}

```

자세한 내용은 [Schema Types 문서](https://mongoosejs.com/docs/schematypes.html), [Validation 문서](https://mongoosejs.com/docs/validation.html)를 참고하세요.

# **CRUD 연산**

## **생성(Create)**

`.create()` 메소드를 사용해서 객체를 생성할 수 있습니다.

```jsx

app.post('/tasks', async (req, res) => {
  const newTask = await Task.create(req.body);
  res.status(201).send(newTask);
});

```

모든 모델 메소드는 비동기로 실행되기 때문에 결과를 가져오려면 `await`을 사용해야 합니다.

## **조회(Read)**

여러 객체를 조회할 때는 `.find()` 메소드를 사용합니다.

```jsx

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

```

id로 특정 객체를 조회할 때는 `.findById()`를 사용합니다.

```jsx

app.get('/tasks/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  res.send(task);
  } else {
    res.status(404).send({ message: 'Cannot find given id.' });
  }
});

```

id 외에 다른 조건으로 필터를 하고 싶을 때는 [쿼리 필터](https://www.codeit.kr/learn/6324)를 사용하면 됩니다.

## **정렬과 개수 제한**

`.find()`는 쿼리를 리턴하기 때문에 뒤에 메소드를 체이닝(chaining)할 수 있습니다. 자주 체이닝하는 메소드는 정렬 메소드인 `.sort()`와 개수 제한 메소드인 `.limit()`입니다.

```jsx

app.get('/tasks', async (req, res) => {
    /** 쿼리 파라미터
     *  - sort: 'oldest'인 경우 오래된 태스크 기준, 나머지 경우 새로운 태스크 기준
     *  - count: 태스크 개수
     */
    const sort = req.query.sort;
    const count = Number(req.query.count) || 0;

    const sortOption = { createdAt: sort === 'oldest' ? 'asc' : 'desc' };
    const tasks = await Task.find().sort(sortOption).limit(count);

    res.send(tasks);
  })
);

```

## **수정(Update)**

객체를 가져온 후 필드를 수정하고 `.save()`를 호출하면 됩니다.

```jsx

app.patch('/tasks/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (task) {
    Object.keys(req.body).forEach((key) => {
      task[key] = req.body[key];
    });
    await task.save();
    res.send(task);
  } else {
    res.status(404).send({ message: 'Cannot find given id.' });
  }
});

```

## **삭제(Delete)**

`.findByIdAndDelete()` 메소드를 이용해서 객체를 가져오는 것과 동시에 객체를 삭제할 수 있습니다.

```jsx

app.delete('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (task) {
    res.sendStatus(204);
  } else {
    res.status(404).send({ message: 'Cannot find given id.' });
  }
});

```

# **비동기 오류**

비동기 코드에서 오류가 나면 서버가 죽기 때문에 이를 따로 처리해 줘야 합니다. 모든 핸들러를 감싸는 `asyncHandler()` 같은 함수를 정의하고 안에서 `try`, `catch` 문을 활용할 수 있습니다.

```jsx

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      // e.name(오류 이름), e.message(오류 메시지) 이용해서 오류 처리
    }
  };
}

// ...

app.get('/tasks', asyncHandler(async (req, res) => { ... }));
```