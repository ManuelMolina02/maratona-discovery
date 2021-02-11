
//button
const authEmailPassButton = document.getElementById('authEmailPassButton');

const authGoogleButton = document.getElementById('authGoogleButton');
const authGitHubButton = document.getElementById('authGitHubButton');
//inputs
const inputEmail = document.getElementById('inputEmail');
const inputPassword = document.getElementById('inputPassword');

//autenticar/ logar com usuário
authEmailPassButton.addEventListener('click', function() {
    firebase
    .auth()
    .signInWithEmailAndPassword(inputEmail.value, inputPassword.value)
    .then(function(result) {
        console.log(result);
        displayName.innerText = 'Bem vindo, ' + inputEmail.value;
        alert('Usuário ' + inputEmail.value + ' autenticado.');
    })
    .catch(function(error) {
        console.error(error.code);
        console.error(error.message);
        alert('Falha ao autenticar, verifique o erro no console.');
    });
});


//Autenticar GitHub
authGoogleButton.addEventListener('click', function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    signIn(provider);
});

authGitHubButton.addEventListener('click', function() {
    var provider = new firebase.auth.GithubAuthProvider();
    signIn(provider);
});

function signIn(provider) {
    firebase.auth()
    .signInWithPopup(provider)
    .then(function(result) {
        console.log(result);
        var token = result.credential.accessToken;
        displayName.innerText = 'Bem vindo ';
    }).catch(function (error) {
        console.log(error);
        alert('Falha na autenticação');
    });
}