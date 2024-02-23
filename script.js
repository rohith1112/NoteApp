document.addEventListener("DOMContentLoaded", function () {
    const newNoteButton = document.getElementById("new-note-btn");
  const noteTitleInput = document.querySelector("#note-add-edit-form input[name='note-title']");
  const noteContentTextarea = document.querySelector("#note-add-edit-form textarea[name='note-content']");

  // Event listener for the "Add New Note" button
  newNoteButton.addEventListener("click", function () {
    // Clear the input fields in the note editor section
    noteTitleInput.value = "";
    noteContentTextarea.value = "";
  });
    function createCategoryItem(categoryTitle) {
    const categoryItem = document.createElement("div");
    categoryItem.classList.add("category-item");
    categoryItem.innerHTML = `
      <label class="custom-radio">
        <input type="radio" name="category" />
        <span>${categoryTitle}</span>
      </label>
      <button class="icon-button delete-category-btn" title="Delete Category">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M6 3V21"></path>
        </svg>
      </button>
    `;

    // Event listener for category selection
    const radioInput = categoryItem.querySelector("input[type='radio']");
    radioInput.addEventListener("change", function () {
      displayNotes(categoryTitle);
    });

    // Event listener for deleting a category
    const deleteButton = categoryItem.querySelector(".delete-category-btn");
    deleteButton.addEventListener("click", function () {
      deleteCategory(categoryTitle);
      categoriesList.removeChild(categoryItem);
      clearNotes(); // Clear notes when deleting a category
    });

    categoriesList.appendChild(categoryItem);
  }

  // Function to delete a category from local storage
  function deleteCategory(categoryTitle) {
    localStorage.removeItem(`notes_${categoryTitle}`);
    saveCategories(); // Save updated categories to local storage
  }

    const showAllNotesButton = document.getElementById("show-all-notes");

  // Event listener for showing all notes
  showAllNotesButton.addEventListener("click", function () {
    const allNotes = getAllNotes();
    displayAllNotes(allNotes);
  });

  // Function to get all notes from local storage
  function getAllNotes() {
    const allNotes = [];
    const categoryTitles = Array.from(categoriesList.querySelectorAll("input[type='radio']"))
      .map((radioInput) => radioInput.nextElementSibling.textContent);

    categoryTitles.forEach((categoryTitle) => {
      const notes = getNotes(categoryTitle);
      allNotes.push(...notes);
    });

    return allNotes;
  }

  // Function to display all notes
  function displayAllNotes(allNotes) {
    notesList.innerHTML = ""; // Clear the current notes

    allNotes.forEach((note) => {
      const noteItem = document.createElement("div");
      noteItem.classList.add("note-item");
      noteItem.innerHTML = `
        <div class="note-item__title">${note.title}</div>
        <div class="note-item__content">${note.content}</div>
      `;
      notesList.appendChild(noteItem);
    });
  }
  const addCategoryForm = document.getElementById("add-category-form");
  const categoriesList = document.getElementById("categories-list");
  const notesList = document.getElementById("notes-list");
  const noteAddEditForm = document.getElementById("note-add-edit-form");

  // Load categories from local storage
  const savedCategories = JSON.parse(localStorage.getItem("categories")) || [];
  savedCategories.forEach((categoryTitle) => {
    createCategoryItem(categoryTitle);
  });

  // Event listener for adding a new category
  addCategoryForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const categoryTitleInput = addCategoryForm.querySelector("input[type='text']");
    const categoryTitle = categoryTitleInput.value.trim();

    if (categoryTitle !== "") {
      createCategoryItem(categoryTitle);
      // Save updated categories to local storage
      saveCategories();
      categoryTitleInput.value = "";
    }
  });

  // Event listener for submitting the note add/edit form
  noteAddEditForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const noteTitleInput = noteAddEditForm.querySelector("input[name='note-title']");
    const noteContentTextarea = noteAddEditForm.querySelector("textarea[name='note-content']");
    const noteTitle = noteTitleInput.value.trim();
    const noteContent = noteContentTextarea.value.trim();

    if (noteTitle !== "" && noteContent !== "") {
      const selectedCategory = getSelectedCategory();
      if (selectedCategory) {
        // Create a new note item
        const noteItem = document.createElement("div");
        noteItem.classList.add("note-item");
        noteItem.innerHTML = `
          <div class="note-item__title">${noteTitle}</div>
          <div class="note-item__content">${noteContent}</div>
        `;

        // Append the note item to the notes list
        notesList.appendChild(noteItem);

        // Save the note to local storage under the selected category
        saveNote(selectedCategory, { title: noteTitle, content: noteContent });

        // Clear the input fields
        noteTitleInput.value = "";
        noteContentTextarea.value = "";
      } else {
        alert("Please select a category before adding a note.");
      }
    }
  });

  // Event listener for category selection
  categoriesList.addEventListener("change", function () {
    const selectedCategory = getSelectedCategory();
    displayNotes(selectedCategory);
  });

  // Function to display notes based on selected category
  function displayNotes(categoryTitle) {
    notesList.innerHTML = ""; // Clear the current notes
    const notes = getNotes(categoryTitle);
    if (notes) {
      notes.forEach((note) => {
        const noteItem = document.createElement("div");
        noteItem.classList.add("note-item");
        noteItem.innerHTML = `
          <div class="note-item__title">${note.title}</div>
          <div class="note-item__content">${note.content}</div>
        `;
        notesList.appendChild(noteItem);
      });
    }
  }

  // Function to save categories to local storage
  function saveCategories() {
    const categoryTitles = Array.from(categoriesList.querySelectorAll("input[type='radio']"))
      .map((radioInput) => radioInput.nextElementSibling.textContent);
    localStorage.setItem("categories", JSON.stringify(categoryTitles));
  }

  // Function to create a category item and append it to the categories list
  function createCategoryItem(categoryTitle) {
    const categoryItem = document.createElement("div");
    categoryItem.classList.add("category-item");
    categoryItem.innerHTML = `
      <label class="custom-radio">
        <input type="radio" name="category" />
        <span>${categoryTitle}</span>
      </label>
      <button class="icon-button" title="Delete Category">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M6 3V21"></path>
        </svg>
      </button>
    `;

    // Event listener for category selection
    const radioInput = categoryItem.querySelector("input[type='radio']");
    radioInput.addEventListener("change", function () {
      displayNotes(categoryTitle);
    });

    // Event listener for deleting a category
    const deleteButton = categoryItem.querySelector(".icon-button");
    deleteButton.addEventListener("click", function () {
      categoriesList.removeChild(categoryItem);
      // Remove the category from local storage
      removeCategory(categoryTitle);
      // Clear notes when deleting a category
      clearNotes();
    });

    categoriesList.appendChild(categoryItem);
  }

  // Function to save a note to local storage under a specific category
  function saveNote(categoryTitle, note) {
    const savedNotes = getNotes(categoryTitle) || [];
    savedNotes.push(note);
    localStorage.setItem(`notes_${categoryTitle}`, JSON.stringify(savedNotes));
  }

  // Function to get notes for a specific category from local storage
  function getNotes(categoryTitle) {
    return JSON.parse(localStorage.getItem(`notes_${categoryTitle}`)) || [];
  }

  // Function to remove a category from local storage
  function removeCategory(categoryTitle) {
    localStorage.removeItem(`notes_${categoryTitle}`);
  }

  // Function to get the selected category
  function getSelectedCategory() {
    const selectedRadio = categoriesList.querySelector("input[type='radio']:checked");
    return selectedRadio ? selectedRadio.nextElementSibling.textContent : null;
  }

  // Function to clear the notes list
  function clearNotes() {
    notesList.innerHTML = "";
  }
});