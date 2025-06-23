document.addEventListener('DOMContentLoaded', function() {
    // Carregar dados do usuário
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    
    // Função para formatar CPF
    function formatCPF(cpf) {
        if (!cpf) return '●●●.●●●.●●●-●●';
        cpf = cpf.replace(/\D/g, '');
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    // Preencher informações do perfil
    document.getElementById('displayName').textContent = userData.name || 'Nome não informado';
    document.getElementById('displayEmail').textContent = userData.email || 'E-mail não informado';
    
    // Configurar visibilidade do CPF
    const cpfDisplay = document.getElementById('displayCPF');
    const maskedValue = cpfDisplay.querySelector('.masked-value');
    const toggleBtn = document.getElementById('toggleCPF');
    let isVisible = false;
    
    // Função para atualizar a exibição do CPF
    function updateCPFDisplay() {
        if (isVisible) {
            maskedValue.textContent = formatCPF(userData.cpf || '');
            toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            maskedValue.textContent = '●●●.●●●.●●●-●●';
            toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        }
    }

    // Configurar o botão de toggle do CPF
    toggleBtn.addEventListener('click', function() {
        isVisible = !isVisible;
        updateCPFDisplay();
    });

    // Inicializar a exibição do CPF
    updateCPFDisplay();

    // Máscara para o campo de CPF
    const cpfInput = document.getElementById('cpf');
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = formatCPF(value);
            e.target.value = value;
        }
    });

    // Gerenciar visibilidade do CPF
    const toggleCPFBtn = document.getElementById('toggleCPF');
    const cpfField = document.getElementById('cpf');
    let isCPFVisible = false;

    if (toggleCPFBtn && cpfField) {
        toggleCPFBtn.addEventListener('click', function() {
            isCPFVisible = !isCPFVisible;
            cpfField.classList.toggle('masked', !isCPFVisible);
            
            const icon = toggleCPFBtn.querySelector('i');
            icon.className = isCPFVisible ? 'fas fa-eye-slash' : 'fas fa-eye';
        });

        // Inicialmente, mascarar o CPF
        cpfField.classList.add('masked');
    }

    // Gerenciar upload de foto
    const editPhotoBtn = document.getElementById('editPhotoBtn');
    const profileImg = document.getElementById('profileImage');

    // Carregar foto de perfil salva
    if (userData.profileImage) {
        profileImg.src = userData.profileImage;
    }

    editPhotoBtn.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profileImg.src = e.target.result;
                    // Salvar a imagem no localStorage (em produção, enviar para um servidor)
                    userData.profileImage = e.target.result;
                    localStorage.setItem('userData', JSON.stringify(userData));

                    // Atualizar o avatar no header também
                    const headerAvatar = document.querySelector('#userProfile img');
                    if (headerAvatar) {
                        headerAvatar.src = e.target.result;
                    }
                };
                reader.readAsDataURL(file);
            }
        };
        
        input.click();
    });

    // Gerenciar formulário de informações pessoais
    const profileForm = document.getElementById('profileForm');
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const updatedData = {
            ...userData,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            cpf: document.getElementById('cpf').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value
        };

        localStorage.setItem('userData', JSON.stringify(updatedData));
        
        // Atualizar informações exibidas
        document.getElementById('displayName').textContent = updatedData.name || 'Nome não informado';
        document.getElementById('displayEmail').textContent = updatedData.email || 'E-mail não informado';

        // Mostrar mensagem de sucesso
        const successMessage = document.createElement('div');
        successMessage.className = 'alert alert-success';
        successMessage.textContent = 'Informações atualizadas com sucesso!';
        successMessage.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background-color: #4CAF50;
            color: white;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(successMessage);

        // Remover a mensagem após 3 segundos
        setTimeout(() => {
            successMessage.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(successMessage);
            }, 300);
        }, 3000);
    });
});
