import express from 'express';
import { database } from './db.js';
import bodyParser from 'body-parser';
import mongoose from "mongoose";
const port = 3000
const Task = mongoose.model("Task")
import { trace } from '@opentelemetry/api';


const app = express();

database()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));





app.get("/tasks", async (req, res) => {

  const span = trace.getActiveSpan()
 const tasks = await Task.find()
if(span){
  span.setAttribute("data",JSON.stringify(tasks))
}
 res.status(200).json(tasks)
  });

  app.post("/tasks",  async (req, res) => {
    try{
    const task  = req.body

    const newTask = new Task({...task})

    await newTask.save();

    res.status(200).json(newTask)
    }
    catch (error) {
        res.status(500).send(error);
    }
});


app.delete("/tasks/:id", async (req, res) => {
    try {
        const id = req.params.id;
       const taskDeleted = await Task.findByIdAndDelete(id);
       
        res.status(200).json(taskDeleted)

    } catch (error) {
        res.status(500).send(error);
    }
});


app.patch("/tasks", async (req, res) => {
  try {
    const {title,description,id} = req.body;
    
    const updatedTask = await Task.findByIdAndUpdate(
      id, 
      {title,description},
      { new: true }
    );
    
    if (!updatedTask) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    
    res.status(200).json(updatedTask);

  } catch (error) {
    res.status(500).send(error);
  }
});
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on port 2000!!');
});