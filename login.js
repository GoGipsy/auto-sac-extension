document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");

  loginBtn.addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      document.getElementById("loginResult").textContent = "Por favor, insira o nome de usuário e a senha.";
      return;
    }

    document.getElementById("loading").style.display = "flex"; 
    console.log("Minha extensão foi atualizada para versão 1.1!");

    try {
      const response = await fetch('https://sac-api.gbtech.com.br/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'b94bcc16-b78a-48d4-b31d-bdb809929f58'
        },
        body: JSON.stringify({ username, password })
      });
    
      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Erro de login: ${response.statusText} - Detalhes: ${errorDetails}`);
      }

      const data = await response.json();
      console.log('DATA: ', data)
      if (data.code === 200 && data.data.access_token) {
        const loginDate = new Date(); 
        chrome.storage.local.set(
          {
            access_token: data.data.access_token,
            token_type: data.data.token_type,
            expires_in: data.data.expires_in,
            loginDate: loginDate.getTime()
          },
          () => {
            window.location.href = 'popup.html'; 
          }
        );
      } else {
        document.getElementById("loginResult").textContent = "Login falhou. Verifique suas credenciais.";
      }
    } catch (error) {
      document.getElementById("loginResult").textContent = `Erro ao fazer login: ${error.message}`;
      console.error("Erro de login:", error);
    } finally {
      document.getElementById("loading").style.display = "none"; 
    }
  });
});
