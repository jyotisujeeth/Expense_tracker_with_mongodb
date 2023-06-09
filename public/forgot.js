function forgotPass(event) {
    event.preventDefault();
    const email = event.target.email.value;
  
    const token = localStorage.getItem("token");
  
    const obj = {
      email,
    };
    console.log("1995");
  
    axios
      .post("http://localhost:3000/password/forgotpassword", obj, {
        headers: { Authorization: token },
      })
      .then((response) => {
        if (response.status === 202) {
          document.body.innerHTML +=
            '<div style="color:red;text-align:center;margin-top:70px;">Mail Successfuly sent <div>';
        } else {
          throw new Error("Something went wrong!!!");
        }
      })
      .catch((err) => {
        document.body.innerHTML += `<div style="color:red;text-align:center;margin-top:70px;">${err} <div>`;
      });
  }