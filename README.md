# 📄 Formulário Know Your Fan - FURIA

Este projeto foi totalmente desenvolvido com **HTML**, **CSS**, **Bootstrap 5** e **JavaScript puro (sem frameworks)**. Ele implementa um fluxo de cadastro de fãs com **verificação automatizada de identidade** (nome e CPF) usando **OCR da API Google Cloud Vision** e integração com **Firebase Firestore** como banco de dados.

O sistema está **hospedado na plataforma Vercel** e pode ser acessado publicamente pelo link abaixo:

🔗 **Acesse agora**: na [Vercel](https://furia-form.vercel.app)
🔗 **ou em** [Netlify](https://celadon-dragon-48d09c.netlify.app/)

---

## 🚀 Funcionalidades

- 🧾 **Cadastro de usuário** com nome, CPF, endereço, redes sociais e interesses.
- 📦 Armazenamento dos dados no **Firebase Firestore**.
- 📷 **Upload de imagem** (RG ou CNH) para extração de texto com OCR.
- 🔎 Verificação automática se o **nome e CPF da imagem** batem com os dados informados.
- ✅ **Atualização automática** do cadastro se o CPF já estiver no banco.
- 🌐 Uso 100% web, compatível com **dispositivos móveis**.

---

## 🛠️ Tecnologias Utilizadas

- HTML5
- CSS3
- [Bootstrap 5](https://getbootstrap.com)
- JavaScript (puro, client-side)
- [Google Cloud Vision API (OCR)](https://cloud.google.com/vision)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- [ViaCEP](https://viacep.com.br) (busca de endereço por CEP)

---

## 📁 Estrutura de Arquivos

```bash
📂 raiz do projeto
├── index.html              # Formulário de cadastro
├── upload.html             # Página de upload de imagem para verificação
├── js/
│   ├── app.js              # Lógica de validação e envio do formulário
│   ├── upload.js           # Lógica de OCR e verificação de identidade
│   └── firebaseConfig.js   # Configuração do Firebase
├── README.md               # Documentação do projeto
```

---

## 🔧 Configuração

### 1. Configurar o Firebase
- Acesse [https://console.firebase.google.com](https://console.firebase.google.com)
- Crie um novo projeto.
- Ative o **Firestore**.
- Copie o código de configuração e substitua no arquivo `firebaseConfig.js`:

```js
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
```

### 2. Ativar API do Google Vision
- Acesse: [https://console.cloud.google.com/](https://console.cloud.google.com/)
- Habilite a **Cloud Vision API** no projeto.
- Vá em **Credenciais > Criar chave de API**.
- Substitua a chave no `upload.js` onde está `YOUR_API_KEY`.

---

## 🧪 Fluxo de Uso

1. O usuário preenche o formulário (`index.html`) e é redirecionado para `upload.html`.
2. No `upload.html`, ele faz o upload de uma imagem do documento (RG ou CNH).
3. O script extrai e normaliza o texto da imagem.
4. Valida se o nome e CPF do documento coincidem com os do formulário.
5. Se válido, os dados são salvos (ou atualizados) no Firestore.

---

## 📸 Requisitos para a Imagem

- Imagem legível e nítida
- Documento preferencialmente com nome e CPF em destaque
- Evitar imagens cortadas ou desfocadas

---

## ✅ Critérios de Validação

- O CPF da imagem deve ser válido (checagem de dígitos verificadores).
- O nome extraído deve bater com o nome do cadastro (comparação por partes normalizadas).
- O cpf extraído deve bater com o cpf do cadastro.

---

## ⚠️ Possíveis Erros

- **Erro 400/403:** verifique se a API key da Google está correta e habilitada para o projeto.
- **Texto não reconhecido:** certifique-se de que a imagem do documento está nítida.
- **Dados não batem:** nome ou CPF extraído do documento não coincidem com os dados informados.

---

## 🧑‍💻 Autor

Desenvolvido por Bruno Menezes

---

