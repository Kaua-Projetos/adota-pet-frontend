// Função para verificar se o usuário está logado
function checkLoginStatus() {
    const userProfile = document.getElementById('userProfile');
    const loginButton = document.getElementById('loginButton');
    const userData = localStorage.getItem('userData');

    if (userData) {
        const user = JSON.parse(userData);
        userProfile.style.display = 'block';
        loginButton.style.display = 'none';

        // Atualiza a imagem do perfil se disponível
        const userAvatar = userProfile.querySelector('img');
        if (user.avatar) {
            userAvatar.src = user.avatar;
        }
    } else {
        userProfile.style.display = 'none';
        loginButton.style.display = 'block';
    }
}

// Função para fazer logout
function handleLogout() {
    localStorage.removeItem('userData');
    window.location.href = 'index.html';
}

// Inicializa os eventos do menu do usuário
function initUserMenu() {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    // Verifica o status de login ao carregar a página
    checkLoginStatus();
}

// Exporta as funções para uso global
window.initUserMenu = initUserMenu;
window.checkLoginStatus = checkLoginStatus;
window.handleLogout = handleLogout; 