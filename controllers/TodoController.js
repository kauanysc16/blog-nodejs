import Task from '@/models/Post';
import connectMongo from '@/utils/dbConnect';

export const getTodos = async (req, res) => {
    await connectMongo();
    try {
        const todos = await Task.find({ userId: req.user.userId });
        res.status(200).json({ todos });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const addTodo = async (req, res) => {
    const { title } = req.body;
    await connectMongo();
    try {
        const newTodo = new Task({ title, userId: req.user.userId });
        await newTodo.save();
        res.status(201).json({ todo: newTodo });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao adicionar tarefa' });
    }
};

export const updateTodo = async (req, res) => {
    const { id } = req.query;
    const data = req.body;
    await connectMongo();
    try {
        const updatedTodo = await Task.findOneAndUpdate({ _id: id, userId: req.user.userId }, data, { new: true });
        res.status(200).json({ todo: updatedTodo });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar tarefa' });
    }
};

export const deleteTodo = async (req, res) => {
    const { id } = req.query;
    await connectMongo();
    try {
        const deletedTodo = await Task.findOneAndDelete({ _id: id, userId: req.user.userId });
        res.status(200).json({ message: 'Tarefa deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar tarefa' });
    }
};