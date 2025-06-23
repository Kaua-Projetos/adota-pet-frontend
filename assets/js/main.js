document.addEventListener('DOMContentLoaded', function() {
    // Alternar tema (claro/escuro)
    initThemeToggle();
    
    // Inicializar menu mobile
    initMobileMenu();
    
    // Inicializar filtros na página de adoção
    if (document.querySelector('.filters')) {
        initFilters();
    }
    
    // Carregar detalhes do pet se estivermos na página de detalhes
    if (window.location.pathname.includes('pet-details.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const petId = urlParams.get('id');
        
        if (petId) {
            loadPetDetails();
        } else {
            showNoAnimalSelected();
        }
    }
    
    // Inicializar o modal de adoção
    if (document.getElementById('adoptionModal')) {
        initAdoptionModal();
    }
    
    // Carregar dados específicos da página
    if (window.location.pathname.includes('adocao.html')) {
        // Adicionar event listeners aos filtros
        document.getElementById('category')?.addEventListener('change', filterPets);
        document.getElementById('age')?.addEventListener('change', filterPets);
        document.getElementById('size')?.addEventListener('change', filterPets);
        document.getElementById('resetFilters')?.addEventListener('click', resetFilters);
    }
    
    // Aplicar o tema atual a todos os elementos do formulário
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateFormTheme(currentTheme);
    
    // Aplicar cor preta explicitamente ao #petNameModal no tema claro
    const petNameElements = document.querySelectorAll('#petNameModal');
    if (petNameElements && currentTheme === 'light') {
        petNameElements.forEach(el => {
            el.style.color = 'black';
        });
    }

    // Elementos do menu
    const menuButton = document.getElementById('menuButton');
    const nav = document.querySelector('nav');
    const loginButton = document.getElementById('loginButton');
    const userProfile = document.getElementById('userProfile');
    const userMenu = document.querySelector('.user-menu');

    // Toggle do menu mobile
    if (menuButton && nav) {
        menuButton.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Toggle do menu do usuário
    if (userProfile && userMenu) {
        userProfile.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenu.classList.toggle('active');
        });
    }

    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (userProfile && userMenu && !userProfile.contains(e.target)) {
            userMenu.classList.remove('active');
        }
    });

    // Verificar se o usuário está logado
    function checkUserLogin() {
        const loginButton = document.getElementById('loginButton');
        const userProfile = document.getElementById('userProfile');
        const userData = localStorage.getItem('userData');
        const userAvatar = userProfile ? userProfile.querySelector('img') : null;

        if (userData) {
            const user = JSON.parse(userData);
            loginButton.style.display = 'none';
            userProfile.style.display = 'block';
            
            // Atualizar avatar se existir
            if (userAvatar && user.profileImage) {
                userAvatar.src = user.profileImage;
            }
        } else {
            loginButton.style.display = 'block';
            userProfile.style.display = 'none';
        }
    }

    // Verificar login ao carregar a página
    checkUserLogin();

    // Função de logout
    document.getElementById('logoutButton').addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Remover dados do usuário
        localStorage.removeItem('userData');
        localStorage.removeItem('userToken');
        
        // Atualizar interface
        checkUserLogin();
        
        // Redirecionar para a página inicial
        window.location.href = 'index.html';
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        const userProfile = document.getElementById('userProfile');
        const userMenu = userProfile ? userProfile.querySelector('.user-menu') : null;
        
        if (userMenu && !userProfile.contains(e.target)) {
            userMenu.style.display = 'none';
        }
    });

    // Abrir/fechar menu ao clicar no avatar
    document.addEventListener('DOMContentLoaded', function() {
        const userProfile = document.getElementById('userProfile');
        const userMenu = userProfile ? userProfile.querySelector('.user-menu') : null;
        
        if (userProfile) {
            userProfile.addEventListener('click', function(e) {
                e.stopPropagation();
                if (userMenu) {
                    userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
                }
            });
        }
        
        // Verificar login ao carregar a página
        checkUserLogin();
    });
});

