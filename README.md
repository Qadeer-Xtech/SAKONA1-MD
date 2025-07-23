# In Testing Mode Only









___
<p align="center">
  <a href="https://qadeer-pair-9e1dc45a3836.herokuapp.com/">
    <img title="GET SESSION OPT 1" src="https://img.shields.io/badge/🔑_GET_SAKONA1 MD_SESSION-000000?style=for-the-badge&logo=quantum&logoColor=white&color=skyblue" width="260" height="50"/>
  </a>

---
<p align="center">
<a href="https://dashboard.heroku.com/new?template=https://github.com/Qadeer-Xtech/SAKONA1-MD/tree/main">
    <img title="DEPLOY SAKONA1 MD BOT" src="https://img.shields.io/badge/🚀_DEPLOY_ON_HEROKU-000000?style=for-the-badge&logo=heroku&logoColor=white&color=FF00FF" width="260" height="50"/>
  </a>
</p>





## ⚙️ WORKFLOWS

```.github/workflows/deploy.yml```

```WORKFLOWS
name: Node.js CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  schedule:
    - cron: '0 */6 * * *'  

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}

    - name: Install dependencies
      run: npm install

    - name: Install FFmpeg
      run: sudo apt-get install -y ffmpeg

    - name: Start application with timeout
      run: |
        timeout 21590s npm start  # Limite l'exécution à 5h 59m 50s

    - name: Save state (Optional)
      run: |
        ./save_state.sh
```



