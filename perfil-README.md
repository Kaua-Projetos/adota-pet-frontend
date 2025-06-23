# Página de Perfil - Adote+

Este documento descreve a implementação e as funcionalidades da página de perfil do usuário no site Adote+.

## Visão Geral

A página de perfil foi projetada para oferecer uma experiência de usuário moderna, acessível e responsiva, permitindo que os usuários visualizem e gerenciem suas informações pessoais, interesses e animais favoritos.

## Funcionalidades

### 1. Cabeçalho do Perfil
- Exibe a foto de perfil do usuário (ou a inicial do nome)
- Nome completo do usuário
- Data de cadastro
- Botões de ação (Editar perfil, Alterar foto)

### 2. Seção de Informações Pessoais
- E-mail cadastrado
- Telefone
- Endereço
- CPF

### 3. Interesses
- Exibe os interesses do usuário em formato de tags
- Botão para editar interesses

### 4. Favoritos
- Lista de animais favoritados pelo usuário
- Mensagem amigável quando não há favoritos
- Botão para encontrar pets para adoção

## Melhorias de UX/UI

### Animações e Transições
- Efeito de fade-in ao carregar a página
- Animações suaves em botões e elementos interativos
- Transições suaves entre estados de hover/foco

### Responsividade
- Layout adaptável para diferentes tamanhos de tela
- Ajustes específicos para dispositivos móveis
- Melhorias de toque para telas sensíveis

### Acessibilidade
- Suporte a navegação por teclado
- Contraste aprimorado para melhor legibilidade
- Suporte a leitores de tela
- Opção para reduzir movimento

### Tema Escuro
- Design otimizado para modo escuro
- Transição suave entre temas
- Cores acessíveis em ambos os temas

## Estrutura de Arquivos

```
assets/
├── css/
│   └── style.css          # Estilos principais (incluindo a página de perfil)
└── js/
    └── profile.js         # Lógica JavaScript da página de perfil
perfil.html                # Página de perfil
perfil-README.md           # Este arquivo
```

## Como Usar

1. Certifique-se de que o usuário está autenticado (a página redirecionará para o login se não estiver)
2. Acesse a página de perfil através do menu de navegação
3. Visualize ou edite as informações conforme necessário

## Personalização

### Cores
As cores podem ser personalizadas através das variáveis CSS no início do arquivo `style.css`:

```css
:root {
    --primary-color: #A06235;
    --text-color: #523A28;
    --bg-color: #ffffff;
    /* Outras variáveis de cor */
}
```

### Tema Escuro
O tema escuro é ativado adicionando o atributo `data-theme="dark"` ao elemento `html`.

## Compatibilidade

- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Suporte para versões mais antigas com fallbacks
- Funcionalidade básica em navegadores sem suporte a JavaScript

## Melhorias Futuras

- [ ] Upload de foto de perfil
- [ ] Edição em linha de informações do perfil
- [ ] Integração com redes sociais
- [ ] Histórico de adoções

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).
