document.addEventListener('DOMContentLoaded', function() {
    loadPetDetails();
    initAdoptionModal();
    
    // Adicionar evento de clique ao botão de login
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }
});

function loadPetDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const petId = urlParams.get('id');
    
    if (!petId || typeof petsData === 'undefined') {
        showError('Erro ao carregar os dados do animal');
        return;
    }
    
    const pet = petsData.find(p => p.id === parseInt(petId));
    
    if (!pet) {
        showError('Animal não encontrado');
        return;
    }

    // Definir imagem padrão baseado na categoria do animal
    const defaultImage = pet.category === 'dog' 
        ? 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg'
        : 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg';
    
    document.title = `${pet.name} - Detalhes do Pet`;
    
    // Atualizar informações básicas
    document.getElementById('petName').textContent = pet.name;
    document.getElementById('petAge').textContent = pet.age;
    document.getElementById('petGender').textContent = pet.gender;
    document.getElementById('petSize').textContent = pet.size;
    document.getElementById('petLocation').textContent = pet.location;
    document.getElementById('petDescription').textContent = pet.description || 'Este adorável pet está procurando um lar amoroso. Com uma personalidade única e cheia de carinho para dar, será um companheiro perfeito para a família certa. Já está vacinado, castrado e pronto para fazer parte da sua vida!';
    document.getElementById('petHistory').textContent = pet.history || 'Este pet foi resgatado das ruas e desde então tem recebido todo o amor e cuidados necessários. Apesar do passado difícil, mantém um espírito alegre e amoroso, demonstrando que está pronto para uma nova chance de ser feliz em um lar permanente.';
    
    // Carregar imagem principal
    const mainImage = document.getElementById('petMainImage');
    mainImage.src = pet.image;
    mainImage.onerror = function() {
        this.src = defaultImage;
    };

    // Carregar miniaturas
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    thumbnailContainer.innerHTML = '';

    // Criar 4 miniaturas com a mesma imagem
    for (let i = 0; i < 4; i++) {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail' + (i === 0 ? ' active' : '');
        
        const img = document.createElement('img');
        img.src = pet.image;
        img.alt = `${pet.name} - Foto ${i + 1}`;
        img.onerror = function() {
            this.src = defaultImage;
        };
        
        thumbnail.appendChild(img);
        thumbnailContainer.appendChild(thumbnail);
    }

    // Atualizar personalidade
    const traits = document.querySelectorAll('.trait-fill');
    const defaultTraits = {
        'Amigável': 85,
        'Brincalhão': 90,
        'Sociável': 75,
        'Calmo': 70
    };

    traits.forEach((trait) => {
        const traitName = trait.parentElement.previousElementSibling.textContent.trim();
        const value = parseInt(trait.getAttribute('data-value'));
        
        // Set the width based on the value
        trait.style.width = `${value}%`;
        
        // Set the appropriate color class
        if (value >= 80) {
            trait.classList.add('high');
            trait.classList.remove('medium', 'low');
        } else if (value >= 50) {
            trait.classList.add('medium');
            trait.classList.remove('high', 'low');
        } else {
            trait.classList.add('low');
            trait.classList.remove('high', 'medium');
        }
    });

    // Atualizar requisitos de adoção
    const requirementsList = document.getElementById('adoptionRequirements');
    const defaultRequirements = [
        'Ter mais de 18 anos',
        'Residência própria ou com autorização do proprietário',
        'Comprometer-se com a saúde e bem-estar do animal',
        'Passar por entrevista de avaliação'
    ];

    requirementsList.innerHTML = (pet.requirements || defaultRequirements)
        .map(req => `<li>${req}</li>`)
        .join('');

    // Atualizar número de contato
    document.getElementById('contactNumber').textContent = pet.contact || '(XX) XXXXX-XXXX';

    // Atualizar nome do pet no modal
    const petNameInModal = document.getElementById('petNameInModal');
    if (petNameInModal) {
        petNameInModal.textContent = pet.name;
    }

    initImageGallery();
}

function initImageGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('petMainImage');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Remover classe active de todas as thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            // Adicionar classe active na thumbnail clicada
            this.classList.add('active');
            // Atualizar imagem principal
            mainImage.src = this.querySelector('img').src;
        });
    });
}

function changeMainImage(src) {
    const mainImage = document.querySelector('.pet-main-image img');
    mainImage.src = src;
}

function showError(message) {
    const petDetailsContainer = document.getElementById('pet-details');
    petDetailsContainer.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <h2>${message}</h2>
            <a href="adocao.html" class="btn btn-primary">Voltar para lista de animais</a>
        </div>
    `;
}

function initAdoptionModal() {
    const modal = document.getElementById('adoptionModal');
    const closeBtn = document.querySelector('.close-btn');
    const form = document.getElementById('adoptionForm');
    const checkCompatibilityBtn = document.getElementById('checkCompatibility');
    const submitBtn = document.getElementById('submitAdoption');
    
    // Fechar modal
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    
    // Abrir modal
    window.openAdoptionModal = function() {
        modal.style.display = "block";
        resetForm();
    }
    
    // Verificar compatibilidade
    checkCompatibilityBtn.onclick = function() {
        const score = calculateCompatibility();
        showCompatibilityResult(score);
    }
    
    // Enviar formulário
    form.onsubmit = function(e) {
        e.preventDefault();
        alert('Solicitação de adoção enviada com sucesso! Entraremos em contato em breve.');
        modal.style.display = "none";
        form.reset();
    }
}

function calculateCompatibility() {
    const moradia = document.querySelector('input[name="moradia"]:checked')?.value;
    const renda = document.getElementById('renda').value;
    
    let score = 0;
    
    // Avaliação da moradia
    if (moradia === 'casa') {
        score += 50;
    } else if (moradia === 'apartamento') {
        score += 30;
    }
    
    // Avaliação da renda
    if (renda >= 3) {
        score += 50;
    } else if (renda >= 2) {
        score += 30;
    } else {
        score += 20;
    }
    
    return Math.min(score, 100);
}

function showCompatibilityResult(score) {
    const resultDiv = document.getElementById('compatibilityResult');
    const scoreDiv = document.getElementById('compatibilityScore');
    const message = document.getElementById('compatibilityMessage');
    const submitBtn = document.getElementById('submitAdoption');
    
    resultDiv.style.display = 'block';
    scoreDiv.textContent = score + '%';
    
    if (score >= 70) {
        message.textContent = 'Ótimo! Você tem um perfil muito compatível para adoção!';
        submitBtn.disabled = false;
    } else if (score >= 50) {
        message.textContent = 'Bom! Você tem um perfil adequado para adoção.';
        submitBtn.disabled = false;
    } else {
        message.textContent = 'Recomendamos conversar com nossa equipe antes de prosseguir.';
        submitBtn.disabled = true;
    }
}

function resetForm() {
    const form = document.getElementById('adoptionForm');
    const resultDiv = document.getElementById('compatibilityResult');
    const submitBtn = document.getElementById('submitAdoption');
    
    form.reset();
    resultDiv.style.display = 'none';
    submitBtn.disabled = true;
}

// Controle do cabeçalho no scroll
const header = document.querySelector('.header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Controle do cabeçalho
    if (currentScrollY > lastScrollY) {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
    }
    
    lastScrollY = currentScrollY;
});

// Animação das barras de personalidade com fade in
document.addEventListener('DOMContentLoaded', () => {
    const traits = document.querySelectorAll('.trait');
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                
                const traitFill = entry.target.querySelector('.trait-fill');
                if (traitFill) {
                    const value = traitFill.getAttribute('data-value');
                    setTimeout(() => {
                        traitFill.style.width = `${value}%`;
                    }, 200);
                }
                
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });
    
    traits.forEach(trait => {
        trait.style.opacity = '0';
        trait.style.transform = 'translateX(-20px)';
        trait.style.transition = 'all 0.6s ease';
        fadeInObserver.observe(trait);
    });
}); 