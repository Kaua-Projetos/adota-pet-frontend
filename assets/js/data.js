const petsData = [
    {
        id: 1,
        name: "Thor",
        category: "dog",
        breed: "Labrador",
        age: "2 anos",
        gender: "Macho",
        size: "Grande",
        location: "São Paulo, SP",
        description: "Thor é um labrador carinhoso e cheio de energia. Ele adora brincar ao ar livre e é extremamente amigável com crianças.",
        image: "assets/images/dog1.jpg",
        history: "Thor foi resgatado de uma situação de abandono há 6 meses, e desde então tem se recuperado muito bem. Ele está pronto para encontrar uma família que lhe dê muito amor e atenção.",
        castrated: true,
        vaccinated: true,
        dewormed: true,
        specialNeeds: false,
        personality: {
            friendly: 90,
            active: 85,
            quiet: 40,
            sociable: 95
        }
    },
    {
        id: 2,
        name: "Luna",
        category: "cat",
        breed: "Siamês",
        age: "1 ano",
        gender: "Fêmea",
        size: "Médio",
        location: "Rio de Janeiro, RJ",
        description: "Luna é uma gatinha siamesa dócil e brincalhona. Ela se adapta facilmente a novos ambientes e adora deitar no colo para receber carinho.",
        image: "assets/images/cat1.jpg",
        history: "Luna foi encontrada ainda filhote em uma caixa de papelão no centro da cidade. Ela foi cuidada em um lar temporário e agora está pronta para ter seu lar definitivo.",
        castrated: true,
        vaccinated: true,
        dewormed: true,
        specialNeeds: false,
        personality: {
            friendly: 75,
            active: 60,
            quiet: 80,
            sociable: 70
        }
    },
    {
        id: 3,
        name: "Max",
        category: "dog",
        breed: "Vira-lata",
        age: "3 anos",
        gender: "Macho",
        size: "Médio",
        location: "Belo Horizonte, MG",
        description: "Max é um cachorro muito esperto e leal. Ele aprende comandos rapidamente e é ótimo como animal de companhia.",
        image: "assets/images/dog2.jpg",
        history: "Max vivia nas ruas antes de ser resgatado por nossa equipe. Ele passou por um processo de reabilitação e treinamento, e agora está pronto para fazer parte de uma família.",
        castrated: true,
        vaccinated: true,
        dewormed: true,
        specialNeeds: false,
        personality: {
            friendly: 80,
            active: 75,
            quiet: 60,
            sociable: 85
        }
    },
    {
        id: 4,
        name: "Félix",
        category: "cat",
        breed: "Persa",
        age: "4 anos",
        gender: "Macho",
        size: "Pequeno",
        location: "Curitiba, PR",
        description: "Félix é um gato persa de pelagem macia e personalidade tranquila. Ele é independente, mas aprecia momentos de carinho com seus tutores.",
        image: "assets/images/cat2.jpg",
        history: "Félix foi doado por seu antigo tutor que precisou se mudar para outro país. Ele já está adaptado à vida em apartamento e convive bem com outros animais.",
        castrated: true,
        vaccinated: true,
        dewormed: true,
        specialNeeds: true,
        personality: {
            friendly: 60,
            active: 30,
            quiet: 95,
            sociable: 50
        }
    },
    {
        id: 5,
        name: "Bob",
        category: "dog",
        breed: "Bulldog Francês",
        age: "2 anos",
        gender: "Macho",
        size: "Pequeno",
        location: "Brasília, DF",
        description: "Bob é um bulldog francês muito carinhoso e brincalhão. Ele adora ficar perto das pessoas e é um ótimo cão de companhia.",
        image: "assets/images/dog3.jpg",
        history: "Bob veio de uma ninhada planejada, mas acabou não sendo adotado. Nossa ONG o acolheu e está buscando um lar amoroso para ele.",
        castrated: true,
        vaccinated: true,
        dewormed: true,
        specialNeeds: true,
        personality: {
            friendly: 95,
            active: 70,
            quiet: 50,
            sociable: 90
        }
    },
    {
        id: 6,
        name: "Mia",
        category: "cat",
        breed: "Angorá",
        age: "1 ano",
        gender: "Fêmea",
        size: "Médio",
        location: "Porto Alegre, RS",
        description: "Mia é uma gatinha angorá muito elegante e afetuosa. Ela gosta de brincar com bolinhas e é muito curiosa.",
        image: "assets/images/cat3.jpg",
        history: "Mia foi resgatada de uma colônia de gatos de rua quando ainda era filhote. Ela passou por cuidados veterinários e está saudável e pronta para adoção.",
        castrated: true,
        vaccinated: true,
        dewormed: true,
        specialNeeds: false,
        personality: {
            friendly: 85,
            active: 90,
            quiet: 40,
            sociable: 75
        }
    }
]; 