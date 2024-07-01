import express from 'express';
import tasks from "./data/mock.js"

const app = express();

app.get('/hello',(req,res) => {
    res.send('Hello Express!!!');
});

app.get('/tasks',(req,res) => {
    res.send(tasks);
});

app.listen(3000, () => console.log('Server Started'))