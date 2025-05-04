const validarCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.charAt(10));
};

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const cpfUrl = urlParams.get("cpf") || "";
  document.getElementById("cpfOculto").value = cpfUrl;

  document
    .getElementById("uploadForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const file = document.getElementById("documento").files[0];
      const cpfEsperado = cpfUrl.replace(/\D/g, "");

      if (!file) return alert("Selecione uma imagem.");

      const formData = new FormData();
      formData.append("apikey", "helloworld");
      formData.append("language", "por");
      formData.append("isOverlayRequired", "false");
      formData.append("file", file);

      try {
        const res = await fetch("https://api.ocr.space/parse/image", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        const texto = data?.ParsedResults?.[0]?.ParsedText || "";
        console.log(texto)
        const encontrados = texto.match(/\d{3}\.?\d{3}\.?\d{3}-?\d{2}/g) || [];

        const dados = JSON.parse(sessionStorage.getItem("dadosCadastro")) || {};
        const nomeCadastro = dados.nome || "";
        const nomePartes = nomeCadastro.toLowerCase().split(/\s+/); // quebra em palavras

        const textoOCR = texto.toLowerCase();

        // verifica se pelo menos uma parte do nome está no texto da imagem
        const nomeEncontrado = nomePartes.some((parte) =>
          textoOCR.includes(parte)
        );

        if (!nomeEncontrado) {
          alert(`❌ Nome informado (${nomeCadastro}) não foi reconhecido na imagem.`);
          return;
        }

        let cpfExtraido = "";

        for (const item of encontrados) {
          const numeros = item.replace(/\D/g, "");
          if (validarCPF(numeros)) {
            cpfExtraido = numeros;
            break;
          }
        }

        if (!cpfExtraido) {
          alert("❌ Nenhum CPF válido foi detectado na imagem.");
          return;
        }

        if (cpfExtraido === cpfEsperado) {
          try {
            const dados = JSON.parse(sessionStorage.getItem("dadosCadastro"));
            if (dados) {
              dados.verificacaoDocumento = "verificado";
              dados.verificadoEm = new Date();
              try {
                const query = await db
                  .collection("cadastros")
                  .where("cpf", "==", cpfEsperado)
                  .get();
                if (!query.empty) {
                  await query.docs[0].ref.update(dados);
                } else {
                  await db.collection("cadastros").add(dados);
                }
                sessionStorage.removeItem("dadosCadastro");
                alert(
                  "✅ Verificação concluída com sucesso! Dados salvos! ✅\n\nPara alterá-los, basta refazer o cadastro e a autenticação."
                );
                window.location.href = "index.html";
              } catch (err) {
                console.error("Erro ao salvar no Firebase:", err);
                alert("Erro ao salvar os dados. Verifique o console.");
              }
            }
          } catch (firebaseErr) {
            console.error("Erro ao atualizar Firebase:", firebaseErr);
            console.log("\n❌ Erro ao atualizar status no Firebase.");
          }
        } else {
          alert("❌ O CPF informado não bate com o do documento fornecido.");
        }
      } catch (err) {
        console.error("Erro na análise OCR:", err);
        alert("Erro ao processar imagem com IA.");
      }
    });
});
