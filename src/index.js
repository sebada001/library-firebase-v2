import "./style.css";
import { initializeApp } from "firebase/app";
import { getFirestore, getDoc, setDoc, doc } from "firebase/firestore/lite";
const firebaseConfig = {
  apiKey: "AIzaSyDLJ_Tcz9g9QdnnsI9_LEHSCh6tIuyfHAY",
  authDomain: "library-firebase-v2.firebaseapp.com",
  projectId: "library-firebase-v2",
  storageBucket: "library-firebase-v2.appspot.com",
  messagingSenderId: "513044541688",
  appId: "1:513044541688:web:5b867ec57d1386c4930b0d",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const container = document.querySelector("#container");
const addButton = document.querySelector(".add-book");
const modal = document.querySelector(".modal");
const shade = document.querySelector(".shade");
const author = document.querySelector("#author");
const title = document.querySelector("#title");
const pages = document.querySelector("#pages");
const read = document.querySelector("#read");
const ok = document.querySelector("#ok");
const print = document.querySelector("#print");
const update = document.querySelector("#update");
const local = document.querySelector("#local");
const printLocal = document.querySelector("#print-local");

let myLibrary = [];

function printLocalLibrary() {
  console.log(myLibrary);
}
async function updateLocal() {
  const myNewLib = await printData();
  myLibrary = myNewLib;
  reset();
  renderBooks();
}
function myLibraryObject() {
  let object = { myLibArray: myLibrary };
  return object;
}
async function setLibrary() {
  const myLibTest = myLibraryObject();
  try {
    await setDoc(doc(db, "library", "publicLibrary"), myLibTest);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
async function printData() {
  const querySnapshot = await getDoc(doc(db, "library", "publicLibrary"));
  console.log(querySnapshot.data().myLibArray);
  return querySnapshot.data().myLibArray;
}
print.addEventListener("click", printData);
update.addEventListener("click", setLibrary);
local.addEventListener("click", updateLocal);
printLocal.addEventListener("click", printLocalLibrary);
ok.addEventListener("click", () => {
  if (allFields()) {
    showHide(modal, shade);
    createBook();
    reset();
  }
});
addButton.addEventListener("click", () => {
  showHide(modal, shade);
});
function reset() {
  author.value = "";
  title.value = "";
  pages.value = "";
  read.value = "";
}
function showHide(...els) {
  els.forEach(
    (el) => (el.style.display = el.style.display === "flex" ? "none" : "flex")
  );
}
function createBook() {
  let book = BookFactory(author.value, title.value, pages.value, read.value);
  myLibrary.push(book);
  renderBooks();
}
function renderBooks() {
  deleteChildren(container);
  myLibrary.forEach((book, index) => {
    let cont = document.createElement("div");
    cont.classList.add("book-item");
    cont.id = index;
    cont.append(
      bookCreator("author", book.author),
      bookCreator("title", book.title),
      bookCreator("pages", book.pages),
      bookCreator("read", book.read)
    );
    let deleteBtn = document.createElement("button");
    deleteBtn.addEventListener("click", deleteBook);
    cont.appendChild(deleteBtn);
    container.appendChild(cont);
  });
}
function bookCreator(name, val) {
  let child1 = document.createElement("div");
  child1.textContent = `${name}:`;
  let child2 = document.createElement("div");
  child2.textContent = `${val}`;
  let elem = document.createElement("div");
  elem.append(child1, child2);
  return elem;
}
const BookFactory = (auth, tit, pag, rea) => {
  let author = auth;
  let title = tit;
  let pages = pag;
  let read = rea;
  return {
    author,
    title,
    pages,
    read,
  };
};
function deleteChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
function allFields() {
  return author.value != "" &&
    title.value != "" &&
    pages.value != "" &&
    read.value != ""
    ? true
    : false;
}
function deleteBook(e) {
  myLibrary.splice(e.target.parentElement.id, 1);
  renderBooks();
}
