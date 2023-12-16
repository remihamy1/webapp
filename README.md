### Prérequis

- Node.js
- npm ou yarn
- Git

### Installation

Détails sur l'installation des dépendances du projet :

```bash
git clone https://github.com/remihamy1/webapp.git

cd webapp

npm install

npm start
```
L'api en local : http://localhost:4000
Le front : http://localhost:3000
## Pour docker 

```bash

docker build -t webapp .
docker run -p 3000:3000 -p 4000:4000 webapp

```