fetch('/session/valid').then((res) => {
  if (res.redirected) {
    window.location.href = res.url;
  }
  return res.json();
});

fetch('/session/keypad')
  .then((res) => res.json())
  .then((data) => {
    const { teclas } = data;
    let html = '';
    teclas.forEach((tecla, index) => {
      html =
        html +
        `
        <button onclick="handleInsertPassword(${index})" class="btn btn-secondary my-1 m-1 py-3 px-4">${tecla.join(
          ' e ',
        )}</button>
        `;
    });

    document.getElementById('keypad_content').innerHTML = html;
  });

let senha = '';

function handleInsertPassword(index) {
  const passwordInput = document.getElementById('password_input');

  if (passwordInput.value.length >= 4) {
    alert('Senha já possui 4 números');
    return;
  } else {
    senha = senha + index.toString();
    passwordInput.value = passwordInput.value + '*';
  }
}

function cleanPassword() {
  senha = '';
  document.getElementById('password_input').value = '';
}

function executeLogin() {
  fetch('/session/logar', {
    method: 'POST',
    body: JSON.stringify({ positions: senha }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) {
        return alert(data.message);
      }
    });
}
