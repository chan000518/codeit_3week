import mongoose from "mongoose"

const TaskSchema = new mongoose.Schema(
    {
        titile : {
            type: String,
            require: true,
            maxLength: 30,
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