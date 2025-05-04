console.log("🔥 app.js carregado!");

const form = document.getElementById("cadastroForm");
const cpfInput = document.getElementById("cpf");

// Máscara de CPF
cpfInput.addEventListener("input", function () {
  let value = cpfInput.value.replace(/\D/g, "");
  if (value.length > 11) value = value.slice(0, 11);
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  cpfInput.value = value;
});

const outrosCheckbox = document.getElementById("outros");
const campoOutrosTexto = document.getElementById("campoOutrosTexto");

outrosCheckbox.addEventListener("change", () => {
  campoOutrosTexto.style.display = outrosCheckbox.checked ? "block" : "none";
});

form.addEventListener("submit", async function (e) {
  console.log("VOU SALVAR");
  e.preventDefault();

  console.log("Enviando dados...");

  const nome = document.getElementById("nome").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  const email = document.getElementById("email").value.trim();
  const rua = document.getElementById("rua").value.trim();
  const numero = document.getElementById("numero").value.trim();
  const complemento = document.getElementById("complemento").value.trim();
  const bairro = document.getElementById("bairro").value.trim();
  const cidade = document.getElementById("cidade").value.trim();
  const estado = document.getElementById("estado").value.trim();

  // Captura os interesses exceto "Outros"
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"]:checked:not(#outros)'
  );
  const interesses = Array.from(checkboxes).map((cb) => cb.value);

  // Captura "Outros" se marcado e com texto
  const outrosCheckbox = document.getElementById("outros");
  const outrosTexto = document.getElementById("outrosTexto")?.value.trim();

  if (outrosCheckbox && outrosCheckbox.checked && outrosTexto) {
    interesses.push(`Outros: ${outrosTexto}`);
  }

  // Verifica se pelo menos um interesse foi fornecido
  if (interesses.length === 0) {
    alert("Por favor, selecione pelo menos um interesse.");
    return;
  }

  // Validação simples do e-mail
  if (!email.includes("@") || !email.includes(".")) {
    alert("Por favor, insira um e-mail válido.");
    return;
  }

  if (!window.db) {
    alert("Erro: Firebase não carregado ainda.");
    return;
  }

  try {
    const querySnapshot = await window.db
      .collection("cadastros")
      .where("cpf", "==", cpf)
      .get();

    const data = {
      nome,
      email,
      interesses,
      timestamp: new Date(),
      endereco: {
        rua,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
      },
    };

    if (!querySnapshot.empty) {
      await querySnapshot.docs[0].ref.update(data);
      alert("Cadastro atualizado com sucesso!");
    } else {
      await window.db.collection("cadastros").add({
        ...data,
        cpf,
      });
      alert("Cadastro criado com sucesso!");
    }

    form.reset();
    document.getElementById("campoOutrosTexto").style.display = "none";
  } catch (error) {
    console.error("Erro ao salvar/atualizar no Firestore:", error);
    alert("Erro ao salvar. Veja o console.");
  }
});

document.getElementById("cep").addEventListener("input", function () {
  this.value = this.value
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
});

document.getElementById("numero").addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "");
});

const cidadesPorEstado = {
  SP: ["São Paulo", "Campinas", "Santos", "Ribeirão Preto"],
  RJ: ["Rio de Janeiro", "Niterói", "Campos dos Goytacazes", "Volta Redonda"],
  MG: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora"],
  BA: ["Salvador", "Feira de Santana", "Ilhéus", "Vitória da Conquista"],
  RS: ["Porto Alegre", "Caxias do Sul", "Pelotas", "Santa Maria"],
  // Adicione mais se quiser
};

document.getElementById("estado").addEventListener("change", function () {
  const estado = this.value;
  const cidadeSelect = document.getElementById("cidade");

  cidadeSelect.innerHTML = '<option value="">Selecione a cidade</option>';

  if (estado && cidadesPorEstado[estado]) {
    cidadesPorEstado[estado].forEach((cidade) => {
      const option = document.createElement("option");
      option.value = cidade;
      option.textContent = cidade;
      cidadeSelect.appendChild(option);
    });
  }
});

const estadoSelect = document.getElementById("estado");
const cidadeSelect = document.getElementById("cidade");

let estados = [];
let cidades = [];

// Carrega estados e cidades
Promise.all([
  fetch(
    "https://raw.githubusercontent.com/felipefdl/cidades-estados-brasil-json/refs/heads/master/Estados.json"
  ).then((res) => res.json()),
  fetch(
    "https://raw.githubusercontent.com/felipefdl/cidades-estados-brasil-json/refs/heads/master/Cidades.json"
  ).then((res) => res.json()),
])
  .then(([estadosData, cidadesData]) => {
    estados = estadosData;
    cidades = cidadesData;

    // Popula os estados
    estadoSelect.innerHTML = '<option value="">Selecione o estado</option>';
    estados.forEach((estado) => {
      const option = document.createElement("option");
      option.value = estado.ID; // importante: será comparado depois
      option.textContent = estado.Nome;
      estadoSelect.appendChild(option);
    });
  })
  .catch((error) => {
    console.error("Erro ao carregar estados ou cidades:", error);
    alert("Erro ao carregar lista de estados e cidades.");
  });

// Quando o estado muda, carrega as cidades
estadoSelect.addEventListener("change", () => {
  const estadoId = parseInt(estadoSelect.value);
  cidadeSelect.innerHTML = '<option value="">Selecione a cidade</option>';

  const cidadesFiltradas = cidades.filter(
    (cidade) => parseInt(cidade.Estado) === estadoId
  );
  cidadesFiltradas.forEach((cidade) => {
    const option = document.createElement("option");
    option.value = cidade.Nome;
    option.textContent = cidade.Nome;
    cidadeSelect.appendChild(option);
  });
});
