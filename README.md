# Sistema de Manutenção Preventiva e Corretiva

## Descrição do Projeto

Este projeto é um sistema de gerenciamento de manutenção preventiva e corretiva para máquinas e equipamentos industriais. O sistema permite controlar manutenções preventivas, registrar falhas, gerenciar a alocação de técnicos e gerar relatórios detalhados sobre o histórico de manutenção e desempenho dos equipamentos.

## Tecnologias Utilizadas

- Java
- PostgreSQL, MongoDB, ou Json-Server para persistência de dados
- Swing ou JavaFX para interfaces gráficas
- JUnit para testes unitários

## Funcionalidades

- Cadastro de técnicos, equipamentos e manutenções
- Agendamento de manutenções preventivas e corretivas
- Registro de falhas e peças substituídas
- Gerenciamento da alocação de técnicos
- Geração de relatórios de manutenção
- Verificação de disponibilidade de técnicos

## Diagramas

### Diagrama de Classes

1. Classe

```mermaid
classDiagram
    class Tecnico {
        +int id
        +string nome
        +string especialidade
        +boolean disponivel
        +getId()
        +setId(int)
        +getNome()
        +setNome(string)
        +getEspecialidade()
        +setEspecialidade(string)
        +isDisponivel()
        +setDisponivel(boolean)
    }

    class Equipamento {
        +int id
        +string aparelho
        +string modelo
        +string local
        +getId()
        +setId(int)
        +getAparelho()
        +setAparelho(string)
        +getModelo()
        +setModelo(string)
        +getLocal()
        +setLocal(string)
    }

    class Manutencao {
        +int id
        +int idEquipamento
        +int idTecnico
        +string tipo
        +string descricao
        +LocalDate data
        +string status
        +string pecasSubstituidas
        +int tempoInatividade
        +getId()
        +setId(int)
        +getIdEquipamento()
        +setIdEquipamento(int)
        +getIdTecnico()
        +setIdTecnico(int)
        +getTipo()
        +setTipo(string)
        +getDescricao()
        +setDescricao(string)
        +getData()
        +setData(LocalDate)
        +getStatus()
        +setStatus(string)
        +getPecasSubstituidas()
        +setPecasSubstituidas(string)
        +getTempoInatividade()
        +setTempoInatividade(int)
    }

    Tecnico "1" -- "0..*" Manutencao : realiza >
    Equipamento "1" -- "0..*" Manutencao : passa por >
```

  2. Uso
```mermaid
flowchart TD
    A[Início] --> B{Tipo de Ação}
    
    B -->|Usuário| C[Cadastrar Técnico]
    B -->|Usuário| D[Cadastrar Equipamento]
    B -->|Usuário| E[Agendar Manutenção]
    B -->|Usuário| F[Registrar Falha]
    B -->|Usuário| G[Gerar Relatório]
    B -->|Usuário| H[Verificar Disponibilidade]

    B -->|Administrador| I[Cadastrar Técnico]
    B -->|Administrador| J[Cadastrar Equipamento]
    B -->|Administrador| K[Agendar Manutenção]
    B -->|Administrador| L[Registrar Falha]
    B -->|Administrador| M[Gerar Relatório]
    B -->|Administrador| N[Verificar Disponibilidade]

    C --> O[Fim]
    D --> O
    E --> O
    F --> O
    G --> O
    H --> O
    I --> O
    J --> O
    K --> O
    L --> O
    M --> O
    N --> O


```

 3. Fluxo
```mermaid
flowchart TD
    A[Início] --> B{Cadastro de Técnico?}
    B -- Sim --> C[Preencher dados do Técnico]
    C --> D[Salvar Técnico]
    B -- Não --> E{Cadastro de Equipamento?}
    E -- Sim --> F[Preencher dados do Equipamento]
    F --> G[Salvar Equipamento]
    E -- Não --> H{Agendamento de Manutenção?}
    H -- Sim --> I[Selecionar Equipamento e Técnico]
    I --> J[Preencher dados da Manutenção]
    J --> K[Salvar Manutenção]
    H -- Não --> L{Registro de Falha?}
    L -- Sim --> M[Selecionar Manutenção]
    M --> N[Preencher dados da Falha]
    N --> O[Salvar Falha]
    L -- Não --> P{Geração de Relatório?}
    P -- Sim --> Q[Selecionar tipo de Relatório]
    Q --> R[Gerar Relatório]
    P -- Não --> S{Verificação de Disponibilidade?}
    S -- Sim --> T[Verificar disponibilidade dos Técnicos]
    A --> U[Encerrar]


```
