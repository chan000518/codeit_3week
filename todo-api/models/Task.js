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