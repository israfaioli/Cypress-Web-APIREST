Olá Analistas, desenvolvedores e recrutadores. Este readme irá apresentar a estrutura deste projeto cypress de portfólio pessoal.
Meu conhecimento base foi oriundo do curso Cypress pela Udemy onde consegui aprender como realizar testes web e api rest utilizando cypress. Espero que vocês gostem ;)

* Projeto para fazer os testes automatizados aplicação Web e também api rest.

### Setup necessário ###


* Instalar o cypress

  ```
  npm install cypres@3.6.0
  ```

* Criar arquivo package.json

  ```
  npm init -y
  ```

* Instalar o plugin de xpath.

  npm install cypress-xpath

  * Adicionar dependencia do xpath no arquivo index.js

  require('cypress-xpath')

### Estrutura do projeto ###

* fixtures - Classe onde ficam salvos nossos arquivos json utilizados nos testes.
* integration - Local onde ficam nossas classes de testes automatizados.
* plugins - Arquivo de configuração dos nossos puglins
* support - Local onde ficam salvos nossas classes de suporte:
          - classe de identificação dos elementos das páginas
          - classe que contém as funções de cada page do projeto (commands)
          - index.js que contém nosso caminho default de commands, inserir dependência do xpath para utilização (require)
* node_modules - pasta contendo os arquivos da instalação cypress

### Rodando o projeto ###

* Acessa a pasta do projeto
* Rode o seguinte comando via terminal:

```
mvn clean test -Dtest=CucumberRunner -Denviromment=qa
```