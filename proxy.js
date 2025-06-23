const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Middleware para processar JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Simulação de banco de dados de usuários (em produção, use um banco de dados real)
let users = [];

// Configuração para servir arquivos estáticos da pasta atual
app.use(express.static(__dirname));

// Rota raiz redireciona para index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para a página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Rota para login (POST)
app.post('/api/auth/login', async (req, res) => {
    const { email, senha } = req.body;

    // Validação básica
    if (!email || !senha) {
        return res.status(400).json({ success: false, message: 'Email e senha são obrigatórios' });
    }

    try {
        // Fazer requisição para a API externa
        const response = await fetch('http://52.67.61.219:8080/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const users = await response.json();
        
        // Encontrar usuário
        const user = users.find(u => u.email === email && u.senha === senha);
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
        }

        res.json({ 
            success: true, 
            message: 'Login realizado com sucesso',
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ success: false, message: 'Erro ao conectar ao servidor' });
    }
});

// Rota para registro de usuário
app.post('/api/auth/register', async (req, res) => {
    const { nome, email, cpf, senha, confirmarSenha, termos } = req.body;

    // Validação
    if (!nome || !email || !cpf || !senha || !confirmarSenha) {
        return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios' });
    }

    if (senha !== confirmarSenha) {
        return res.status(400).json({ success: false, message: 'As senhas não conferem' });
    }

    if (senha.length < 6) {
        return res.status(400).json({ success: false, message: 'A senha deve ter pelo menos 6 caracteres' });
    }

    if (!termos) {
        return res.status(400).json({ success: false, message: 'Você deve aceitar os termos de uso' });
    }

    try {
        // Verificar se o email já está cadastrado
        const checkResponse = await fetch('http://52.67.61.219:8080/users');
        const users = await checkResponse.json();
        
        if (users.some(u => u.email === email)) {
            return res.status(400).json({ success: false, message: 'Este email já está cadastrado' });
        }

        // Criar novo usuário
        const newUser = {
            nome,
            email,
            cpf,
            senha // Em produção, use bcrypt para hashear a senha
        };

        // Salvar usuário na API
        const saveResponse = await fetch('http://52.67.61.219:8080/users/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        const result = await saveResponse.json();
        
        if (!saveResponse.ok) {
            throw new Error(result.message || 'Erro ao salvar usuário');
        }
        
        console.log('Usuário salvo com sucesso:', result);
        
        res.status(201).json({ 
            success: true, 
            message: 'Usuário cadastrado com sucesso!',
            user: {
                id: result.id || Date.now().toString(),
                nome: result.nome || nome,
                email: result.email || email
            }
        });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Erro ao conectar ao servidor' 
        });
    }
});

// Habilitar CORS para todas as rotas
app.use(cors());

// Configurar o proxy para a API
const proxy = createProxyMiddleware({
    target: 'http://52.67.61.219:8080',
    changeOrigin: true,
    pathRewrite: {
        '^/api': ''
    }
});

// Usar o proxy para todas as requisições que começam com /api
app.use('/api', proxy);

// Para todas as outras rotas, servir o index.html (para SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar o servidor
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Acesse o site em: http://localhost:${PORT}/`);
    console.log(`Página de login: http://localhost:${PORT}/login`);
});