// Dados dos animais disponíveis para adoção
const petsData = [
    {
        id: 1,
        name: 'Thor',
        category: 'dog',
        age: '2 anos',
        gender: 'Macho',
        size: 'Médio',
        image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Thor é um cachorro muito brincalhão e cheio de energia! Ele adora correr e brincar com outros cachorros. É amigável com crianças e muito inteligente.',
        location: 'Cuiabá, MT',
        castrated: true,
        vaccinated: true,
        dewormed: true,
        specialNeeds: false,
        history: 'Thor foi resgatado de uma situação de abandono quando tinha apenas 6 meses. Ele estava magro e assustado, mas com muito amor e paciência se recuperou completamente. Hoje é um cão saudável e feliz que busca um lar amoroso.',
        personality: {
            friendly: 90,
            active: 95,
            quiet: 30,
            sociable: 85
        }
    },
    {
        id: 2,
        name: 'Luna',
        category: 'cat',
        age: '5 anos',
        gender: 'Fêmea',
        size: 'Pequeno',
        image: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Luna é uma gata independente e carinhosa quando quer! Ela gosta de tranquilidade e momentos de carinho no seu tempo. Perfeita para quem busca uma companheira mais calma.',
        location: 'Cuiabá, MT',
        castrated: true,
        vaccinated: true,
        dewormed: true,
        specialNeeds: false,
        history: 'Luna foi encontrada em uma caixa de papelão perto de um supermercado. Ela estava com seus filhotes que já foram todos adotados. Agora é a vez dela encontrar um lar cheio de amor e respeito pelo seu espaço.',
        personality: {
            friendly: 70,
            active: 50,
            quiet: 85,
            sociable: 60
        }
    },
    {
        id: 3,
        name: 'Max',
        category: 'dog',
        age: '3 anos',
        gender: 'Macho',
        size: 'Grande',
        image: 'https://images.pexels.com/photos/58997/pexels-photo-58997.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Max é um cachorro forte e protetor! Ele tem um coração gigante e é muito leal. Ideal para famílias que desejam um animal companheiro e vigilante.',
        location: 'Cuiabá, MT',
        castrated: true,
        vaccinated: true,
        dewormed: true,
        specialNeeds: false,
        history: 'Max foi resgatado de uma situação de maus-tratos quando tinha 1 ano. Apesar do passado difícil, ele se recuperou completamente e é agora um cão extremamente amoroso que adora a companhia humana.',
        personality: {
            friendly: 80,
            active: 70,
            sociable: 75
        }
    },
    {
        id: 4,
        name: 'Félix',
        category: 'cat',
        age: '12 anos',
        gender: 'Macho',
        size: 'Pequeno',
        image: 'https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Félix é um gato idoso e extremamente tranquilo! Ele adora dormir e receber carinho. Perfeito para quem busca um companheiro calmo para os momentos de relaxamento.',
        location: 'Cuiabá, MT',
        castrated: true,
        vaccinated: true,
        dewormed: true,
        specialNeeds: true,
        history: 'Félix teve um lar por muitos anos, mas infelizmente seu tutor faleceu e nenhum familiar pôde ficar com ele. É um gato muito amoroso que está acostumado com a vida doméstica e busca um novo lar para passar seus anos dourados.',
        personality: {
            friendly: 75,
            active: 20,
            sociable: 50
        }
    },
    {
        id: 5,
        name: 'Bob',
        category: 'dog',
        age: '4 anos',
        gender: 'Macho',
        size: 'Grande',
        image: 'https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Bob é um cachorro dócil e muito protetor! Ele adora passear e é ótimo para famílias. Muito paciente com crianças e outros animais.',
        location: 'Cuiabá, MT',
        castrated: true,
        vaccinated: true,
        dewormed: true,
        specialNeeds: false,
        history: 'Bob foi encontrado vagando em uma estrada rural, aparentemente abandonado. Estava machucado e assustado, mas se recuperou e agora está pronto para encontrar uma família que lhe dê o amor que merece.',
        personality: {
            friendly: 95,
            active: 80,
            sociable: 90
        }
    },
    {
        id: 6,
        name: 'Mia',
        category: 'cat',
        age: '1 ano',
        gender: 'Fêmea',
        size: 'Pequeno',
        image: 'https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Mia é uma gata brincalhona e muito sociável com pessoas! Ela adora explorar a casa e é muito curiosa. Ideal para quem quer um animal interativo.',
        location: 'Cuiabá, MT',
        castrated: true,
        vaccinated: true,
        dewormed: true,
        specialNeeds: false,
        history: 'Mia foi resgatada junto com seus irmãos de uma colônia de gatos de rua. Ela é a mais sociável de todos e se adaptou muito bem à vida doméstica, mostrando-se carinhosa e brincalhona.',
        personality: {
            friendly: 90,
            active: 95,
            sociable: 85
        }
    }
];

