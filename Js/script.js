const AddButtons = document.querySelectorAll(".add");
const parenDivs = document.querySelectorAll(".container-boxez div");
let drag;
let scrollDelay = 0;
let scrollDirection = 1;
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

    childDiv.addEventListener(
        "drop",
        () => {
            childDiv.querySelector("ul").append(drag);

            console.log("even");
        },
        false
    );
});
AddButtons.forEach((AddButton) => {
    AddButton.addEventListener("click", (event) => {
        const closestUl = event.target.parentElement.querySelector("ul");
        const li = document.createElement("li");
        const p = document.createElement("p");
        const editIcon = document.createElement("i");
        const trashIcon = document.createElement("i");
        const span = document.createElement("span");
        trashIcon.classList.add("fa-solid", "fa-trash-can");
        editIcon.classList.add("fa-solid", "fa-pen-to-square");
        span.appendChild(editIcon);
        span.appendChild(trashIcon);
        closestUl.appendChild(li);
        li.appendChild(p);
        li.appendChild(span);
        li.draggable = true;
        p.contentEditable = true;

        // li Events Listener
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
            event.target.contentEditable = false;
        });

        p.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.target.contentEditable = false;
            }
        });

        p.focus();
        // Edit icon and tarsh evetns
        trashIcon.addEventListener("click", (event) => {
            event.target.parentElement.parentElement.remove();
        });
        editIcon.addEventListener("click", (event) => {
            const pEdit = event.target.parentElement.previousElementSibling;
            if (pEdit.contentEditable === "true") {
                pEdit.contentEditable = false;
                console.log("k");
            } else {
                pEdit.contentEditable = true;
                p.focus();
            }
        });

        trashIcon.addEventListener("touchstart", (event) => {
            event.preventDefault();
            event.target.parentElement.parentElement.remove();
        });
        editIcon.addEventListener("touchstart", (event) => {
            event.preventDefault();

            const pEdit = event.target.parentElement.previousElementSibling;
            if (pEdit.contentEditable === "true") {
                pEdit.contentEditable = false;
            } else {
                pEdit.contentEditable = true;
                p.focus();
            }
        });
        li.addEventListener(
            "dragstart",
            (event) => {
                drag = event.target;
                li.style.opacity = "0.5";
            },
            false
        );

        li.addEventListener("dragend", (event) => {
            drag = null;
            console.log(event.target);
            li.style.opacity = "1";
        });
        li.addEventListener(
            "touchstart",
            (event) => {
                event.preventDefault();
                drag = event.target;
                li.style.opacity = "0.5";
                li.classList.add("drag-item--touchmove");

                console.log("drag start");
            },
            false
        );

        li.addEventListener("touchmove", touchMove, false);
        li.addEventListener("touchend", touchEnd, false);
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
            console.log("else1");
            if (touchEl.classList.contains("drag-item--prepend")) {
                target.prepend(touchEl);
            } else {
                console.log("else2");

                target.querySelector("ul").appendChild(touchEl);
            }
        }
    });

    this.removeAttribute("style");
    this.classList.remove("drag-item--touchmove");
    clearTimeout(scrollDelay);
    x = 1;
}
