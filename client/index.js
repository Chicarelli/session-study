function getSomething() {
  fetch('/a')
    .then((res) => res.json())
    .then((data) => console.log(data));
}

function getSession() {
  fetch('/getSession')
    .then((res) => res.json())
    .then((data) => console.log(data));
}

function setSession() {
  fetch('/setSession')
    .then((res) => res.json())
    .then((data) => console.log(data));
}

function deleteSession() {
  fetch('/deleteSession')
    .then((res) => res.json())
    .then((data) => console.log(data));
}
