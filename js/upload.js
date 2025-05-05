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

const normalizar = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const enviar = () => {
  const file = document.getElementById("documento").files[0];
  const dados = JSON.parse(sessionStorage.getItem("dadosCadastro")) || {};
  const cpfEsperado = (dados.cpf || "").replace(/\D/g, "");
  const nomeCadastro = dados.nome || "";

  if (!file) return alert("A Imagem é obrigatória!");

  const reader = new FileReader();
  reader.onload = async function (e) {
    const base64 = e.target.result.replace(
      /^data:image\/(png|jpeg);base64,/,
      ""
    );

    try {
      const resposta = await fetch(
        "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBb_ql2JIMIj14PIG5ouGM0sVe-0asc0mo",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requests: [
              {
                image: { content: base64 },
                features: [{ type: "TEXT_DETECTION" }],
              },
            ],
          }),
        }
      );

      const resultado = await resposta.json();
      const texto = resultado?.responses?.[0]?.fullTextAnnotation?.text || "";

      console.log("Texto reconhecido:", texto);

      const textoLimpo = normalizar(texto);
      const nomeInformado = normalizar(nomeCadastro)
        .split(/\s+/)
        .filter((p) => p.length > 1);
      const linhas = textoLimpo.split("\n");

      let nomeExtraido = [];
      for (let i = 0; i < linhas.length; i++) {
        if (linhas[i].includes("nome")) {
          nomeExtraido = (linhas[i + 1] || "")
            .split(/\s+/)
            .filter((p) => /^[a-z]{2,}$/.test(p));
          break;
        }
      }

      console.log("Nome extraído:", nomeExtraido);

      const nomeValido =
        nomeInformado.every((p) => nomeExtraido.includes(p)) &&
        nomeExtraido.every((p) => nomeInformado.includes(p));

      if (!nomeValido) {
        alert("❌ O Nome informado não confere com o documento.");
        return;
      }

      const cpfs = texto.match(/\d{3}\.?\d{3}\.?\d{3}-?\d{2}/g) || [];
      let cpfExtraido = "";
      for (const c of cpfs) {
        const puro = c.replace(/\D/g, "");
        if (validarCPF(puro)) {
          cpfExtraido = puro;
          break;
        }
      }

      if (!cpfExtraido) return alert("❌ Nenhum CPF válido detectado.");
      if (cpfExtraido !== cpfEsperado)
        return alert("❌ O CPF informado não confere com o documento.");

      alert(
        "Nome e CPF verificados com sucesso!✅\n\nDados salvos com sucesso! ✅\n\nCaso queria modificar os dados, responda o formulário e refaça a verificação de identidade."
      );

      try {
        dados.cpf = cpfExtraido.replace(/\D/g, "");

        const query = await db
          .collection("cadastros")
          .where("cpf", "==", dados.cpf)
          .get();

        if (!query.empty) {
          await query.docs[0].ref.update(dados);
          alert("Cadastro atualizado!");
        } else {
          await db.collection("cadastros").add(dados);
          alert("Cadastro criado com sucesso!");
        }

        sessionStorage.setItem("dadosCadastro", JSON.stringify(dados));
        window.location.href = `index.html`;
      } catch (err) {
        console.error("Erro ao salvar:", err);
        alert("Erro ao salvar. Veja o console.");
      }
    } catch (erro) {
      console.error("Erro ao processar imagem:", erro);
      alert(
        "Erro ao processar a imagem. Verifique sua conexão ou tente novamente."
      );
    }
  };

  reader.readAsDataURL(file);
};

document.getElementById("uploadForm").addEventListener("submit", function (e) {
  e.preventDefault();
  enviar();
});
