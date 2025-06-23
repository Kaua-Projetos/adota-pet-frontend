const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Rotas para servir páginas HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/adocao', (req, res) => {
    res.sendFile(path.join(__dirname, 'adocao.html'));
});

app.get('/ajuda', (req, res) => {
    res.sendFile(path.join(__dirname, 'ajuda.html'));
});

app.get('/pet-details', (req, res) => {
    res.sendFile(path.join(__dirname, 'pet-details.html'));
});

// Banco de dados temporário (em memória)
const users = [];
const pets = [];

// Rotas de Autenticação
app.post('/api/register', (req, res) => {
    const { nome, email, senha } = req.body;
    
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const newUser = { id: users.length + 1, nome, email, senha };
    users.push(newUser);
    
    res.status(201).json({ message: 'Usuário cadastrado com sucesso', user: { ...newUser, senha: undefined } });
});

app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;
    const user = users.find(u => u.email === email && u.senha === senha);
    
    if (!user) {
        return res.status(401).json({ error: 'Email ou senha inválidos' });
    }
    
    res.json({ message: 'Login realizado com sucesso', user: { ...user, senha: undefined } });
});

// Rotas de Pets
app.get('/api/pets', (req, res) => {
    res.json(pets);
});

app.post('/api/pets', (req, res) => {
    const { nome, especie, idade, descricao, foto } = req.body;
    const newPet = {
        id: pets.length + 1,
        nome,
        especie,
        idade,
        descricao,
        foto,
        disponivel: true
    };
    
    pets.push(newPet);
    res.status(201).json(newPet);
});

app.post('/api/pets/:id/adotar', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    
    const pet = pets.find(p => p.id === parseInt(id));
    if (!pet) {
        return res.status(404).json({ error: 'Pet não encontrado' });
    }
    
    if (!pet.disponivel) {
        return res.status(400).json({ error: 'Pet já foi adotado' });
    }
    
    pet.disponivel = false;
    pet.adotadoPor = userId;
    
    res.json({ message: 'Pet adotado com sucesso', pet });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
}); 