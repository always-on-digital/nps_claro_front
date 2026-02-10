

## Aprimorar Modal de Detalhes do Cliente

Baseado na imagem de referência, o modal será expandido de um diálogo simples para uma visão completa e rica do perfil do cliente, mantendo os dados mockados existentes e adicionando dados fictícios complementares.

### 1. Header do Perfil (topo do modal)
- Avatar circular com iniciais do cliente (gerado a partir do nome)
- Nome em destaque com ID do cliente ao lado
- Badge de engajamento colorido (ex: "HIGH ENGAGEMENT" baseado no NPS)
- Layout horizontal: avatar à esquerda, nome + badges à direita

### 2. Seção de Informações em 3 Colunas
- **Contatos**: email (gerado mock) e telefone com ícones
- **Dados Pessoais**: região/localização, data de cadastro, tempo como cliente
- **Informações de Consentimento**: badges de canais de contato (Email, WhatsApp, Phone, SMS) com destaque colorido para os ativos

### 3. Seção de Interesses/Produtos
- Exibir os produtos contratados como tags com ícones (similar aos "Interesses" da referência)
- Layout horizontal com badges estilizados

### 4. Cards de Métricas (3 cards horizontais)
- **NPS Score**: pontuação com indicador de tendência
- **Produtos**: quantidade de produtos contratados
- **Tempo como Cliente**: em meses/anos com comparativo
- Cada card com ícone colorido à direita e subtexto descritivo

### 5. Seção de Gráficos/Indicadores (3 painéis)
- **Evolução do NPS**: mini gráfico de linha mostrando histórico do score do cliente (dados mock)
- **Frequência de Interação**: indicador de frequência com total de interações, barra de progresso
- **Engajamento**: percentual de engajamento com taxa e canal preferido

### 6. Ajustes Visuais Gerais
- Modal mais largo (max-w-4xl) para acomodar o layout rico
- Separadores sutis entre seções
- Tipografia hierárquica clara (títulos de seção em uppercase cinza, valores em destaque)
- Fundo limpo com cards internos para métricas e gráficos

