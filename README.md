# App Mobile — Hortifrúti (Expo SDK 54)

Projeto completo. Com a API rodando (`npm run dev` na pasta da API) e um emulador Android aberto:

```bash
npm install
npx expo install --fix     # alinha as versões das dependências com o SDK
npx expo start
```
Quando aparecer o menu, pressione `a` para abrir no emulador
(o Expo instala o Expo Go no emulador automaticamente na primeira vez).

## Se der erro
- "Network Error" / não carrega produtos: teste `http://localhost:3333/health` no navegador do PC;
  libere o Node.js no Firewall do Windows (rede privada).
- "adb not found" / emulador não abre com `a`: configure ANDROID_HOME e coloque `platform-tools` no PATH.
- Erro de versão/Expo Go: rode `npx expo install --fix` e depois `npx expo start -c` (limpa o cache).
- Celular físico: crie `.env` com `EXPO_PUBLIC_API_URL=http://IP_DO_PC:3333` (mesma rede Wi-Fi).
