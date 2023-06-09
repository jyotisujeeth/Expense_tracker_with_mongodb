function saveToStorage(event) {
    event.preventDefault();
    const expenseamount = event.target.expenseamount.value;
    const description = event.target.description.value;
    const category = event.target.category.value;
    const token = localStorage.getItem("token");
  
    const obj = {
      expenseamount,
      description,
      category,
    };
  
    axios
      .post("http://localhost:3000/user/addExpense", obj, {
        headers: { Authorization: token },
      })
      .then((response) => {
        console.log(response);
  
        // showListofRegisteredExpenses(newExpenseDetail);
        showListofRegisteredExpenses(response.data.newExpenseDetail);
      })
      .catch((err) => {
        console.log(err);
      });
  
    //clear inout fields
    document.getElementById("description").value = "";
    document.getElementById("expenseamount").value = "";
    document.getElementById("category").value = "";
  }
  
  function showListofRegisteredExpenses(user) {
    const parentNode = document.getElementById("listofExpenses");
    const createNewUserHtml = `<li id=${user._id}>${user.expenseamount} - ${user.description} - ${user.category} 
                                              <button class="del", onclick="deleteUser('${user._id}')">Delete</button>
                                              <button class="edt", onclick="editUser('${user._id}','${user.description}','${user.expenseamount}','${user.category}')">Edit</button>
                                             
                                           </li>
                                          `;
  
    parentNode.innerHTML += createNewUserHtml;
  
    document.getElementById("expenseamount").value = "";
    document.getElementById("description").value = "";
    document.getElementById("category").value = "";
  }
  
  window.addEventListener("DOMContentLoaded", async (event) => {
    let Items_Per_Page = +document.getElementById("Items_Per_Page");
  
    const token = localStorage.getItem("token");
  
    let page = 1;
  
    let response = await axios.post(
      `http://localhost:3000/user/getExpenses/${page}`,
      { Items_Per_Page: Items_Per_Page },
      { headers: { Authorization: token } }
    );
  
    checkIfPremiumUser();
  
    if (response.status === 200) {
      console.log("************");
      console.log(response.data);
      const listOfUsers = document.getElementById("listofExpenses");
  
      console.log(response.data.info);
      listOfUsers.innerHTML = "";
      for (let i = 0; i < response.data.data.length; i++) {
        showListofRegisteredExpenses(response.data.data[i]);
      }
  
      showPagination(response.data.info);
    }
  });
  
  function checkIfPremiumUser() {
    let userType = localStorage.getItem("user");
  
    if (userType == "true") {
      premiumUser();
      reportDownload();
      getPremiumLeaderboard();
      console.log("12121212121");
    }
  }
  
  function reportDownload() {
    const down = document.getElementById("report");
    down.innerHTML = "Report";
  }
  
  function deleteUser(userId) {
    // console.log("777777777777777");
    const token = localStorage.getItem("token");
  
    axios
      .delete(`http://localhost:3000/user/deleteExpense/${userId}`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        removeItemFromScreen(userId);
        console.log("remove successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
  function editUser(userId, expenseDescription, expenseAmount, expenseCategory) {
    document.getElementById("description").value = expenseDescription;
    document.getElementById("expenseamount").value = expenseAmount;
    document.getElementById("category").value = expenseCategory;
  
    deleteUser(userId);
  }
  
  function removeItemFromScreen(userId) {
    const parentNode = document.getElementById("listOfExpenses");
    const elem = document.getElementById(userId);
    parentNode.removeChild(elem);
  }
  
  async function payment(e) {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:3000/purchase/premiummembership",
      { headers: { Authorization: token } }
    );
    console.log(response);
  
    var options = {
      key: response.data.key_id, //Enter the key ID generated from the Dashboard
  
      name: "Test Company",
      order_id: response.data.order.id, //for one time payment
      prefill: {
        name: "Raksha",
        email: "test.user@example.com",
        contact: "9823634119",
      },
      theme: {
        color: "#3399cc",
      },
      //This handler function will handle the success payment
      handler: function (response) {
        console.log(response);
        axios
          .post(
            "http://localhost:3000/purchase/updatetransactionstatus",
            {
              order_id: options.order_id,
              payment_id: response.razorpay_payment_id,
            },
            { headers: { Authorization: token } }
          )
          .then(() => {
            localStorage.setItem("user", true);
            premiumUser();
  
            getPremiumLeaderboard();
            alert("You are a Premium User Now");
          })
          .catch(() => {
            alert("Something went wrong. Try Again!!!");
          });
      },
    };
  
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();
  
    rzp1.on("payment.failed", function (response) {
      alert("Something went wrong");
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
  }
  
  function reportGenerate(event) {
    let usertype = localStorage.getItem("user");
    console.log(usertype == "true");
    if (usertype == "true") {
      window.location.href = "../Report/reports.html";
    }
  }
  
  function showPagination({
    currentPage,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
    lastPage,
  }) {
    let page = 1;
    const pagination = document.getElementById("pagination");
  
    pagination.innerHTML = "";
  
    if (hasPreviousPage) {
      const button1 = document.createElement("button");
      button1.innerHTML = previousPage;
      button1.addEventListener("click", () =>
        getPageExpenses(page, previousPage)
      );
      pagination.appendChild(button1);
    }
  
    const button2 = document.createElement("button");
    button2.classList.add("active");
    button2.innerHTML = currentPage;
    button2.addEventListener("click", () => getPageExpenses(page, currentPage));
    pagination.appendChild(button2);
  
    if (hasNextPage) {
      const button3 = document.createElement("button");
      button3.innerHTML = nextPage;
      button3.addEventListener("click", () => getPageExpenses(page, nextPage));
      pagination.appendChild(button3);
    }
  
    if (currentPage != lastPage && nextPage != lastPage && lastPage != 0) {
      const button3 = document.createElement("button");
      button3.innerHTML = lastPage;
      button3.addEventListener("click", () => getPageExpenses(page, lastPage));
      pagination.appendChild(button3);
    }
  }
  
  async function getPageExpenses(page, limitper) {
    const listOfExpenses = document.getElementById("listofExpenses");
  
    let Items_Per_Page = limitper;
    // console.log("\\\\\\\\\\");
    // console.log(Items_Per_Page);
    const token = localStorage.getItem("token");
    let response = await axios.post(
      `http://localhost:3000/user/getExpenses/${page}`,
      { Items_Per_Page: Items_Per_Page },
      { headers: { Authorization: token } }
    );
  
    if (response.status === 200) {
      // console.log(response.data.info);
      console.log("111111111111");
      listOfExpenses.innerHTML = " ";
  
      for (let i = 0; i < response.data.data.length; i++) {
        showListofRegisteredExpenses(response.data.data[i]);
      }
      showPagination(response.data.info);
    }
  }
  
  function premiumUser() {
    const premium = document.getElementById("premium");
    premium.innerHTML = "Its Premium Account";
    document.body.classList.remove("light");
    document.body.classList.add("dark");
    document.getElementsByClassName("center")[0].classList.remove("light");
    document.getElementsByClassName("center")[0].classList.add("dark");
    document.getElementById("expense-div").classList.remove("light");
    document.getElementById("expense-div").classList.add("dark");
  
    document.getElementById("left").classList.remove("light");
    document.getElementById("left").classList.add("dark");
    document.getElementsByTagName("input")[0].classList.add("dark");
    document.getElementById("right").style = "display:block";
  }
  
  async function getPremiumLeaderboard() {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:3000/expense/premiums", {
        headers: { Authorization: token },
      });
  
      if (response.data.success) {
        console.log(response);
  
        console.log("leaderboard data :", response.data);
  
        leaderboard.innerHTML = "";
        //transform each element of an array and create a new array out of the argument which
        // console.log(id); //we are passing
      }
  
      response.data.forEach((userData, id) => {
        const leaderboardDiv = document.getElementById("right");
        let child = `<li class="leaderboardList">
                        <p class="sno">${id + 1} </p>
                        <p class="name" id="userData" ('${userData.userId}')">${
          userData.name
        }</p>
                        <p class="name">${userData.totalExpense}</p>
                </li>`;
        leaderboardDiv.innerHTML += child;
      });
    } catch (err) {
      console.log(err);
    }
  }
  
  // function showLeaderboard(userData, id) {
  //   // console.log(id, user);
  //    console.log(user);
  // }
  
  function perPage(event) {
    let Items_Per_Page = +document.getElementById("Items_Per_Page");
    let page = 1;
    event.preventDefault();
    console.log("*****************");
    console.log(Items_Per_Page);
    // console.log(typeof +event.target.Items_Per_Page.value);
    //Items_Per_Page = +event.target.Items_Per_Page.value
    localStorage.setItem("itemsperpage", +event.target.Items_Per_Page.value);
    Items_Per_Page = localStorage.getItem("itemsperpage");
    getPageExpenses(page, +event.target.Items_Per_Page.value);
    //event.target.Items_Per_Page.value
  }
  
  function openUserExpenses(user) {
    console.log(user);
    localStorage.setItem("clickedUser", user);
    window.location.href = "./leaderboard.html";
    //yet to be completed
    //if clicked gets detailed payment of individual users
    //which makes  a post req to the user id another route
    // let response = await axios.post('http://localhost:3000/expense/leaderboard-user'
  }