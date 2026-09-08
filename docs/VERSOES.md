# Histórico de Versões

## v0.1

- Login
- Firebase

## v0.2

- Dashboard
- PDF

## v0.3

- Horas Trabalhadas
- Dias Trabalhados

## v0.4

- Tela Meu Dia (Versão 1)

## Versão 2.0.0 - Em desenvolvimento

### Dashboard e indicadores financeiros

- Corrigida a separação entre faturamento bruto e resultado líquido.
- Adicionado o custo de combustível ao Resumo.
- Adicionada a identificação de Outros gastos.
- O Saldo líquido passou a descontar combustível e outros gastos.
- A reserva financeira passou a ser calculada sobre o saldo líquido.
- Corrigidos os cálculos de Melhor Dia e Média Diária.
- Os indicadores de desempenho passaram a utilizar resultados líquidos.
- Melhorada a transparência e a consistência das informações financeiras.
- Padronizada a lógica financeira entre o Dashboard e o relatório PDF.

---

## Versão 2.1.0 - Monetização

### Sistema de teste grátis

- Implementado período de teste grátis de 15 dias.
- Adicionado controle do início do período de teste.
- Implementada contagem dos dias restantes.
- Implementada verificação de teste ativo ou expirado.

### Controle de acesso

- Implementada verificação de acesso do usuário.
- Usuários em período de teste possuem acesso completo.
- Usuários com plano `premium` possuem acesso liberado.
- Usuários sem acesso são direcionados para a tela de assinatura.

### Assinatura

- Criada a tela "Seu plano".
- Definida assinatura mensal de R$ 9,90.
- Criado plano recorrente no Mercado Pago.
- Configurada cobrança no dia da adesão.
- Configurada duração ilimitada.
- Desativado período de teste no Mercado Pago.
- Criado código de referência `CM-MENSAL-990`.
- Link de assinatura integrado ao aplicativo.

### Estado atual

- Teste grátis implementado e validado.
- Controle de acesso implementado e validado.
- Tela de assinatura implementada e validada.
- Link do Mercado Pago funcionando.

### Em desenvolvimento

- Confirmação automática do pagamento do Mercado Pago.
- Atualização automática do usuário para `premium`.
- Liberação automática após confirmação do pagamento.
- Controle de cancelamento e inadimplência.
