// Função para verificar o login e atualizar a interface
function checkLoginStatus() {
    const loginButton = document.getElementById('loginButton');
    const userProfile = document.getElementById('userProfile');
    
    // Verificar se há dados do usuário no localStorage
    const userData = localStorage.getItem('userData');
    
    if (userData) {
        // Usuário está logado
        if (loginButton) loginButton.style.display = 'none';
        if (userProfile) userProfile.style.display = 'block';
        
        // Atualizar avatar se existir
        const userAvatar = userProfile?.querySelector('img');
        if (userAvatar) {
            const user = JSON.parse(userData);
            if (user.profileImage) {
                userAvatar.src = user.profileImage;
            }
        }

        // Atualizar nome e CPF se estiver na página de perfil
        const displayName = document.getElementById('displayName');
        const displayCPF = document.getElementById('displayCPF');
        if (displayName && displayCPF) {
            const user = JSON.parse(userData);
            displayName.textContent = user.nome || 'Nome não disponível';
            const maskedValue = displayCPF.querySelector('.masked-value');
            if (maskedValue) {
                maskedValue.textContent = '●●●.●●●.●●●-●●';
            }
        }
    } else {
        // Usuário não está logado
        if (loginButton) loginButton.style.display = 'block';
        if (userProfile) userProfile.style.display = 'none';
    }
}

// Função para realizar o login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        // Buscar dados do usuário pelo email
        const response = await fetch(`http://52.67.61.219:8080/users?email=${email}`);

        if (!response.ok) {
            throw new Error('Falha ao obter dados do usuário');
        }

        const users = await response.json();
        
        // Verificar se encontrou o usuário com o email
        if (users && users.length > 0) {
            const userData = users[0]; // Pega o primeiro usuário encontrado
            
            // Preparar os dados do usuário
            const completeUserData = {
                id: userData.id,
                email: email,
                nome: userData.nome,
                cpf: userData.cpf,
                profileImage: 'assets/images/default-avatar.svg'
            };
            
            // Salvar dados do usuário
            localStorage.setItem('userData', JSON.stringify(completeUserData));
            
            // Atualizar interface
            checkLoginStatus();
            
            // Mostrar mensagem de sucesso
            const form = document.querySelector('.auth-form');
            form.classList.add('success');
            
            // Adicionar mensagem de sucesso
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Login realizado com sucesso!';
            form.appendChild(successMessage);
            
            // Redirecionar após um breve delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            throw new Error('Usuário não encontrado');
        }

    } catch (error) {
        console.error('Erro no login:', error);
        // Mostrar mensagem de erro
        const form = document.querySelector('.auth-form');
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Erro ao fazer login. Verifique suas credenciais.';
        form.appendChild(errorMessage);
    }
}

// Função para realizar o logout
async function handleLogout(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    try {
        // Limpar dados do usuário
        localStorage.removeItem('userData');
        localStorage.clear();
        sessionStorage.clear();
        // Remover todos os cookies
        document.cookie.split(';').forEach(function(c) {
            document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
        });
        // Atualizar interface imediatamente
        const loginButton = document.getElementById('loginButton');
        const userProfile = document.getElementById('userProfile');
        const userMenu = document.querySelector('.user-menu');
        if (loginButton) loginButton.style.display = 'block';
        if (userProfile) userProfile.style.display = 'none';
        if (userMenu) userMenu.classList.remove('active');
        // Redirecionar para a página de login
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
}

// Função para realizar o registro
async function handleRegister(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('registerEmail').value;
    const cpf = document.getElementById('cpf').value;
    const senha = document.getElementById('registerSenha').value;
    
    try {
        // Remover qualquer formatação do CPF (pontos e traços)
        const cpfLimpo = cpf.replace(/[^\d]/g, '');
        
        // Fazer o POST para registrar o usuário
        const response = await fetch('http://52.67.61.219:8080/users/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome,
                email,
                cpf: cpfLimpo, // Envia o CPF sem formatação
                senha
            })
        });

        if (!response.ok) {
            throw new Error('Falha ao registrar usuário');
        }

        // Mostrar mensagem de sucesso
        const form = document.getElementById('registerForm');
        if (form) {
            form.classList.add('success');
            
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Cadastro realizado com sucesso!';
            form.appendChild(successMessage);
            
            // Redirecionar após um breve delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }

    } catch (error) {
        console.error('Erro no registro:', error);
        // Mostrar mensagem de erro
        const form = document.getElementById('registerForm');
        if (form) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.textContent = 'Erro ao fazer cadastro. Tente novamente.';
            form.appendChild(errorMessage);
        }
    }
}

// Inicializar quando o documento estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Verificar status do login
    checkLoginStatus();
    
    // Adicionar event listener para o formulário de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Adicionar event listener para o formulário de registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Adicionar event listener para o botão de logout
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    
    // Configurar menu do usuário
    const userProfile = document.getElementById('userProfile');
    const userMenu = document.querySelector('.user-menu');
    const perfilLink = document.querySelector('.user-menu-item[href="perfil.html"]');
    
    if (userProfile && userMenu) {
        // Toggle do menu ao clicar no avatar
        userProfile.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenu.classList.toggle('active');
        });
        
        // Fechar menu ao clicar fora
        document.addEventListener('click', function(e) {
            if (!userProfile.contains(e.target)) {
                userMenu.classList.remove('active');
            }
        });
    }

    // Garantir que o clique em Perfil sempre redirecione para perfil.html
    if (perfilLink) {
        perfilLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'perfil.html';
        });
    }

    // Delegação de evento para o botão de logout (funciona em qualquer página)
    document.body.addEventListener('click', function(e) {
        const target = e.target.closest('#logoutButton');
        if (target) {
            e.preventDefault();
            handleLogout(e);
        }
    });
}); 