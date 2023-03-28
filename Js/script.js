// Global variables tht used
const AddButtons = document.querySelectorAll(".add");
const parenDivs = document.querySelectorAll(".container-boxez div");
const MyMenu = document.getElementById("myMenu");
const copy = document.getElementById("copy");
/* This feature  Still under work
const colorChoice = document.getElementById("color");
const colorPicker = document.getElementById("colorPicker"); */
let stateCopy;
let drag = null;
let dragDateId;
let oldPos;
let touchTime;

let dataToLocalStorage = {
    not_started: [],
    progress: [],
    completed: [],
};

// Events to doucment and window

document.addEventListener("click", () => {
    MyMenu.style.display = "none";
    stateCopy = null;
});

window.addEventListener("load", () => {
    dataToLocalStorage = read();
    RenderFromLocalStorage(dataToLocalStorage);
});

copy.addEventListener("click", () => {
    copyToCliboard(stateCopy);
});

function copyToCliboard(element) {
    const text = element.textContent;
    navigator.clipboard.writeText(text);
}

function handleTouchStart(event, li) {
    li.querySelector("p").contentEditable = false;

    drag = li;
    console.log("klfd", drag);
    li.style.opacity = "0.5";

    [...event.changedTouches].forEach((touch) => {
        li.style.left = `${touch.pageX / 100}px`;
        li.style.top = `${touch.pageY / 100}px`;
    });

    dragDateId = li.getAttribute("data-date");
    oldPos = li.closest("div").id;
}

// This funny problem i take three days to solve it
/*
the problem was when i try to drop element to completed clumn (the last column by defualt)
it was added to progress or not_started 

I found the solve to this issue when i remove UpdateDrop function form if condation block and 
added it to the end of the block of the function because
there was forEach loop 
so when for loop end the update drop function recalled
*/
function handleTouchEnd(event) {
    // if (Date.now() - touchTime < 1000) return;
    let newPOS;
    let ul;
    this.style.opacity = "1";
    [...event.changedTouches].forEach((touch) => {
        console.log(this);
        this.style.position = "relative";
        this.style.top = "0px";
        this.style.left = "0px";
        parenDivs.forEach((childDiv) => {
            if (childDiv.offsetTop < touch.pageY && drag !== null) {
                ul = childDiv.querySelector("ul");
                ul.appendChild(drag);
                newPOS = ul.closest("div").id;
            }
        });
    });
    // To remove the over class from the current column

    ul.classList.remove("over");
    // To remove the over class from the old column
    document
        .getElementById(oldPos)
        .querySelector("ul")
        .classList.remove("over");
    UpdateDrop(dragDateId, newPOS);

    dragDateId = null;
    oldPos = null;
    drag = null;
}

const uls = document.querySelectorAll("ul");
let touchStartY = null;
let startY = 0;
let scrollY = 0;
uls.forEach((ul) => {
    ul.addEventListener("touchstart", (e) => {
        startY = e.touches[0].pageY;
        scrollY = ul.scrollTop;
    });

    ul.addEventListener("touchmove", (e) => {
        const touchY = e.touches[0].pageY;
        const touchDeltaY = touchY - startY;
        ul.scrollTop = scrollY - touchDeltaY;
    });

    ul.addEventListener("touchend", () => {
        startY = 0;
        scrollY = 0;
    });
});

