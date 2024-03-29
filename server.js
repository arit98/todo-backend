import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { Todo } from "./models/Todo.js"

const app = express();

app.use(express.json());
app.use(cors());

; (async () => {
    try {
        await mongoose.connect('mongodb+srv://arit98:arit98@cluster0.k0yrceq.mongodb.net/mern-todo', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => console.log("Connected to MongoDB")).catch(console.error);

        app.get('/todos', async (req, res) => {
            const todos = await Todo.find();

            if(todos.length>0){
                res.json(todos);
            }
        })

        app.post('/todo/new', (req, res) => {
            const todo = new Todo({
                text: req.body.text
            })

            todo.save();

            res.json(todo);
        });

        app.delete('/todo/delete/:id', async (req, res) => {
            try {
                const result = await Todo.findByIdAndDelete(req.params.id);
                if (!result) {
                    return res.status(404).json({ error: "Todo not found" });
                }
                res.json({ result });
            } catch (error) {
                console.error("Error deleting todo:", error);
                res.status(500).json({ error: "Server error" });
            }
        });

        app.get('/todo/complete/:id', async (req, res) => {
            const todo = await Todo.findById(req.params.id);

            todo.complete = !todo.complete;

            todo.save();

            res.json(todo);
        })

        app.put('/todo/update/:id', async (req, res) => {
            const todo = await Todo.findById(req.params.id);

            todo.text = req.body.text;

            todo.save();

            res.json(todo);
        });

        app.listen(4000, () => console.log("Server started on port 4000"))
    } catch (error) {
        console.error("ERROR: ", error)
        throw error
    }
})()


