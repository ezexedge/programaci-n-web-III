import express from 'express';
import { database } from './db.js';
import mongoose from "mongoose";
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import { authorizeRole, verifyToken } from './auth.middleware.js';
import cookieParser from 'cookie-parser';
import cors from "cors"
const port = 3000;
const Task = mongoose.model("Task");
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes'), false);
    }
  }
});

database();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/tasks", async (req, res) => {
  console.log("xxxxxx")
  const tasks = await Task.find();
  res.status(200).json(tasks);
});

app.post("/tasks",verifyToken ,upload.single('image'), async (req, res) => {
  try {
    const taskData = req.body;

    
    const newTask = new Task({...taskData,email: req.user.email});
    await newTask.save();
    
    if (req.file) {
      try {
      
        const url = "http://imagestore:80";
        
        const formData = new FormData();
        
        formData.append('image', req.file.buffer, {
          filename: req.file.originalname,
          contentType: req.file.mimetype
        });
        
        formData.append('taskId', newTask._id.toString());
        
        console.log("Enviando imagen a:", `${url}/imagestore`);
        
        const imageResponse = await axios.post(
          `${url}/imagestore`,
          formData,
          {
            headers: {
              ...formData.getHeaders()
            },
          }
        );
        
        console.log("Respuesta del servicio de imágenes:", imageResponse.data);
        
        if (imageResponse.data && imageResponse.data.filename) {
          newTask.image = imageResponse.data.filename;
          await newTask.save();
        }
      } catch (imageError) {
        console.error("Error al procesar la imagen:", imageError.message);
      }
    }
    
    res.status(200).json(newTask);
  } catch (error) {
    console.error("Error al crear la tarea:", error);
    res.status(500).json({
      message: "Error al crear la tarea",
      error: error.message
    });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const taskDeleted = await Task.findByIdAndDelete(id);
    res.status(200).json(taskDeleted);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.patch("/tasks", async (req, res) => {
  try {
    const {title, description, id} = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      id, 
      {title, description},
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
  console.log(`Listening on port ${port}!!`);
});