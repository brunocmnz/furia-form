#  📄 Formulário Know Your Fan - Furia

Acesse o projeto em: https://furia-form.vercel.app/

## 📄 Com Sistema de Verificação de Identidade com OCR + Firebase

Este projeto permite o **cadastro de usuários** e a **validação de documentos de identidade (RG/CNH)** com uso de **OCR (Reconhecimento Óptico de Caracteres)** da **API do Google Vision** e **Firebase Firestore** como banco de dados.

---

## 🚀 Funcionalidades

- 🧾 Cadastro de usuário com nome, CPF, endereço, redes sociais, interesses e outros dados.
- 📷 Upload de imagem do documento para verificação automática do **nome e CPF**.
- ✅ Validação de dados extraídos via OCR com os dados do cadastro.
- 🔐 Salvamento no Firestore, com atualização automática se o CPF já existir.

---

## 🛠️ Tecnologias Usadas

- HTML5, CSS3 e JavaScript
- [OCR Google Cloud Vision API](https://cloud.google.com/vision)
- Firebase Firestore
- Bootstrap 5
- ViaCEP (busca de endereço por CEP)

---

## 📁 Estrutura dos Arquivos

```
📦 raiz do projeto
├── index.html             # Página de cadastro do usuário
├── upload.html            # Página de envio de imagem para verificação
├── js/
│   ├── app.js             # Lógica do formulário de cadastro
│   ├── upload.js          # Lógica da verificação por imagem
│   └── firebaseConfig.js  # Configuração do Firebase
└── README.md              # Documentação do projeto
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

