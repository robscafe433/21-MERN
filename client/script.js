document.getElementById("searchBooks").onclick = function () {
    document.getElementById("searchContainer").style.display = "block";
};

document.getElementById("loginSignup").onclick = function () {
    document.getElementById("modal").style.display = "block";
    document.getElementById("formContainer").innerHTML = `
        <input type="email" id="email" placeholder="Email">
        <input type="password" id="password" placeholder="Password">
        <button id="loginButton">Login</button>
        <button id="signupButton" style="display:none;">Signup</button>
    `;
};

document.getElementById("submitSearch").onclick = async function () {
    const query = document.getElementById("searchInput").value;
    const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}`
    );
    const data = await response.json();
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";
    data.items.forEach((item) => {
        resultsDiv.innerHTML += `
            <div>
                <h3>${item.volumeInfo.title}</h3>
                <p>Author: ${item.volumeInfo.authors.join(", ")}</p>
                <p>${item.volumeInfo.description}</p>
                <img src="${item.volumeInfo.imageLinks.thumbnail}" alt="${
            item.volumeInfo.title
        }">
                <a href="${
                    item.volumeInfo.infoLink
                }" target="_blank">View on Google Books</a>
                <button class="saveButton" data-id="${item.id}">Save</button>
            </div>
        `;
    });
};

document.getElementById("modal").onclick = function (event) {
    if (event.target.id === "modal") {
        document.getElementById("modal").style.display = "none";
    }
};

document.getElementById("formContainer").onclick = function (event) {
    if (event.target.id === "loginButton") {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        fetch("/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                    document.getElementById("modal").style.display = "none";
                }
            });
    }
    if (event.target.id === "signupButton") {
        // Handle signup logic
    }
};

// Add event listener for Save buttons after results are displayed
document
    .getElementById("results")
    .addEventListener("click", async function (event) {
        if (event.target.classList.contains("saveButton")) {
            const bookId = event.target.getAttribute("data-id");
            const token = localStorage.getItem("token");
            await fetch("/api/users/save", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ bookId }),
            });
        }
    });
