const AddButtons = document.querySelectorAll(".add");
const parenDivs = document.querySelectorAll(".container-boxez div");
const MyMenu = document.getElementById("myMenu");
const copy = document.getElementById("copy");
const colorChoice = document.getElementById("color");
const colorPicker = document.getElementById("colorPicker");
let stateCopy;
let drag;
let dragDateId;
let oldPos;

let dataToLocalStorage = {
    not_started: [],
    progress: [],
    completed: [],
};

document.addEventListener("click", () => {
    MyMenu.style.display = "none";
    stateCopy = null;
});

copy.addEventListener("click", () => {
    copyToCliboard(stateCopy);
});

function copyToCliboard(element) {
    const text = element.textContent;
    navigator.clipboard.writeText(text);
}

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
        (event) => {
            drag = event.target;
            dragDateId = event.target.getAttribute("data-date");
            oldPos = event.target.parentElement.parentElement.id;
            li.style.opacity = "0.5";
        },
        false
    );

    li.addEventListener(
        "touchstart",
        (event) => {
            if (event.target.tagName !== "LI") {
                if (event.target.tagName === "I") {
                    drag = event.target.parentElement.parentElement;
                }
            } else {
                drag = event.target;
            }
            li.style.opacity = "0.5";

            [...event.changedTouches].forEach((touch) => {
                li.style.left = `${touch.pageX}px`;
                li.style.top = `${touch.pageY}px`;
                li.id = touch.identifier;
            });

            dragDateId = event.target.getAttribute("data-date");
            oldPos = event.target.parentElement.parentElement.id;
        },
        false
    );

    li.addEventListener("touchmove", (event) => {
        event.preventDefault();
        [...event.changedTouches].forEach((touch) => {
            li.style.position = "absolute";
            li.style.top = `${touch.pageY}px`;
            li.style.left = `${touch.pageX}px`;
            li.id = touch.identifier;

            parenDivs.forEach((childDiv) => {
                if (childDiv.offsetTop < touch.pageY) {
                    let uls = childDiv.querySelector("ul");
                    childDiv.style.backgroundColor = "red";
                } else {
                    let uls = childDiv.querySelector("ul");
                    childDiv.style.backgroundColor = "green";
                }
            });
        });
    });
    li.addEventListener("touchend", (event) => {
        li.style.opacity = "1";
        [...event.changedTouches].forEach((touch) => {
            li.style.position = "relative";
            li.style.top = "0px";
            li.style.left = "0px";
            li.id = touch.identifier;

            parenDivs.forEach((childDiv) => {
                if (childDiv.offsetTop < touch.pageY && drag !== null) {
                    let uls = childDiv.querySelector("ul");
                    childDiv.style.backgroundColor = "red";
                    uls.appendChild(drag);
                    UpdateDrop(dragDateId, event.target.id);
                }
            });
        });
        drag = null;
    });
    li.addEventListener("dragend", (event) => {
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

parenDivs.forEach((childDiv) => {
    childDiv.addEventListener(
        "dragover",
        (event) => {
            event.preventDefault();
        },
        false
    );

    childDiv.addEventListener("drop", (event) => {
        let divId = event.target;
        if (divId.tagName !== "DIV") {
            if (divId.tagName === "H2") {
                divId = divId.parentElement.id;
            } else if (divId.tagName === "UL") {
                divId = divId.parentElement.id;
            } else if (divId.tagName === "LI") {
                divId = divId.parentElement.parentElement.id;
            } else if (divId.tagName === "BUTTON") {
                divId = divId.parentElement.id;
            } else if (divId.tagName == "P") {
                divId = divId.parentElement.parentElement.parentElement.id;
            } else if (divId.tagName === "I") {
                divId =
                    divId.parentElement.parentElement.parentElement
                        .parentElement.id;
            }
        }
        const ul = childDiv.querySelector("ul");
        ul.append(drag);
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
    // data[pos]
    item = data[pos].find((item) => item.id == datadate);
    if (!item) return;
    const index = data[pos].indexOf(item);
    if (index > -1) {
        data[pos].splice(index, 1);
    }
    save(data);
}

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

////////////////////////////////////////
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

function RenderFromLocalStorage(data) {
    for (const stateClass in data) {
        const cul = document.getElementById(stateClass);
        const StateUl = cul.querySelector("ul");
        data[stateClass].forEach((taskObj) => {
            createELementsAndAppend(StateUl, taskObj);
        });
    }
}

window.addEventListener("load", () => {
    dataToLocalStorage = read();
    RenderFromLocalStorage(dataToLocalStorage);
});
