const input = document.getElementById("arquivo");
const botao = document.getElementById("enviar");

botao.addEventListener("click", async () => {
  const file = input.files[0];
  if (!file) {
    alert("Selecione um arquivo.");
    return;
  }

  const storageRef = firebase.storage().ref();
  const arquivoRef = storageRef.child(`documentos/${file.name}`);

  try {
    await arquivoRef.put(file);
    alert("📂 Documento enviado com sucesso!");
  } catch (err) {
    console.error("Erro ao enviar:", err);
    alert("Erro ao enviar. Veja o console.");
  }
});

document
  .getElementById("uploadForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const file = document.getElementById("documento").files[0];
    const cpf = document.getElementById("cpfOculto").value;
    const resultado = document.getElementById("resultadoIA");
    const output = document.getElementById("iaOutput");

    if (!file) return alert("Selecione uma imagem.");

    const formData = new FormData();
    formData.append("apikey", "helloworld"); // chave gratuita de testes do OCR.Space
    formData.append("language", "por");
    formData.append("isOverlayRequired", false);
    formData.append("file", file);

    try {
      const res = await fetch("https://api.ocr.space/parse/image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const texto = data?.ParsedResults?.[0]?.ParsedText || "Nada reconhecido.";

      resultado.classList.remove("d-none");
      output.innerText = `CPF informado: ${cpf}\n\nTexto detectado:\n${texto}`;
    } catch (err) {
      alert("Erro ao processar imagem.");
      console.error(err);
    }
  });
