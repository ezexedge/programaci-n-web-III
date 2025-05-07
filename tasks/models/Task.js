import mongoose from "mongoose";

mongoose.Promise = global.Promise;

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        trim: true
    },
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
