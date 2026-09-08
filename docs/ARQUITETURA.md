# Arquitetura do Controle Motoristas

## Regra

O Controle Motoristas não deve repetir informações que o motorista já vê na Uber. Deve mostrar aquilo que a Uber não mostra.

---

## Resumo

- Dashboard
- Meta diária
- Indicadores
- Comparativo semanal
- Ranking
- Gráficos

---

## Meu Dia

- Resumo do dia
- Corridas do dia
- Lucro líquido
- Tempo trabalhado
- Quilômetros rodados
- Meta do dia

---

## Corridas

- Nova corrida
- Editar corrida
- Excluir corrida
- Filtros

---

## Gastos

- Novo gasto
- Editar gasto
- Excluir gasto

---

## Relatórios

- Diário
- Semanal
- Mensal
- Anual
- PDF

---

## Configurações

- Meta diária
- Reserva
- Tipo de veículo
- Tema
- Backup

---

## Regra Financeira

A lógica financeira oficial do Controle Motoristas deve manter separados o faturamento bruto, os custos operacionais e a reserva financeira.

### Cálculo do saldo líquido

**Faturamento bruto**  
− **Combustível**  
− **Outros gastos**  
= **Saldo líquido**

### Cálculo da reserva financeira

**Saldo líquido × percentual da reserva = Reserva financeira**

### Definição dos indicadores

- **Renda:** faturamento bruto das corridas.
- **Combustível:** custo de combustível calculado nas corridas.
- **Outros gastos:** despesas cadastradas pelo motorista.
- **Saldo líquido:** faturamento bruto menos combustível e outros gastos.
- **Reserva:** percentual calculado sobre o saldo líquido.
- **Melhor dia:** melhor resultado líquido diário.
- **Média diária:** média dos resultados líquidos dos dias trabalhados.
- **Melhor dia da semana:** resultado líquido acumulado por dia da semana.
- **Melhor período:** resultado líquido acumulado por período do dia.
- **Maior corrida:** maior valor bruto recebido em uma corrida.

---

## Regra de Acesso

O acesso ao Controle Motoristas é controlado pelo Firebase.

### Período de teste

- Novo usuário recebe 15 dias de teste grátis.
- O início do teste é registrado no campo `inicioTeste`.
- Durante o período de teste, o usuário possui acesso completo.
- Após o término do período, o acesso é direcionado para a tela de assinatura.

### Assinatura

- Plano mensal de R$ 9,90.
- Assinatura recorrente.
- Pagamento realizado através do Mercado Pago.
- Usuário com plano `premium` possui acesso liberado.

### Fluxo de acesso

Usuário autenticado

→ Verificação do plano

→ Verificação do período de teste

→ Acesso ao aplicativo

ou

→ Tela "Seu plano"

### Estado atual

O controle de acesso e o período de teste estão implementados.

A confirmação automática do pagamento do Mercado Pago e a atualização do plano para `premium` ainda estão em desenvolvimento.
