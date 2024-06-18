const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const loginContainer = document.getElementById('login-container');
const appContainer = document.getElementById('app-container');

// Define the user role (for demonstration purposes)
let userRole = 'guest'; // Default to guest

// Placeholder for OPAL server URL
const OPAL_SERVER_URL = 'https://example.com/v1/data/policies'; // Replace with your actual OPAL server URL

// Function to handle login
function login(role) {
    userRole = role;
    loginContainer.style.display = 'none';
    appContainer.style.display = 'block';
}

// Function to check if the user has permission to perform an action
async function policyCheck(action) {
    const policies = {
        admin: {
            canAdd: true,
            canDelete: true,
        },
        guest: {
            canAdd: true,
            canDelete: false,
        }
    };

    try {
        const response = await fetch(OPAL_SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: {
                    role: userRole,
                    action: action
                }
            })
        });

        const result = await response.json();
        return result.result.allow;
    } catch (error) {
        console.error('Error fetching policy check:', error);
        // Fallback to local policies if OPAL request fails
        return policies[userRole][action];
    }
}

async function addTask() {
    if (inputBox.value === '') {
        alert("You must write a Task");
    } else if (!(await policyCheck('canAdd'))) {
        alert("You do not have permission to add tasks.");
    } else {
        let li = document.createElement("li");
        li.textContent = inputBox.value;

        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);

        listContainer.appendChild(li);

        // Clear input after adding task
        inputBox.value = "";

        // Save data after adding task
        saveData();
    }
}

listContainer.addEventListener("click", async function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
    } else if (e.target.tagName === "SPAN") {
        // Check if user is admin or has delete permission
        if (await policyCheck('canDelete')) {
            e.target.parentElement.remove();
            saveData();
        } else {
            alert("Only admins can delete tasks.");
        }
    }
}, false);

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
}

showTask();

function switchUser() {
    userRole = (userRole === 'admin') ? 'guest' : 'admin';
    showTask(); // Reload tasks based on the new user role

    // Display a message indicating the current user role
    const message = (userRole === 'admin') ? 'You are now logged in as Admin.' : 'You are now logged in as Guest.';
    alert(message);
}
async function policyCheck(action) {
    const policies = {
        admin: {
            canAdd: true,
            canDelete: true,
        },
        guest: {
            canAdd: true,
            canDelete: false,
        }
    };

    try {
        const response = await fetch(OPAL_SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: {
                    role: userRole,
                    action: action
                }
            })
        });

        const result = await response.json();
        console.log('OPAL Response:', result); // Log OPAL response

        return result.result.allow;
    } catch (error) {
        console.error('Error fetching policy check:', error);
        // Fallback to local policies if OPAL request fails
        console.log('Falling back to local policies.');
        return policies[userRole][action];
    }
}
