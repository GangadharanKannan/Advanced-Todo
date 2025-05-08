let rootElement = document.getElementById("root");
accessToken = localStorage.getItem("accessToken");
let editMode = false;
let editTaskId = null;

if(!accessToken) {
    renderSignIn()
} else {
    renderTodo()
}


function renderSignUp(){
    rootElement.innerHTML = ""
    let divElement = document.createElement("div");
    divElement.innerHTML =`<div class="flex flex-col justify-center items-center gap-5 mt-10">
                                <div>
                                    <label for="email" class="font-semibold text-lg">Email</label>
                                    <input type="text" id="email" placeholder="Enter the Email" class="border-2 border-black flex mt-1 px-12 py-2 rounded-lg"/>
                                </div>
                                <div>
                                    <label for="password" class="font-semibold text-lg">Password </label>
                                    <input type="password" id="password" placeholder="Enter the Password" class="border-2 border-black mt-1 flex px-12 py-2 rounded-lg"/>
                                </div>
                                <button id="SignUpBtn" class="bg-black text-white px-20 py-2 rounded-lg">Sign Up</button>
                            </div>`
    rootElement.appendChild(divElement);
    divElement.querySelector("#SignUpBtn").addEventListener("click",() => {
        // let email = document.getElementById("email").value ;
        // let password = document.getElementById("password").value ;

       
        fetch("https://todo-backend-tqid.onrender.com/signup",{
            method: 'POST',
            headers : {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username : document.getElementById("email").value,
                password : document.getElementById("password").value
            })
        }).then( response => {
            return response.json();
        }).then( result => {
            console.log(result.message);
            if(result.message){
                renderSignIn();
            } else {
                alert("plz enter Correct Inputs");
            }
            
        }).catch(error => {
            console.log(error);
        })
    })
}

function renderSignIn(){
    rootElement.innerHTML = ""
    let divElement = document.createElement("div");
    divElement.innerHTML =`<div class="flex flex-col justify-center items-center gap-5 mt-10">
                                <div>
                                    <label for="email" class="font-semibold text-lg">Email</label>
                                    <input type="text" id="email" placeholder="Enter the Email" class="border-2 border-black mt-2 flex px-12 py-2 rounded-lg"/>
                                </div>
                                <div>
                                    <label for="password" class="font-semibold text-lg">Password </label>
                                    <input type="password" id="password" placeholder="Enter the Password" class="border-2 border-black mt-2 flex px-12 py-2 rounded-lg"/>
                                </div>
                                <p id="detail" class="text-red-500 font-normal text-base"></p>
                                <div>
                                <button id="SignInBtn" class="bg-blue-700 text-white px-10 py-2 rounded-lg">Sign In</button>
                                <button id="SignUpBtn" class="bg-green-700 text-white px-10 py-2 rounded-lg">New User</button>
                                </div>
                            </div>`
    rootElement.appendChild(divElement);
    divElement.querySelector("#SignInBtn").addEventListener("click", () => {

        fetch("https://todo-backend-tqid.onrender.com/signin",{
            method: 'POST',
            headers : {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username : document.getElementById("email").value,
                password : document.getElementById("password").value
            })
        }).then( response => {
            return response.json();
        }).then( result => {
            console.log(result);
            if(result.token){
                renderTodo()
                localStorage.setItem("accessToken", result.token)
            } else {
                divElement.querySelector("#detail").innerHTML = result.detail;
            }
        }).catch(error => {
            console.log(error);
        })
    })
    divElement.querySelector("#SignUpBtn").addEventListener("click", () => {
        renderSignUp();
    })

}


function renderTodo() {
    rootElement.innerHTML = ""
    let divElement = document.createElement("div");
    divElement.innerHTML =`<div class="flex flex-col justify-center items-center gap-5 bg-blue-600 h-screen">
                                <div class="bg-white p-5 w-[550px] rounded-lg">
                                    <div class="flex items-center gap-5">
                                        <h1 class="text-[#002765] font-semibold text-2xl">To-Do List</h1>
                                        <img src="./img/todo-img1.png" class="h-10"/>
                                    </div>
                                    <div class="mt-3 flex justify-center gap-2">
                                        <input id="taskAdd" type="text" placeholder="Add your task" class="bg-gray-200 px-20 py-3 rounded-full"/>
                                        <button id="addTskBtn" class="bg-orange-500 px-7 py-3 rounded-full text-white font-semibold text-base">Add Task</button>
                                    </div>
                                    <div class="mt-10 mb-7" id="outputTask">

                                    </div>
                                </div>
                            </div>`
    rootElement.appendChild(divElement);
    todoRend();
    divElement.querySelector("#addTskBtn").addEventListener("click",() =>{

        const taskInput = document.getElementById("taskAdd").value;

        if(editMode && editTaskId !== null){
            fetch(`https://todo-backend-tqid.onrender.com/tasks/${editTaskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    title : taskInput
                })
            })
            .then( response => response.json())
            .then( data => {
                console.log("Todo updated:", data);
                editMode = false;
                editTaskId = null;
                todoRend()
            })
            .catch(error => {
                console.error("Error updating todo:", error);
            })
        } else {
        fetch("https://todo-backend-tqid.onrender.com/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                title : taskInput
            })
        })
        .then( response => response.json())
        .then( data => {
            console.log("Todo created:", data);
            todoRend()
        })
        .catch(error => {
            console.error("Error creating todo:", error);
        })
    }
        document.getElementById("taskAdd").value = "";
    })

}
function todoRend(){
    let output = document.getElementById("outputTask");
    output.innerHTML = ""
    fetch("https://todo-backend-tqid.onrender.com/tasks", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    })
    .then( response => response.json())
    .then( data => {
        data.forEach((element,index) => {
            // let output = document.getElementById("outputTask");
            output.innerHTML += `
                                                        <div class="mt-6 flex items-center justify-between gap-8">
                                                            <div class="flex items-center gap-8">
                                                                <input type="checkbox" class="ms-14" id="checkBox-${index}" onchange="markChange(${index})"/>
                                                                <h1 id="item-${index}" class="font-semibold text-[17px]">${element.title}</h1>
                                                            </div>
                                                            <div class="mr-10 flex justify-end items-center gap-8">
                                                                <svg id="editBtn" onclick="editBtn(${element.id},'${element.title}')" class="h-[18px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z"/></svg>
                                                                <svg id="crossBtn" onclick="removeBtn(${element.id})" class="h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                                                            </div>
                                                        </div>`
        });
    })
    .catch(error => {
        console.error("Error Fetching todo:", error);
    })
}
function markChange(i){
    let checkedIn = document.getElementById(`checkBox-${i}`);
    if(checkedIn.checked){
        document.getElementById(`item-${i}`).style.textDecoration = "line-through 2px";
    } else {
        document.getElementById(`item-${i}`).style.textDecoration = "none";
    }
}

function removeBtn(id) {
    console.log("hello");
    fetch(`https://todo-backend-tqid.onrender.com/tasks/${id}` , {
        method: "DELETE",
        headers: {
            "Authorization" : `Bearer ${accessToken}`,
        }
    })
    .then( res => res.json())
    .then( data => {
        console.log("Task deleted:", data);
        todoRend();
    })
    .catch( error => {
        console.log("Error deleting:", error);
    })
}

function editBtn(id,title) {
    document.getElementById("taskAdd").value = title;
    editMode = true;
    editTaskId = id;
}