// Inicializar alternância de tema
function initThemeToggle() {
    // Usar tema claro por padrão
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    
    // Ajustar o botão de tema para refletir a alteração
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.querySelector('i').classList.remove('fa-moon');
        themeToggle.querySelector('i').classList.add('fa-sun');
    }
    
    // Aplicar o tema claro aos elementos
    updateFormTheme('light');
}

// Função para atualizar o tema do formulário
function updateFormTheme(theme) {
    // Esta função garante que os estilos específicos para o tema sejam aplicados
    console.log(`Tema atualizado para: ${theme}`);
    
    // Ajustar cores do cabeçalho do modal conforme o tema
    const modalTitles = document.querySelectorAll('.modal-header h2');
    const petNameModals = document.querySelectorAll('#petNameModal');
    
    if (modalTitles) {
        modalTitles.forEach(title => {
            if (theme === 'dark') {
                title.style.color = 'white';
            } else {
                title.style.color = 'black';
            }
        });
    }
    
    if (petNameModals) {
        petNameModals.forEach(name => {
            if (theme === 'dark') {
                name.style.color = 'white';
            } else {
                name.style.color = 'black';
            }
        });
    }
}

// Função para inicializar o menu mobile
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');

    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
}

// Mensagem quando nenhum animal é selecionado na página de detalhes
function showNoAnimalSelected() {
    document.getElementById('pet-details').innerHTML = `
        <div class="error-message">
            <h3>Nenhum animal selecionado</h3>
            <p>Por favor, volte para a página de adoção e escolha um animal para ver mais detalhes.</p>
            <a href="adocao.html" class="btn btn-primary">Ver animais disponíveis</a>
        </div>
    `;
}

