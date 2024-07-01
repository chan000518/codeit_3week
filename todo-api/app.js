import express from 'express';
import tasks from "./data/mock.js"

const app = express();
app.use(express.json())

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

app.get("/tasks/:id",(req,res)=>{
    const id = Number(req.params.id);
    const task = tasks.find((task) => task.id === id);
    if(task){
        res.send(task);
    }else{
        res.status(404).send({ message : "id에 해당하는 내용 없음"})
    }
})

app.post("/tasks",(req,res)=>{
    const newTask = req.body;
    const ids = tasks.map((task)=> task.id)
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
    const Idx = tasks.findIndex((task) => task.id === id);
    if(Idx >= 0 ){
        tasks.splice(Idx, 1);
        res.sendStatus(204);
    }else{
        res.status(404).send({ message : "id에 해당하는 내용 없음"})
    }
})

app.listen(3000, () => console.log('Server Started'))