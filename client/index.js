// function getSession() {
//   fetch('/getSession')
//     .then((res) => res.json())
//     .then((data) => console.log(data));
// }

// function setSession() {
//   fetch('/setSession')
//     .then((res) => res.json())
//     .then((data) => console.log(data));
// }

// function deleteSession() {
//   fetch('/deleteSession')
//     .then((res) => res.json())
//     .then((data) => console.log(data));
// }

document
  .getElementById('user-info')
  .addEventListener('submit', function (event) {
    event.preventDefault();
    handleSubmitUserInfo(event);
  });

function handleSubmitUserInfo(event) {
  const userInfos = getUserInfos();
  if (!isFormUserValid(userInfos)) {
    alert('Dados inválidos');
    return;
  }
  disableForm();
  fetch('/session/user-data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userInfos),
  }).then((response) => {
    if (response.redirected) {
      window.location.href = response.url;
    }
  });
  //criar seção de usuário e mandar pra pagina de keypad rs
}

function isFormUserValid({ username, account, agency }) {
  return username.length > 0 && account.length > 0 && agency.length > 0;
}

function getUserInfos() {
  return {
    username: document.getElementById('username').value,
    account: document.getElementById('account').value,
    agency: document.getElementById('agency').value,
  };
}

function disableForm() {
  getUsername().disabled = true;
  getAccount().disabled = true;
  getAgency().disabled = true;
}

function getUsername() {
  return document.getElementById('username');
}

function getAccount() {
  return document.getElementById('account');
}

function getAgency() {
  return document.getElementById('agency');
}
