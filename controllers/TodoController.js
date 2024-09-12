import Post from '@/models/Post'; // Corrigido para Post, assumindo que o modelo correto é Post
import connectMongo from '@/utils/dbConnect';

// Função para obter todas as tarefas do usuário
export const getTodos = async (req, res) => {
    await connectMongo();
    try {
        // Verifique se o userId está presente em req.user
        if (!req.user || !req.user.userId) {
            return res.status(400).json({ message: 'Usuário não autenticado' });
        }

        const todos = await Post.find({ userId: req.user.userId });
        res.status(200).json({ todos });
    } catch (error) {
        console.error('Erro ao buscar tarefas:', error); // Melhoria na depuração
        res.status(500).json({ message: 'Erro ao buscar tarefas' });
    }
};

// Função para adicionar uma nova tarefa
export const addTodo = async (req, res) => {
    const { title } = req.body;
    await connectMongo();
    try {
        // Verifique se o userId está presente em req.user
        if (!req.user || !req.user.userId) {
            return res.status(400).json({ message: 'Usuário não autenticado' });
        }

        if (!title) {
            return res.status(400).json({ message: 'Título é obrigatório' });
        }

        const newTodo = new Post({ title, userId: req.user.userId });
        await newTodo.save();
        res.status(201).json({ todo: newTodo });
    } catch (error) {
        console.error('Erro ao adicionar tarefa:', error); // Melhoria na depuração
        res.status(500).json({ message: 'Erro ao adicionar tarefa' });
    }
};

// Função para atualizar uma tarefa existente
export const updateTodo = async (req, res) => {
    const { id } = req.query;
    const data = req.body;
    await connectMongo();
    try {
        // Verifique se o userId está presente em req.user
        if (!req.user || !req.user.userId) {
            return res.status(400).json({ message: 'Usuário não autenticado' });
        }

        const updatedTodo = await Post.findOneAndUpdate(
            { _id: id, userId: req.user.userId },
            data,
            { new: true }
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }

        res.status(200).json({ todo: updatedTodo });
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error); // Melhoria na depuração
        res.status(500).json({ message: 'Erro ao atualizar tarefa' });
    }
};

// Função para deletar uma tarefa
export const deleteTodo = async (req, res) => {
    const { id } = req.query;
    await connectMongo();
    try {
        // Verifique se o userId está presente em req.user
        if (!req.user || !req.user.userId) {
            return res.status(400).json({ message: 'Usuário não autenticado' });
        }

        const deletedTodo = await Post.findOneAndDelete(
            { _id: id, userId: req.user.userId }
        );

        if (!deletedTodo) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }

        res.status(200).json({ message: 'Tarefa deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar tarefa:', error); // Melhoria na depuração
        res.status(500).json({ message: 'Erro ao deletar tarefa' });
    }
};