// Thi big function i will explain it (maybe i will updat it in the near feautre)
/*
This function take three arguments 
Ul => it's the ul element that will add the li to it
taskObj = > this is taskoBj it passes to function beacuse it contain the data-date value the unique identifier for the task and the task text
contentEdit (false) => this just make if it add the task using button it focus in the li 

First i create all elements that will be used and maked it using create , append to add eventlistner to it
*/
function createELementsAndAppend(Ul, taskObj, contentEdit = false) {
    const li = document.createElement("li");
    const p = document.createElement("p");
    const editIcon = document.createElement("i");
    const trashIcon = document.createElement("i");
    const span = document.createElement("span");
    trashIcon.classList.add("fa-solid", "fa-trash-can", "trash");
    editIcon.classList.add("fa-solid", "fa-pen-to-square", "edit");
    span.appendChild(editIcon);
    span.appendChild(trashIcon);
    Ul.appendChild(li);
    li.appendChild(p);
    li.appendChild(span);
    li.draggable = true;
    li.addEventListener("dblclick", (event) => {
        event.target.querySelector("p").contentEditable = true;
        p.focus();
    });

    // p Events Listener

    p.addEventListener("dblclick", (event) => {
        event.target.contentEditable = true;
        p.focus();
    });

    p.addEventListener("blur", (event) => {
        event.preventDefault();

        event.target.contentEditable = false;
        UpdateItem(taskObj.id, event.target.textContent);
    });

    p.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.target.contentEditable = false;

            UpdateItem(taskObj.id, event.target.textContent);
        }
    });
    // Edit icon and tarsh evetns

    trashIcon.addEventListener("click", (event) => {
        event.target.parentElement.parentElement.remove();
        deleteItem(taskObj.id, Ul.parentElement.id);
    });
    editIcon.addEventListener("click", (event) => {
        const pEdit = event.target.parentElement.previousElementSibling;
        if (pEdit.contentEditable === "true") {
            pEdit.contentEditable = false;
            UpdateItem(
                taskObj.id,
                event.target.parentElement.previousElementSibling.textContent
            );
        } else {
            pEdit.contentEditable = true;
            p.focus();
        }
    });

    trashIcon.addEventListener("touchstart", (event) => {
        event.target.parentElement.parentElement.remove();
        deleteItem(taskObj.id, Ul.parentElement.id);
    });

    editIcon.addEventListener("touchstart", (event) => {
        const pEdit = event.target.parentElement.previousElementSibling;

        pEdit.contentEditable = true;
        p.focus();
    });
    // li Events Listener

    li.addEventListener(
        "dragstart",
        () => {
            drag = li;
            dragDateId = li.getAttribute("data-date");
            oldPos = li.closest("div").id;
            li.style.opacity = "0.5";
        },
        false
    );

    li.addEventListener(
        "touchstart",
        function (event) {
            handleTouchStart(event, li);
        },
        false
    );

    li.addEventListener(
        "touchmove",
        (event) => {
            event.preventDefault();
            [...event.changedTouches].forEach((touch) => {
                li.style.position = "absolute";
                li.style.top = `${touch.pageY}px`;
                li.style.left = `${touch.pageX}px`;

                if (touch.clientY > window.innerHeight - li.offsetHeight) {
                    window.scrollBy(0, 1);
                } else {
                    window.scrollBy(0, -1);
                }
                parenDivs.forEach((childDiv) => {
                    if (childDiv.offsetTop < touch.pageY) {
                        let currentChild = childDiv.querySelector("ul");
                        currentChild.classList.add("over");
                    } else {
                        let currentChild = childDiv.querySelector("ul");
                        currentChild.classList.remove("over");
                    }
                });
            });
        },
        false
    );
    li.addEventListener("touchend", handleTouchEnd, false);

    li.addEventListener("dragend", () => {
        drag = null;
        dragDateId = null;
        oldPos = null;
        li.style.opacity = "1";
    });

    li.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        MyMenu.style.display = "block";
        MyMenu.classList.add("show");
        MyMenu.style.top = event.pageY + "px"; // position the context menu at the mouse pointer
        MyMenu.style.left = event.pageX + "px";
        stateCopy = event.target;
    });
    p.textContent = taskObj.task;
    li.setAttribute("data-date", taskObj.id);

    if (contentEdit) {
        p.contentEditable = true;
        p.focus();
    }
}

// This work in pc only because touch events i add it in the pervious function

parenDivs.forEach((childDiv) => {
    childDiv.addEventListener(
        "dragover",
        (event) => {
            event.preventDefault();
            childDiv.classList.add("over");
        },
        false
    );

    childDiv.addEventListener(
        "dragleave",
        () => {
            childDiv.classList.remove("over");
        },
        false
    );

    childDiv.addEventListener("drop", (event) => {
        let divId = childDiv.id;
        const ul = childDiv.querySelector("ul");
        ul.append(drag);
        childDiv.classList.remove("over");

        UpdateDrop(dragDateId, divId);
    });
});

AddButtons.forEach((AddButton) => {
    AddButton.addEventListener("click", (event) => {
        const parentDivBtn = event.target.parentElement;
        const id = new Date().getTime();
        const taskElement = {
            id: id,
            task: " ",
        };
        createELementsAndAppend(
            parentDivBtn.querySelector("ul"),
            taskElement,
            true
        );
        dataToLocalStorage[parentDivBtn.id].push(taskElement);
        save(dataToLocalStorage);
    });
});

// Local Storage
function read() {
    let json = localStorage.getItem("KanbanData");
    if (!json)
        return {
            not_started: [],
            progress: [],
            completed: [],
        };
    return JSON.parse(json);
}

function save(data) {
    dataToLocalStorage = data;
    localStorage.setItem("KanbanData", JSON.stringify(data));
}

function deleteItem(datadate, pos) {
    const data = read();
    let item;
    item = data[pos].find((item) => item.id == datadate);
    if (!item) return;
    const index = data[pos].indexOf(item);
    if (index > -1) {
        data[pos].splice(index, 1);
    }
    save(data);
}

// Update Local Storage when drop

function UpdateDrop(datadate, newPos) {
    const data = read();
    let item;

    item = data[oldPos].find((item) => item.id == datadate);
    if (!item) return;
    const index = data[oldPos].indexOf(item);
    if (index > -1) {
        data[oldPos].splice(index, 1);
    }
    deleteItem(datadate, oldPos);
    data[newPos].push(item);
    save(data);
}

// Update when contentEditable be false

function UpdateItem(datadate, newUpdate) {
    const data = read();
    let item;
    for (let cul in data) {
        item = data[cul].find((item) => item.id == datadate);
        if (item) break;
    }
    if (!item) return;

    item.task = newUpdate;
    save(data);
}

// Called when page refresh or rerender
function RenderFromLocalStorage(data) {
    for (const stateClass in data) {
        const cul = document.getElementById(stateClass);
        const StateUl = cul.querySelector("ul");
        data[stateClass].forEach((taskObj) => {
            createELementsAndAppend(StateUl, taskObj);
        });
    }
}

////////////////////////////////////////
