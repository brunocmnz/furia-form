

const input = document.getElementById('arquivo');
const botao = document.getElementById('enviar');

botao.addEventListener('click', async () => {
  const file = input.files[0];
  if (!file) {
    alert('Selecione um arquivo.');
    return;
  }

  const storageRef = firebase.storage().ref();
  const arquivoRef = storageRef.child(`documentos/${file.name}`);

  try {
    await arquivoRef.put(file);
    alert('📂 Documento enviado com sucesso!');
  } catch (err) {
    console.error('Erro ao enviar:', err);
    alert('Erro ao enviar. Veja o console.');
  }
});