// Função para carregar os detalhes do animal
function loadPetDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get('id');
    
    if (!petId) {
        showNoAnimalSelected();
        return;
    }
    
    const pet = petsData.find(p => p.id === parseInt(petId));
    
    if (!pet) {
        showNoAnimalSelected();
        return;
    }
    
    document.title = `${pet.name} - Detalhes do Pet`;
    
    // Selecionar o container de detalhes do pet
    const petDetailsContainer = document.getElementById('pet-details');
    
    if (!petDetailsContainer) {
        console.error('Container de detalhes do pet não encontrado');
        return;
    }
    
    // Construir HTML para o pet com layout melhorado
    const petHTML = `
        <div class="pet-details-container">
            <div class="pet-details-grid">
                <div class="pet-image-container">
                    <img src="${pet.image}" alt="${pet.name}" class="pet-details-image">
                </div>
                <div class="pet-info-container">
                    <h1>${pet.name}</h1>
                    <div class="pet-meta">
                        <span class="pet-age"><i class="fas fa-birthday-cake"></i> ${pet.age}</span>
                        <span class="pet-gender"><i class="fas fa-${pet.gender === 'Macho' ? 'mars' : 'venus'}"></i> ${pet.gender}</span>
                        <span class="pet-size"><i class="fas fa-ruler-vertical"></i> Porte ${pet.size}</span>
                    </div>
                    <div class="pet-location">
                        <i class="fas fa-map-marker-alt"></i> ${pet.location}
                    </div>
                    <div class="pet-status">
                        <span class="status-item ${pet.vaccinated ? 'active' : ''}">
                            <i class="fas fa-syringe"></i> Vacinado
                        </span>
                        <span class="status-item ${pet.castrated ? 'active' : ''}">
                            <i class="fas fa-cut"></i> Castrado
                        </span>
                        <span class="status-item ${pet.dewormed ? 'active' : ''}">
                            <i class="fas fa-pills"></i> Vermifugado
                        </span>
                    </div>
                    
                    <div class="pet-description-section">
                        <h2>Sobre ${pet.name}</h2>
                        <p class="pet-description">${pet.description}</p>
                    </div>
                    
                    <div class="pet-history-section">
                        <h2>História</h2>
                        <p>${pet.history}</p>
                    </div>
                    
                    <div class="pet-personality-section">
                        <h2>Personalidade</h2>
                        <div class="pet-personality-container">
                            ${generatePersonalityHTML(pet)}
                        </div>
                    </div>
                    
                    <button class="adopt-button" onclick="openAdoptionModal()">
                        <i class="fas fa-heart"></i> Quero adotar ${pet.name}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Atualizar o conteúdo do container
    petDetailsContainer.innerHTML = petHTML;
    
    // Carregar pets similares em um container separado
    const similarPetsContainer = document.createElement('div');
    similarPetsContainer.id = 'similar-pets-container';
    petDetailsContainer.appendChild(similarPetsContainer);
    
    // Carregar pets similares
    loadSimilarPets(pet);
    
    // Atualizar o nome do pet no modal
    const petNameInModal = document.getElementById('petNameInModal');
    if (petNameInModal) {
        petNameInModal.textContent = pet.name;
    }
    
    // Inicializar o modal de adoção
    initAdoptionModal();
}

// Função auxiliar para gerar o HTML da personalidade
function generatePersonalityHTML(pet) {
    if (!pet.personality) return '';
    
    if (typeof pet.personality === 'object' && !Array.isArray(pet.personality)) {
        let html = '<div class="pet-personality">';
        
        // Tradução dos traços de personalidade para português
        const translations = {
            'friendly': 'Amigável',
            'active': 'Ativo',
            'quiet': 'Calmo',
            'playful': 'Brincalhão',
            'independent': 'Independente',
            'affectionate': 'Afetuoso',
            'curious': 'Curioso',
            'brave': 'Corajoso',
            'loyal': 'Leal'
        };
        
        for (const trait in pet.personality) {
            if (trait.toLowerCase() === 'sociable') continue;
            
            const value = pet.personality[trait];
            const level = getPersonalityLevel(value);
            const icon = getPersonalityIcon(trait);
            const translatedTrait = translations[trait.toLowerCase()] || capitalizeFirstLetter(trait);
            
            let displayWidth = value;
            if (level === 'low') {
                displayWidth = value * 0.6;
            } else if (level === 'medium') {
                displayWidth = value * 0.8;
            }
            
            html += `
                <div class="personality-item">
                    <span><i class="${icon}"></i>${translatedTrait}</span>
                    <div class="personality-bar">
                        <div class="personality-level ${level}" style="width: ${displayWidth}%"></div>
                    </div>
                </div>`;
        }
        
        html += '</div>';
        return html;
    } else if (Array.isArray(pet.personality)) {
        let html = '<div class="pet-tags"><h3>Características</h3>';
        pet.personality.forEach(trait => {
            html += `<span class="pet-tag">${trait}</span>`;
        });
        html += '</div>';
        return html;
    }
    
    return '';
}

// Função para determinar o nível de personalidade com base no valor percentual
function getPersonalityLevel(value) {
    if (value >= 70) return 'high';
    if (value >= 40) return 'medium';
    return 'low';
}

// Função para obter o ícone de personalidade com base no nome da característica
function getPersonalityIcon(trait) {
    const icons = {
        'friendly': 'fas fa-smile',
        'active': 'fas fa-running',
        'quiet': 'fas fa-volume-down',
        'playful': 'fas fa-baseball-ball',
        'independent': 'fas fa-user',
        'affectionate': 'fas fa-heart',
        'curious': 'fas fa-search',
        'brave': 'fas fa-shield-alt',
        'loyal': 'fas fa-handshake'
    };
    
    return icons[trait.toLowerCase()] || 'fas fa-paw';
}

// Função para capitalizar a primeira letra de uma string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Função para carregar animais similares
function loadSimilarPets(currentPet) {
    const similarPets = petsData
        .filter(pet => pet.id !== currentPet.id)
        .slice(0, 3); // Mostrar apenas 3 animais similares
    
    const similarPetsContainer = document.getElementById('similar-pets-container');
    if (!similarPetsContainer) return;

    let similarPetsHTML = '<h2>Outros animais que você pode gostar</h2><div class="similar-pets-grid">';
    
    similarPets.forEach(pet => {
        similarPetsHTML += `
            <div class="pet-card">
                <div class="pet-image">
                    <img src="${pet.image}" alt="${pet.name}">
                    <div class="pet-tag">${pet.category === 'dog' ? 'Cachorro' : 'Gato'}</div>
                </div>
                <div class="pet-info">
                    <h3>${pet.name}</h3>
                    <p class="pet-desc">${pet.age}, ${pet.gender}, Porte ${pet.size}</p>
                    <p class="pet-location"><i class="fas fa-map-marker-alt"></i> ${pet.location}</p>
                    <a href="pet-details.html?id=${pet.id}" class="btn btn-highlight">Ver detalhes</a>
                </div>
            </div>
        `;
    });
    
    similarPetsHTML += '</div>';
    similarPetsContainer.innerHTML = similarPetsHTML;
}

// Inicializar filtros na página de adoção
function initFilters() {
    const filterForms = document.querySelectorAll('.filter-select, .filter-input');
    const resetButton = document.getElementById('resetFilters');
    const petCards = document.querySelectorAll('.pet-card');
    
    // Aplicar filtros quando os controles de filtro mudarem
    filterForms.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    // Resetar filtros
    if (resetButton) {
        resetButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            filterForms.forEach(filter => {
                filter.value = '';
            });
            
            applyFilters();
        });
    }
    
    // Função para aplicar filtros
    function applyFilters() {
        const categoryFilter = document.getElementById('category')?.value || '';
        const ageFilter = document.getElementById('age')?.value || '';
        const sizeFilter = document.getElementById('size')?.value || '';
        
        petCards.forEach(card => {
            const cardCategory = card.dataset.category;
            const cardAge = card.dataset.age;
            const cardSize = card.dataset.size;
            
            const categoryMatch = !categoryFilter || cardCategory === categoryFilter;
            const ageMatch = !ageFilter || cardAge === ageFilter;
            const sizeMatch = !sizeFilter || cardSize === sizeFilter;
            
            if (categoryMatch && ageMatch && sizeMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Inicializa o modal de adoção e define os eventos
function initAdoptionModal() {
    const modal = document.getElementById('adoptionModal');
    if (!modal) return;
    
    const closeButton = modal.querySelector('.close-btn');
    const adoptionForm = document.getElementById('adoptionForm');
    const checkCompatibilityBtn = document.getElementById('check-compatibility');
    const submitBtn = document.getElementById('submit-application');
    const compatibilityResult = document.getElementById('compatibility-result');
    const compatibilityPercentage = document.getElementById('compatibility-percentage');
    const compatibilityFill = document.querySelector('.compatibility-fill');
    const compatibilityMessage = document.getElementById('compatibility-message');
    
    let isModalOpen = false;
    let compatibilityChecked = false;
    
    // Mostrar/ocultar campos de acordo com o tipo de residência
    document.querySelectorAll('input[name="residence_type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelectorAll('.residence-details').forEach(el => {
                el.style.display = 'none';
            });
            
            if (this.value === 'casa') {
                document.getElementById('house-details').style.display = 'block';
            } else if (this.value === 'apartamento') {
                document.getElementById('apartment-details').style.display = 'block';
            }
        });
    });
    
    // Função para verificar a compatibilidade
    function checkCompatibility() {
        // Obter valores do formulário
        const experience = document.getElementById('experience').value;
        const residenceType = document.querySelector('input[name="residence_type"]:checked')?.value;
        const hasYard = document.getElementById('has_yard')?.checked || false;
        const allowsPets = document.getElementById('allows_pets')?.checked || false;
        const timeAvailable = document.getElementById('time_available').value;
        const income = document.getElementById('income').value;
        
        // Calcular pontuação base (0-100)
        let score = 0;
        let factors = [];
        
        // Experiência com animais (até 30 pontos)
        const experienceScores = {
            'nenhuma': 10,
            'pouca': 20,
            'media': 25,
            'muita': 30
        };
        score += experienceScores[experience] || 0;
        factors.push(`Experiência com animais: +${experienceScores[experience] || 0}%`);
        
        // Tipo de residência (até 25 pontos)
        if (residenceType === 'casa') {
            score += hasYard ? 25 : 15;
            factors.push(`Moradia adequada: +${hasYard ? 25 : 15}%`);
        } else if (residenceType === 'apartamento') {
            score += allowsPets ? 20 : 5;
            factors.push(`Apartamento ${allowsPets ? 'permite' : 'não permite'} animais: +${allowsPets ? 20 : 5}%`);
        }
        
        // Tempo disponível (até 25 pontos)
        const timeScores = {
            'pouco': 5,
            'medio': 15,
            'muito': 25
        };
        score += timeScores[timeAvailable] || 0;
        factors.push(`Tempo disponível: +${timeScores[timeAvailable] || 0}%`);
        
        // Renda (até 20 pontos)
        const incomeScores = {
            'baixa': 5,
            'media_baixa': 10,
            'media': 15,
            'alta': 20
        };
        score += incomeScores[income] || 0;
        factors.push(`Renda: +${incomeScores[income] || 0}%`);
        
        // Garantir que a pontuação esteja entre 0 e 100
        score = Math.max(0, Math.min(100, score));
        
        return { score, factors };
    }
    
    // Função para exibir o resultado da compatibilidade
    function displayCompatibility(score, factors) {
        compatibilityPercentage.textContent = `${score}%`;
        compatibilityFill.style.width = `${score}%`;
        
        let message = '';
        if (score >= 80) {
            message = 'Excelente! Você tem um perfil muito compatível para adoção!';
        } else if (score >= 60) {
            message = 'Boa compatibilidade! Vamos analisar seu pedido.';
        } else if (score >= 40) {
            message = 'Compatibilidade média. Podemos conversar mais sobre sua situação.';
        } else {
            message = 'Sua compatibilidade está baixa. Vamos analisar seu caso com cuidado.';
        }
        
        compatibilityMessage.innerHTML = `
            <strong>Fatores considerados:</strong><br>
            ${factors.join('<br>')}
            <br><br>
            <strong>Observação:</strong> ${message}
        `;
        
        compatibilityResult.style.display = 'block';
        submitBtn.disabled = false;
        compatibilityChecked = true;
    }
    
    // Função para abrir o modal
    function openModal() {
        if (isModalOpen) return;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = '15px';
        isModalOpen = true;
        compatibilityChecked = false;
        
        // Resetar resultados de compatibilidade
        if (compatibilityResult) {
            compatibilityResult.style.display = 'none';
            compatibilityPercentage.textContent = '0%';
            compatibilityFill.style.width = '0%';
            submitBtn.disabled = true;
        }
        
        // Mostrar os campos corretos de acordo com o tipo de residência
        const selectedResidence = document.querySelector('input[name="residence_type"]:checked');
        if (selectedResidence) {
            selectedResidence.dispatchEvent(new Event('change'));
        }
        
        // Adicionar um pequeno atraso para acionar a animação
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
    
    // Função para fechar o modal
    function closeModal() {
        if (!isModalOpen) return;
        
        modal.classList.remove('active');
        
        // Aguardar a animação terminar antes de esconder
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            document.body.style.paddingRight = '';
            isModalOpen = false;
            
            // Resetar o formulário
            if (adoptionForm) {
                adoptionForm.reset();
            }
        }, 300);
    }
    
    // Abre o modal quando o botão de adoção é clicado
    window.openAdoptionModal = function() {
        openModal();
        return false;
    };
    
    // Fecha o modal quando o botão de fechar é clicado
    if (closeButton) {
        closeButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
    }
    
    // Verificar compatibilidade
    if (checkCompatibilityBtn) {
        checkCompatibilityBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Verificar se todos os campos obrigatórios estão preenchidos
            const requiredFields = adoptionForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value) {
                    isValid = false;
                    field.style.borderColor = '#ff6b6b';
                    setTimeout(() => {
                        field.style.borderColor = '';
                    }, 2000);
                }
            });
            
            if (!isValid) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            const { score, factors } = checkCompatibility();
            displayCompatibility(score, factors);
            
            // Rolar até o resultado
            compatibilityResult.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Fecha o modal quando se clica fora do conteúdo
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Fecha o modal ao pressionar a tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isModalOpen) {
            closeModal();
        }
    });
    
    // Impedir propagação de eventos no conteúdo do modal
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Enviar o formulário
    if (adoptionForm) {
        adoptionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!compatibilityChecked) {
                alert('Por favor, verifique a compatibilidade antes de enviar.');
                return false;
            }
            
            // Aqui você pode adicionar a lógica de envio do formulário
            const formData = new FormData(adoptionForm);
            const formObject = {};
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            console.log('Dados do formulário:', formObject);
            
            // Simular envio (substitua por uma chamada AJAX real)
            setTimeout(() => {
                alert('Solicitação de adoção enviada com sucesso! Entraremos em contato em breve.');
                closeModal();
            }, 500);
            
            return false;
        });
    }
}

// Função para verificar a compatibilidade
function checkCompatibility() {
    // Obter valores dos campos
    const experience = document.getElementById('experience').value;
    const otherPets = document.getElementById('otherPets').value;
    const houseType = document.getElementById('houseType').value;
    const timeAvailable = document.getElementById('timeAvailable').value;
    const income = document.getElementById('income').value;
    
    // Obter características do pet atual
    const petId = new URLSearchParams(window.location.search).get('id');
    const pet = petsData.find(p => p.id.toString() === petId);
    
    if (!pet) return;
    
    // Calcular pontuações para cada fator
    let experienceScore = 0;
    let petsScore = 0;
    let houseScore = 0;
    let timeScore = 0;
    let incomeScore = 0;
    
    // Lógica de experiência
    switch (experience) {
        case 'muita': experienceScore = 100; break;
        case 'alguma': experienceScore = 75; break;
        case 'pouca': experienceScore = 50; break;
        case 'nenhuma': experienceScore = 25; break;
    }
    
    // Lógica de outros animais
    switch (otherPets) {
        case 'nenhum': 
            // Verificar se personality é um objeto ou propriedades diretas
            petsScore = (typeof pet.personality === 'object' && pet.personality.friendly !== undefined 
                ? pet.personality.friendly 
                : pet.friendly) > 70 ? 60 : 80; 
            break;
        case 'poucos': 
            petsScore = (typeof pet.personality === 'object' && pet.personality.friendly !== undefined 
                ? pet.personality.friendly 
                : pet.friendly) > 70 ? 90 : 60; 
            break;
        case 'muitos': 
            petsScore = (typeof pet.personality === 'object' && pet.personality.friendly !== undefined 
                ? pet.personality.friendly 
                : pet.friendly) > 70 ? 70 : 40; 
            break;
    }
    
    // Lógica de tipo de casa
    switch (houseType) {
        case 'casa': houseScore = pet.size === 'Pequeno' ? 80 : (pet.size === 'Médio' ? 90 : 100); break;
        case 'apartamentoGrande': houseScore = pet.size === 'Pequeno' ? 85 : (pet.size === 'Médio' ? 70 : 50); break;
        case 'apartamentoPequeno': houseScore = pet.size === 'Pequeno' ? 70 : (pet.size === 'Médio' ? 40 : 20); break;
    }
    
    // Lógica de tempo disponível
    switch (timeAvailable) {
        case 'muito': timeScore = 100; break;
        case 'medio': timeScore = 70; break;
        case 'pouco': timeScore = 40; break;
    }
    
    // Lógica de renda
    switch (income) {
        case 'alta': incomeScore = 100; break;
        case 'media': incomeScore = 70; break;
        case 'baixa': incomeScore = 40; break;
    }
    
    // Fatores específicos com base no tipo/personalidade do animal
    let factors = [
        { name: 'Experiência com animais', score: experienceScore },
        { name: 'Compatibilidade com outros pets', score: petsScore },
        { name: 'Adequação do lar', score: houseScore },
        { name: 'Tempo disponível', score: timeScore },
        { name: 'Recursos financeiros', score: incomeScore }
    ];
    
    // Calcular pontuação final (média dos fatores)
    const totalScore = Math.round(factors.reduce((sum, factor) => sum + factor.score, 0) / factors.length);
    
    // Exibir resultado
    displayCompatibilityResult(totalScore, factors, pet);
    
    // Habilitar botão de adoção se compatibilidade for aceitável
    document.getElementById('submitAdoption').disabled = totalScore < 40;
}

function displayCompatibilityResult(score, factors, pet) {
    const resultDiv = document.getElementById('compatibilityResult');
    const factorsListEl = document.getElementById('compatibilityFactors');
    
    // Determinar classe CSS e mensagem com base na pontuação
    let scoreClass = '';
    let message = '';
    
    if (score >= 75) {
        scoreClass = 'high';
        message = `Você parece ser um excelente match para ${pet.name}! Sua combinação é muito promissora.`;
    } else if (score >= 50) {
        scoreClass = 'medium';
        message = `Você e ${pet.name} parecem ser compatíveis, com alguns aspectos a considerar.`;
    } else {
        scoreClass = 'low';
        message = `Existem alguns desafios para adoção de ${pet.name}. Recomendamos conversar com nossa equipe.`;
    }
    
    // Criar conteúdo HTML
    let html = `
        <h4>Resultado da Compatibilidade</h4>
        <div class="compatibility-score ${scoreClass}">${score}%</div>
        <p id="compatibilityMessage">${message}</p>
        <h5>Fatores Avaliados:</h5>
        <ul id="compatibilityFactors">
    `;
    
    // Adicionar cada fator
    factors.forEach(factor => {
        let factorClass = '';
        if (factor.score >= 75) factorClass = 'high';
        else if (factor.score >= 50) factorClass = 'medium';
        else factorClass = 'low';
        
        html += `<li>${factor.name} <span class="${factorClass}">${factor.score}%</span></li>`;
    });
    
    html += `</ul>`;
    resultDiv.innerHTML = html;
    resultDiv.style.display = 'block';
}

// Função para lidar com o envio do formulário de adoção
function handleAdoptionSubmit() {
    const form = document.getElementById('adoptionForm');
    const petNameInModal = document.getElementById('petNameInModal');
    
    // Get form data
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const experience = document.getElementById('experience').value;
    const otherPets = document.getElementById('otherPets').value;
    const houseType = document.getElementById('houseType').value;
    const timeAvailable = document.getElementById('timeAvailable').value;
    const income = document.getElementById('income').value;

    // Create email body
    const emailBody = `
Olá! Gostaria de adotar o pet ${petNameInModal.textContent}!

Informações do Adotante:
Nome: ${nome}
Telefone: ${telefone}
Email: ${email}

Informações Adicionais:
Experiência com animais: ${document.getElementById('experience').options[document.getElementById('experience').selectedIndex].text}
Outros animais: ${document.getElementById('otherPets').options[document.getElementById('otherPets').selectedIndex].text}
Tipo de moradia: ${document.getElementById('houseType').options[document.getElementById('houseType').selectedIndex].text}
Tempo disponível: ${document.getElementById('timeAvailable').options[document.getElementById('timeAvailable').selectedIndex].text}
Renda para cuidados: ${document.getElementById('income').options[document.getElementById('income').selectedIndex].text}

Aguardo retorno!
Atenciosamente,
${nome}`;

    // Create mailto link
    const mailtoLink = `mailto:adotemais@gmail.com?subject=Solicitação de Adoção - ${petNameInModal.textContent}&body=${encodeURIComponent(emailBody)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Close modal
    const modal = document.getElementById('adoptionModal');
    modal.classList.remove('active');
    
    // Show success message
    alert('Redirecionando para seu cliente de email para enviar a solicitação de adoção!');
} 