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
  
    document.getElementById("uploadForm").addEventListener("submit", async function (e) {
      e.preventDefault();
  
      const file = document.getElementById("documento").files[0];
      const cpfEsperado = cpfUrl.replace(/\D/g, "");
      const resultado = document.getElementById("resultadoIA");
      const output = document.getElementById("iaOutput");
  
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
        resultado.classList.remove("d-none");
  
        const encontrados = texto.match(/\d{3}\.?\d{3}\.?\d{3}-?\d{2}/g) || [];
        let cpfExtraido = "";
  
        for (const item of encontrados) {
          const numeros = item.replace(/\D/g, "");
          if (validarCPF(numeros)) {
            cpfExtraido = numeros;
            break;
          }
        }
  
        if (!cpfExtraido) {
          output.textContent = "❌ Nenhum CPF válido foi detectado na imagem.";
          return;
        }
  
        if (cpfExtraido === cpfEsperado) {
          output.textContent = `✅ CPF reconhecido: ${cpfExtraido}\n✔️ Compatível com o CPF do cadastro.`;
          try {
            const query = await db.collection("cadastros").where("cpf", "==", cpfUrl).get();
            if (!query.empty) {
              await query.docs[0].ref.update({
                verificacaoDocumento: "verificado",
                verificadoEm: new Date(),
              });
              output.textContent += "\n✅ Status atualizado no Firebase: verificado";
            } else {
              output.textContent += "\n⚠️ CPF não encontrado no banco de dados.";
            }
          } catch (firebaseErr) {
            console.error("Erro ao atualizar Firebase:", firebaseErr);
            output.textContent += "\n❌ Erro ao atualizar status no Firebase.";
          }
        } else {
          output.textContent = `⚠️ CPF reconhecido: ${cpfExtraido}\n❌ Não corresponde ao CPF do cadastro (${cpfEsperado}).`;
        }
      } catch (err) {
        console.error("Erro na análise OCR:", err);
        alert("Erro ao processar imagem com IA.");
      }
    });
  });
  