document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["access_token", "loginDate", "apiResults"], (result) => {
    if (!result.access_token || !result.loginDate) {
      window.location.href = "login.html";
      return;
    }

    const loginDate = new Date(result.loginDate);
    const currentDate = new Date();

    const brasiliaOffset = -3 * 60;
    const loginDateInBrazil = new Date(loginDate.getTime() + brasiliaOffset * 60000);
    const currentDateInBrazil = new Date(currentDate.getTime() + brasiliaOffset * 60000);

    if (
      currentDateInBrazil.getDate() !== loginDateInBrazil.getDate() ||
      currentDateInBrazil.getMonth() !== loginDateInBrazil.getMonth() ||
      currentDateInBrazil.getFullYear() !== loginDateInBrazil.getFullYear()
    ) {
      chrome.storage.local.clear(() => {
        console.log("Sessão expirada após a meia-noite. Redirecionando para login.");
        window.location.href = "login.html";
      });
      return;
    }

    if (result.apiResults) {
      renderResults(result.apiResults);
      preencherCamposNaPagina(result.apiResults); 
    }

    document.getElementById("logoutBtn").addEventListener("click", (event) => {
      event.preventDefault();
      chrome.storage.local.clear(() => {
        window.location.href = "login.html";
      });
    });

    document.getElementById("buscarBtn").addEventListener("click", async () => {
      let localizador = document.getElementById("localizador").value.trim().toUpperCase();

      if (!localizador) {
        document.getElementById("result").innerHTML = `<p class="text-sm text-red-500">Por favor, insira um localizador válido.</p>`;
        return;
      }

      document.getElementById("result").innerHTML = `<p class="text-sm text-gray-500">Buscando informações, por favor aguarde...</p>`;

      try {
        const response = await fetch(`https://sac-api.gbtech.com.br/api/localizador/${localizador}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'x-api-key': 'b94bcc16-b78a-48d4-b31d-bdb809929f58'
          }
        });

        if (!response.ok) throw new Error(`Erro na resposta da API: ${response.status} - ${response.statusText}`);

        const data = await response.json();
        
        if (data.code !== 200 || !data.data || data.data.length === 0) {
          throw new Error(data.message || "Resposta inválida da API.");
        }

        const viagem = data.data[0];

        chrome.storage.local.set({ apiResults: viagem }, function () {
          console.log("Resultados armazenados no chrome.storage.");
        });

        renderResults(viagem);
        preencherCamposNaPagina(viagem);

      } catch (error) {
        document.getElementById("result").innerHTML = `<p class="text-sm text-red-500">Erro ao buscar o localizador: ${error.message}</p>`;
        console.error("Erro ao buscar o localizador:", error);
      }
    });

    document.getElementById("limparBtn").addEventListener("click", () => {
      chrome.storage.local.remove("apiResults", () => {
        document.getElementById("result").innerHTML = `<p class="text-sm text-gray-500">Os resultados foram limpos.</p>`;
        console.log("Dados apagados.");
      });
    });

    function renderResults(viagem) {
      const resultContainer = document.getElementById("result");
      resultContainer.innerHTML = ''; 

      if (!viagem) {
        resultContainer.innerHTML = `<p class="text-sm text-red-500">Nenhuma informação disponível para o localizador.</p>`;
        return;
      }

      const campos = [
        { label: "Localizador", value: viagem.ID },
        { label: "Passageiro", value: viagem.Passenger },
        { label: "RG", value: viagem.Rg },
        { label: "CPF", value: viagem.Cpf },
        { label: "Origem", value: viagem.Origin },
        { label: "Destino", value: viagem.Destination },
        { label: "Data/Hora da Viagem", value: formatarDataHora(viagem.DepartureDate, viagem.DepartureTime) },
        { label: "Poltrona", value: viagem.Seat },
        { label: "Serviço", value: viagem.ServiceNumber },
        { label: "Ponto de Venda", value: viagem.PointOfSale },
        { label: "Linha", value: viagem.LineName },
        { label: "Status", value: viagem.Status }
      ];

      campos.forEach(campo => {
        resultContainer.innerHTML += `
          <div class="item">
            <div class="text-content">
              <span class="field-name">${campo.label}:</span>
              <span class="field-value">${campo.value || 'N/A'}</span>
            </div>
            <button class="copy-btn" data-text="${campo.value || ''}">Copiar</button>
          </div>
        `;
      });

      document.querySelectorAll(".copy-btn").forEach(button => {
        button.addEventListener("click", () => {
          copiarTexto(button.getAttribute("data-text"));
        });
      });
    }

    function preencherCamposNaPagina(viagem) {
      const campos = {
        "cf_localizador": viagem.ID || "",
        "cf_data_hora_da_viagem": formatarDataHora(viagem.DepartureDate, viagem.DepartureTime),
        "cf_origem_da_viagem": viagem.Origin || "",
        "cf_poltrona": viagem.Seat || "",
        "cf_destino_da_viagem": viagem.Destination || "",
        "cf_linha": viagem.LineName || "",
        "cf_n_do_servico": viagem.ServiceNumber || "",
        "cf_ponto_de_venda": viagem.PointOfSale || ""
      };

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: (campos) => {
            for (const [id, valor] of Object.entries(campos)) {
              const campo = document.querySelector(`[data-id="${id}"]`);
              if (campo) {
                campo.value = valor;
                campo.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }
          },
          args: [campos]
        });
      });
    }

    function copiarTexto(texto) {
      navigator.clipboard.writeText(texto).catch(err => {
        console.error("Erro ao copiar texto:", err);
      });
    }

    function formatarDataHora(data, hora) {
    
      if (data && hora) {
        const [ano, mes, dia] = data.split('T')[0].split('-');
    
        const [horas, minutos] = hora.split('T')[1].split(':');
    
        const resultado = `${dia}/${mes}/${ano} ${horas}:${minutos}`;
        return resultado;
      }
    
      return "N/A";
    }
    
  });
});
