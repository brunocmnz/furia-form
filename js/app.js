console.log("🔥 app.js carregado!");

const form = document.getElementById("cadastroForm");
const cpfInput = document.getElementById("cpf");
const valorGastoInput = document.getElementById("valorGasto");
const mensagensErro = document.getElementById("mensagensErro");

// Máscara de CPF
cpfInput.addEventListener("input", function () {
  let value = cpfInput.value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0, 11);
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  cpfInput.value = value;
});

// Máscara de valor em reais
valorGastoInput.addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");
  value = (parseInt(value || 0, 10) / 100).toFixed(2);
  e.target.value = "R$ " + value.replace(".", ",");
});

// CEP
const cepInput = document.getElementById("cep");
cepInput.addEventListener("input", function () {
  this.value = this.value
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
});

cepInput.addEventListener("blur", async function () {
  const cep = this.value.replace(/\D/g, "");
  if (cep.length !== 8) return;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await res.json();
    if (data.erro) return alert("CEP não encontrado.");
    document.getElementById("rua").value = data.logradouro || "";
    document.getElementById("bairro").value = data.bairro || "";
    const cidadeEl = document.getElementById("cidade");
    const estadoEl = document.getElementById("estado");
    const estadoCorrespondente = estados.find((est) => est.Sigla === data.uf);

    if (estadoCorrespondente) {
      estadoEl.value = estadoCorrespondente.ID;

      // Gatilho para carregar cidades
      const eventoChange = new Event("change");
      estadoEl.dispatchEvent(eventoChange);

      // Esperar um tempo para carregar cidades antes de setar
      setTimeout(() => {
        cidadeEl.value = data.localidade || "";
      }, 300);
    }
  } catch (err) {
    console.error("Erro ao buscar CEP:", err);
  }
});

// Estados e cidades
let estados = [],
  cidades = [];
const estadoSelect = document.getElementById("estado");
const cidadeSelect = document.getElementById("cidade");

Promise.all([
  fetch(
    "https://raw.githubusercontent.com/felipefdl/cidades-estados-brasil-json/refs/heads/master/Estados.json"
  ).then((r) => r.json()),
  fetch(
    "https://raw.githubusercontent.com/felipefdl/cidades-estados-brasil-json/refs/heads/master/Cidades.json"
  ).then((r) => r.json()),
]).then(([estadosData, cidadesData]) => {
  estados = estadosData;
  cidades = cidadesData;
  estadoSelect.innerHTML = '<option value="">Selecione o estado</option>';
  estados.forEach((estado) => {
    const option = document.createElement("option");
    option.value = estado.ID;
    option.textContent = estado.Nome;
    estadoSelect.appendChild(option);
  });
});

estadoSelect.addEventListener("change", () => {
  const estadoId = parseInt(estadoSelect.value);
  cidadeSelect.innerHTML = '<option value="">Selecione a cidade</option>';
  cidades
    .filter((c) => parseInt(c.Estado) === estadoId)
    .forEach((c) => {
      const option = document.createElement("option");
      option.value = c.Nome;
      option.textContent = c.Nome;
      cidadeSelect.appendChild(option);
    });
});

// Mostrar campo "Outros"
document.getElementById("outros").addEventListener("change", function () {
  document.getElementById("campoOutrosTexto").style.display = this.checked
    ? "block"
    : "none";
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const erros = [];

  const nome = document.getElementById("nome").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const email = document.getElementById("email").value.trim();
  const cep = document.getElementById("cep").value.trim();
  const rua = document.getElementById("rua").value.trim();
  const numero = document.getElementById("numero").value.trim();
  const complemento = document.getElementById("complemento").value.trim();
  const bairro = document.getElementById("bairro").value.trim();
  const cidade = document.getElementById("cidade").value;
  const estado = document.getElementById("estado").value;
  const valorGastoRaw = valorGastoInput.value
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();
  const valorGasto = parseFloat(valorGastoRaw);

  if (!nome) erros.push("- Nome completo");
  if (!cpf) erros.push("- CPF");
  if (!email.includes("@") || !email.includes("."))
    erros.push("- Email válido");
  if (!cep) erros.push("- CEP");
  if (!rua) erros.push("- Rua");
  if (!numero) erros.push("- Número");
  if (!bairro) erros.push("- Bairro");
  if (!cidade) erros.push("- Cidade");
  if (!estado) erros.push("- Estado");

  const interesses = document.querySelectorAll(
    ".interesses input[type='checkbox']:checked"
  );
  if (interesses.length === 0) erros.push("- Pelo menos um interesse");

  const atividades = document.querySelectorAll(".atividades input:checked");
  if (atividades.length === 0) erros.push("- Pelo menos uma atividade como fã");

  const eventos = document.querySelectorAll(".eventos input:checked");
  const eventoOutro = document.getElementById("eventoOutro").value.trim();
  if (eventos.length === 0 && !eventoOutro)
    erros.push("- Pelo menos um evento ou outro evento descrito");

  const compras = document.querySelectorAll(".compras input:checked");
  const comprasOutro = document.getElementById("compraOutro");
  if (compras.length === 0 && !comprasOutro.value.trim())
    erros.push("- Pelo menos uma compra (ou outros tipos de compra)");

  if (isNaN(valorGasto) || valorGasto <= 0)
    erros.push("- Valor estimado gasto nas compras");

  if (erros.length > 0) {
    mensagensErro.classList.remove("d-none");
    mensagensErro.innerHTML = `<div style="padding: 0 1em"><strong style="font-weight: bold;">Preencha os seguintes campos obrigatórios:</strong><br><br><ul style="line-height: 30px;">${erros
      .map((e) => `<li>${e}</li>`)
      .join("")}</ul></div>`;
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  } else {
    mensagensErro.classList.add("d-none");
  }

  const outrosCheck = document.getElementById("outros").checked;
  const outrosTexto = document.getElementById("outrosTexto").value.trim();
  const interessesList = Array.from(interesses).map((cb) => cb.value);
  if (outrosCheck && outrosTexto) interessesList.push(`Outros: ${outrosTexto}`);

  const atividadesList = Array.from(atividades).map((cb) => cb.value);
  const eventosList = Array.from(eventos).map((cb) => cb.value);
  if (eventoOutro) eventosList.push(eventoOutro);

  const comprasList = Array.from(compras).map((cb) => cb.value);
  const compraOutro = document.getElementById("compraOutro").value.trim();
  if (compraOutro) comprasList.push(compraOutro);

  const data = {
    nome,
    cpf,
    email,
    endereco: { rua, numero, complemento, bairro, cidade, estado },
    interesses: interessesList,
    atividades: atividadesList,
    eventos: eventosList,
    compras: comprasList,
    valorGasto,
    atualizadoEm: new Date(),
  };

  try {
    const query = await window.db
      .collection("cadastros")
      .where("cpf", "==", cpf)
      .get();
    if (!query.empty) {
      await query.docs[0].ref.update(data);
      alert("Cadastro atualizado!");
    } else {
      await db.collection("cadastros").add(data);
      alert("Cadastro criado com sucesso!");
    }
    form.reset();
    window.location.href = `upload.html?cpf=${encodeURIComponent(cpf)}`;
    console.log("cpf: ",cpf);
  } catch (err) {
    console.error("Erro ao salvar:", err);
    alert("Erro ao salvar. Veja o console.");
  }
});
