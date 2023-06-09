function login(e) {
    e.preventDefault();
    console.log(e.target.name);
  
    const loginDetails = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
  
    console.log(loginDetails);
    axios
      .post("http://localhost:3000/user/login", loginDetails)
      .then((response) => {
        alert(response.data.message);
        localStorage.setItem("token", response.data.token);
        if (response.status === 200) {
          window.location.href = "./ExpenceTracker/index.html";
          // redirect("./ExpenceTracker/index.js");
          console.log("login complete");
        } else if (response.status === 207) {
          showIfUserNotExists(response.data.message);
        } else {
          throw new Error("Error failed to login");
        }
      })
      .catch((err) => {
        console.log(err);
        document.body.innerHTML += `<div style="color:red;">${err.message} <div>`;
      });
  }
  
  function showIfUserNotExists(user) {
    const parentNode = document.getElementById("listOfUsers");
    const createNewUserHtml = `<li>${user}</li>`;
  
    parentNode.innerHTML += createNewUserHtml;
  }
  