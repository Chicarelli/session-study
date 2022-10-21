function getSomething() {
  fetch('/a')
    .then((res) => res.json())
    .then((data) => console.log(data));
}
