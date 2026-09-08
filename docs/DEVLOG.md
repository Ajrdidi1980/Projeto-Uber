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

## [19/07/2026] - Inteligência no formulário de Fechamento

### Implementado

- Preenchimento automático do consumo conforme o tipo de veículo.
- Preenchimento automático do preço do combustível/recarga.
- Atualização dinâmica das unidades de consumo.
- Atualização dinâmica do texto do campo de combustível para veículos elétricos.
- Armazenamento automático do último preço informado por tipo de veículo.

### Melhorias na Interface

- Gasolina → Consumo (km/L).
- GNV → Consumo (km/m³).
- Elétrico → Consumo (km/kWh).
- Gasolina/GNV → Preço do combustível.
- Elétrico → Preço da recarga.
- Placeholders atualizados automaticamente conforme o tipo de veículo.

### Validações

- Gasolina e GNV exigem consumo maior que zero.
- Gasolina e GNV exigem preço maior que zero.
- Veículos elétricos possuem tratamento específico para consumo e recarga.

### Melhorias de Código

- Criada a função `atualizarConsumoPadrao()`.
- Removida lógica duplicada do cálculo da economia elétrica.
- Implementado armazenamento do último preço por tipo de veículo:
  - `ultimoPreco_gasolina`
  - `ultimoPreco_gnv`
  - `ultimoPreco_eletrico`

### Resultado

- Redução do preenchimento manual no fechamento do dia.
- Interface mais intuitiva para diferentes tipos de veículos.
- Código mais organizado e de fácil manutenção.
- Melhor experiência para motoristas de combustão, GNV e elétricos.

### Próximos passos

- Continuar simplificando o formulário de fechamento.
- Priorizar funcionalidades essenciais para publicação do MVP.

## [20/07/2026] - Dashboard

### Implementado

- Card "Economia elétrica" exibido apenas para veículos elétricos.

### Resultado

- Dashboard mais limpo para motoristas de gasolina e GNV.
- Interface adaptada automaticamente conforme o tipo de veículo.
- Melhor experiência do usuário.

## [21/07/2026] - Revisão Visual do Dashboard e Meu Dia

### Tela Meu Dia

- Destaque visual para o Saldo Líquido.
- Valor do Saldo Líquido destacado em verde.
- Melhor organização visual dos indicadores.
- Ajustes de acabamento da interface.

### Dashboard

- Card Saldo Líquido recebeu destaque visual.
- Revisão da identidade visual dos cards.
- Inclusão de ícones nos indicadores principais.
- Correção da unidade do indicador Ganho/Hora (`R$/h`).
- Removido caractere indevido (`>`).
- Pequenos ajustes de acabamento visual.

### Resultado

- Interface mais limpa.
- Melhor hierarquia das informações.
- Leitura mais rápida dos indicadores.
- Dashboard e Meu Dia padronizados visualmente.

## [26/07/2026] - Relatórios Inteligentes (Versão 1)

### Implementado

- Criado sistema de insights inteligentes.
- Insights ordenados por prioridade.
- Adicionado indicador de consumo do combustível sobre o faturamento.
- Adicionado comparativo automático com a semana anterior.
- Indicador de desempenho da meta dos últimos 7 dias.
- Indicador do melhor período de trabalho.
- Indicador do melhor dia da semana.
- Indicador de ganho por hora.
- Revisão visual do Dashboard.
- Removidos componentes redundantes (Ranking e card Melhor período).

### Resultado

- Dashboard mais limpo.
- Informações priorizadas conforme relevância.
- Motorista recebe recomendações que a Uber não fornece.

## [02/08/2026] - Backup e Importação

### Implementado

- ✅ Exportação de backup em arquivo JSON.
- ✅ Importação de backup por arquivo JSON.
- ✅ Restauração dos dados validada com sucesso.

## [07/09/2026] - Sistema de teste grátis e assinatura

### Modelo comercial definido

- Período de teste grátis de 15 dias.
- Após o período de teste, assinatura de R$ 9,90 por mês.
- O período de teste oferece acesso completo ao aplicativo.
- O Mercado Pago não possui um segundo período de teste.
- A cobrança da assinatura é recorrente e mensal.

### Controle do período de teste

- Adicionado o registro `inicioTeste` no documento do usuário no Firebase.
- Usuários existentes passaram a preservar seus dados já cadastrados.
- Implementada a verificação do período de teste.
- Implementado o cálculo dos dias restantes.
- Implementada a identificação automática de teste ativo ou expirado.
- Validado o funcionamento do período de 15 dias.

### Controle de acesso

- Criada a função `verificarAcessoUsuario()`.
- Usuários com plano `premium` possuem acesso liberado.
- Usuários em período de teste ativo possuem acesso liberado.
- Usuários com período de teste encerrado são direcionados para a tela de assinatura.
- Fluxo de acesso testado com período ativo e período expirado.

### Tela de assinatura

- Criada a tela "Seu plano".
- Exibição do término do período de teste.
- Exibição do valor da assinatura mensal.
- Adicionado botão para continuar com a assinatura.

### Mercado Pago

- Criado plano recorrente no Mercado Pago.
- Valor definido em R$ 9,90 por mês.
- Cobrança configurada para o dia da adesão.
- Duração da assinatura configurada como ilimitada.
- Período de teste do Mercado Pago desativado.
- Código de referência definido como `CM-MENSAL-990`.
- Link de assinatura integrado ao botão da tela "Seu plano".

### Testes realizados

- Login com usuário existente validado.
- Registro do `inicioTeste` validado.
- Contagem dos dias restantes validada.
- Simulação de período expirado validada.
- Redirecionamento para a tela de assinatura validado.
- Link do Mercado Pago testado com sucesso.
- Página de assinatura exibida corretamente com o valor de R$ 9,90.

### Próxima tarefa

- Integrar a confirmação do pagamento do Mercado Pago ao Firebase.
- Liberar automaticamente o acesso do usuário após a confirmação da assinatura.
