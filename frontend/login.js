const formLogin = document.getElementById('formLogin');


formLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3001/clients') 
    .then(response => response.json())
    .then(
        users => {
            users.forEach(user => {
                if (user.email === email && user.password === password) {
                    alert('Login successful!');
                }
            })
        }
    )
    .catch(error => console.error(error));
});
