import express from 'express';
import mockTasks from "./data/mock.js"
import mongoose from 'mongoose';
import { DATABASE_URL } from './env.js';
import Task from './models/Task.js';

const app = express();
app.use(express.json())

function asyncHandler(handler){
    return async function(req,res) {
        try{
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

app.get('/hello',(req,res) => {
    res.send('Hello Express!!!');
});

app.get('/tasks', async (req,res) => {
    const sort = req.query.sort;
    const count = Number(req.query.count);
    
    const sortOption = { createdAt: sort === 'oldest' ? 'asc' : 'desc'};
    // 퀴리에 필터 조건을 여러개를 걸 수 있고
    // await 이후엔 결과(객체)를 반환
    const tasks = await Task.find().sort(sortOption).limit(count);

    res.send(tasks);
});

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

app.post("/tasks",async (req,res)=>{
    const newTask = await Task.create(req.body);
    res.status(201).send(newTask)
})

app.patch("/tasks/:id",(req,res)=>{
    const id = Number(req.params.id);
    const task = mockTasks.find((task) => task.id === id);
    if(task){
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
    const Idx = mockTasks.findIndex((task) => task.id === id);
    if(Idx >= 0 ){
        mockTasks.splice(Idx, 1);
        res.sendStatus(204);
    }else{
        res.status(404).send({ message : "id에 해당하는 내용 없음"})
    }
})

mongoose.connect(DATABASE_URL).then(() => console.log('Connected to DB'));

app.listen(3000, () => console.log('Server Started'))