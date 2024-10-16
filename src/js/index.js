function displayPage(pageID) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
  document.getElementById(pageID).classList.add('active');
}

document.getElementById('myForm').addEventListener('submit', function (event) {
  event.preventDefault();

  let genre = document.querySelector('input[name="genre"]:checked').value;
  let name = document.getElementById('name').value;

  console.log('Selected genre:', genre);
  console.log('Name:', name);
});
