import express from 'express';
import tasks from "./data/mock.js"

const app = express();

app.get('/hello',(req,res) => {
    res.send('Hello Express!!!');
});

app.get('/tasks',(req,res) => {
    const sort = req.query.sort;
    const count = Number(req.query.count);
    
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

app.get("./tasks/:id",(req,res)=>{
    const id = Number(req.params.id);
    const task = tasks.find((task) => task.id === id);
    if(task){
        res.send(task);
    }else{
        res.send({ message : "id에 해당하는 내용 없음"})
    }
} )

app.listen(3000, () => console.log('Server Started'))