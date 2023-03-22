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
let scrollDelay = 0;
let scrollDirection = 1;

let dataToLocalStorage = {
    not_started: [],
    progress: [],
    completed: [],
};
document.addEventListener("click", () => {
    MyMenu.style.display = "none";
    stateCopy = null;
});

// document.addEventListener("keyup",(event)=>{
//     if(event.ctrlKey && event.key === "Z"){

//     }
// })

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
        // event.preventDefault();
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
        event.preventDefault();
        event.target.parentElement.parentElement.remove();
        deleteItem(taskObj.id, Ul.parentElement.id);
    });
    editIcon.addEventListener("touchstart", (event) => {
        event.preventDefault();
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

    li.addEventListener("dragend", (event) => {
        // const divId = event.target.parentElement.parentElement.id;
        // const ul = childDiv.querySelector("ul");
        // UpdateDrop(dragDateId, divId);
        drag = null;
        dragDateId = null;
        oldPos = null;
        // ul.append(drag);
        li.style.opacity = "1";
    });
    li.addEventListener(
        "touchstart",
        (event) => {
            event.preventDefault();
            // drag = event.target;
            drag = event.target;
            dragDateId = event.target.getAttribute("data-date");
            oldPos = event.target.parentElement.parentElement.id;
            li.style.opacity = "0.5";
            li.classList.add("drag-item--touchmove");

            console.log("drag start");
        },
        false
    );
    li.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        MyMenu.style.display = "block";
        MyMenu.classList.add("show");
        MyMenu.style.top = event.pageY + "px"; // position the context menu at the mouse pointer
        MyMenu.style.left = event.pageX + "px";
        stateCopy = event.target;
    });

    li.addEventListener("touchmove", touchMove, false);
    li.addEventListener("touchend", touchEnd, false);
    p.textContent = taskObj.task;
    li.setAttribute("data-date", taskObj.id);
    console.log(li);
    console.log(taskObj.id);
    if (contentEdit) {
        p.contentEditable = true;
        p.focus();
    }
}

// function DragEnd(dateID,cul){

// }

function pageScroll(a, b) {
    window.scrollBy(0, scrollDirection); // horizontal and vertical scroll increments
    scrollDelay = setTimeout(pageScroll, 5); // scrolls every 100 milliseconds

    if (a > window.innerHeight - b) {
        scrollDirection = 1;
    }
    if (a < 0 + b) {
        scrollDirection = -1 * scrollDirection;
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
        console.log("divId", divId);
        UpdateDrop(dragDateId, divId);
    });
});

let x = 1;
function touchMove(e) {
    let touchLocation = e.targetTouches[0],
        w = this.offsetWidth,
        h = this.offsetHeight;
    console.log(e.targetTouches[0] + "\nMEH");
    lastMove = e;
    touchEl = this;
    this.style.width = w + "px";
    this.style.height = h + "px";
    this.style.position = "fixed";
    this.style.left = touchLocation.clientX - w / 2 + "px";
    this.style.top = touchLocation.clientY - h / 2 + "px";

    if (
        touchLocation.clientY > window.innerHeight - h ||
        touchLocation.clientY < 0 + h
    ) {
        if (x === 1) {
            x = 0;
            pageScroll(touchLocation.clientY, h);
        }
    } else {
        clearTimeout(scrollDelay);
        x = 1;
    }
}

function touchEnd(e) {
    let box1 = this.getBoundingClientRect(),
        x1 = box1.left,
        y1 = box1.top,
        h1 = this.offsetHeight,
        w1 = this.offsetWidth,
        b1 = y1 + h1,
        r1 = x1 + w1;

    let targets = document.querySelectorAll(".container-boxez div");
    targets.forEach(function (target) {
        var box2 = target.getBoundingClientRect(),
            x2 = box2.left,
            y2 = box2.top,
            h2 = target.offsetHeight,
            w2 = target.offsetWidth,
            b2 = y2 + h2,
            r2 = x2 + w2;

        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) {
            return false;
        } else {
            // console.log("else1");
            if (touchEl.classList.contains("drag-item--prepend")) {
                target.prepend(touchEl);
            } else {
                const divId = e.target.parentElement.parentElement.id;
                UpdateDrop(dragDateId, divId);

                target.querySelector("ul").appendChild(touchEl);
            }
        }
    });
    drag = null;
    dragDateId = null;
    oldPos = null;
    this.removeAttribute("style");
    this.classList.remove("drag-item--touchmove");
    clearTimeout(scrollDelay);
    x = 1;
}

AddButtons.forEach((AddButton) => {
    AddButton.addEventListener("click", (event) => {
        const parentDivBtn = event.target.parentElement;
        const id = new Date().getTime();
        // console.log;
        const taskElement = {
            id: id,
            task: " ",
        };

        createELementsAndAppend(
            parentDivBtn.querySelector("ul"),
            taskElement,
            true
        );
        console.log(typeof parentDivBtn.id);
        dataToLocalStorage[parentDivBtn.id].push(taskElement);
        console.log(dataToLocalStorage);
        save(dataToLocalStorage);
    });
});
// Local Storage
function read() {
    // console.log(localStorage);
    let json = localStorage.getItem("KanbanData");
    // console.log(json, "JSON READ");
    if (!json)
        return {
            not_started: [],
            progress: [],
            completed: [],
        };
    return JSON.parse(json);
}

// function CheckEmpty(d){
//     d.forEach
// }

function save(data) {
    dataToLocalStorage = data;
    console.log(data);
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
    console.log(oldPos, "OLD", newPos);
    console.log(data[newPos], "ERROR");

    data[newPos].push(item);
    save(data);
}

////////////////////////////////////////
function UpdateItem(datadate, newUpdate) {
    const data = read();
    let item;
    for (let cul in data) {
        item = data[cul].find((item) => item.id == datadate);
        console.log("FORLOOP", item);
        if (item) break;
    }
    console.log(item);
    if (!item) return;

    console.log("NEWUPDATE", newUpdate);
    item.task = newUpdate;
    save(data);
}

function RenderFromLocalStorage(data) {
    for (const stateClass in data) {
        const cul = document.getElementById(stateClass);
        console.log(stateClass);
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
