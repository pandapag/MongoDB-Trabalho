const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

mongoose.connect('mongodb+srv://contatojoaovitorfff:a1@cluster0.0z4rlpj.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conexão com o MongoDB estabelecida');
}).catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
});

app.use(bodyParser.urlencoded({ extended: true }));

const User = require('./models/User');

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/usuarios/cadastrar', async (req, res) => {
    try {
        console.log('Dados do formulário:', req.body); 
        const newUser = new User(req.body);
        await newUser.save();
        res.redirect('/cadastro');
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

app.listen(PORT, () => {
    console.log('O servidor está funcionando na porta: ${PORT}');
});

app.get('/usuarios/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários: ' + error.message });
    }
});

app.delete('/usuarios/:id', async (req, res) => {
    try {
        const result = await User.findByIdAndDelete(req.params.id);
        if (result) res.status(200).send(`Usuário deletado com sucesso.`);
        else res.status(404).send('Usuário não encontrado.');
    } catch (error) {
        res.status(500).send('Erro ao deletar usuário: ' + error.message);
    }
});

app.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const user = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!user) {
            return res.status(404).send('Usuário não encontrado.');
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar usuário: ' + error.message });
    }
});