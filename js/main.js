const users = [];

const login = document.getElementById("login");
const signup = document.getElementById("signup");

const loadUsers = () => {
    const data = JSON.parse(localStorage.getItem("users"));
    if(!data) return;
    users.push(...data);
}

const saveUsers = () => {
    localStorage.setItem("users", JSON.stringify(users));
    users.splice(0, users.length);
}

if(login){
    console.log("In the login page.");

    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const errorMessage = document.getElementById("login-error");
    const loginForm = document.getElementById("login-form");
    
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        loadUsers();
        
        const user = users.find((user) => user.email === email.value.trim());
        if(!user){
            errorMessage.textContent = "No Accout Found";
            errorMessage.classList.remove("hidden");
            return;
        }
        if(password.value.trim() !== user.password){
            errorMessage.textContent = "Invalid Password";
            errorMessage.classList.remove("hidden");
            return;
        }
        
        saveUsers();
        errorMessage.classList.add("hidden");
        window.location.href = `./dashboard.html`;
    });
}

if(signup){
    console.log("In the signup page");
    
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const signupForm = document.getElementById("signup-form");
    const errorMessage = document.getElementById("signup-error");

    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        loadUsers();

        const user = users.find((user) => user.email === email);

        if(user){
            errorMessage.textContent = "Account already Exists!";
            errorMessage.classList.remove("hidden");
            return;
        }

        if(password.value.trim() !== confirmPassword.value.trim()){
            errorMessage.textContent = "Password doesn't match.";
            errorMessage.classList.remove("hidden");
            return;
        }

        const newUser = {
            "name": name.value.trim(),
            "email": email.value.trim(),
            "password": password.value.trim()
        }

        users.push(newUser);

        saveUsers();
        errorMessage.classList.add("hidden");
        window.location.href = `./login.html`;
    });
}