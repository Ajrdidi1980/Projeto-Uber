# Diário de Desenvolvimento

## 07/07/2026

### Concluído

- Horas trabalhadas
- Quantidade de corridas
- Melhorias Dashboard

### Próxima tarefa

Tela Meu Dia

## [09/07/2026] - Tela Meu Dia (Versão 1)

### Implementado

- Tela "Meu Dia" criada.
- Navegação integrada.
- Data automática.
- Faturamento do dia.
- Gasto com combustível do dia.
- Lucro líquido do dia.
- Horas trabalhadas.
- Quilômetros rodados.
- Meta diária.

### Arquitetura

- A tela Meu Dia passou a utilizar apenas as receitas do dia.
- Não depende mais dos filtros do Dashboard.
- Independência entre Dashboard e Meu Dia.

### Próximos passos

- Revisar layout da tela.
- Melhorar exibição da meta.
- Implementar novos indicadores financeiros.

## [13/07/2026] - Correção e transparência dos indicadores financeiros

### Corrigido

- Corrigida a lógica financeira do Dashboard.
- O faturamento total passou a utilizar o valor bruto das corridas.
- Corrigido o desconto duplicado do combustível no cálculo do saldo.
- O saldo líquido passou a seguir a fórmula:
  - Receita bruta - Combustível - Outros gastos.
- A reserva financeira passou a ser calculada sobre o saldo líquido.
- Corrigido o cálculo do Melhor Dia.
- Corrigido o cálculo da Média Diária.
- Os indicadores diários foram separados da lógica de agrupamento dos gráficos.
- O Melhor Dia da Semana passou a considerar o resultado líquido das corridas.
- O Melhor Período passou a considerar o resultado líquido das corridas.

### Melhorias no Resumo

- Adicionado o card de Combustível.
- O card "Gastos" foi renomeado para "Outros gastos".
- O card "Saldo" foi renomeado para "Saldo líquido".
- Melhorada a transparência dos indicadores financeiros.
- O Resumo passou a seguir a mesma lógica financeira utilizada no relatório PDF.

### Estrutura financeira atual

- Renda = faturamento bruto.
- Combustível = custo de combustível calculado nas corridas.
- Outros gastos = despesas cadastradas manualmente.
- Saldo líquido = Renda - Combustível - Outros gastos.
- Reserva = percentual calculado sobre o saldo líquido.
- Melhor dia = melhor resultado líquido diário.
- Média diária = média dos resultados líquidos diários.
- Melhor dia da semana = resultado líquido acumulado.
- Melhor período = resultado líquido acumulado por período do dia.
- Maior corrida = maior valor bruto recebido em uma corrida.
