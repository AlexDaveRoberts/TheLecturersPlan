/* Dashboard JS */

// Handles for all main sections to be used often
const titleHeader = document.getElementById('titleHeader');
const itemsHeaderLeft = document.getElementById('itemsHeaderLeft');
const itemsHeaderRight = document.getElementById('itemsHeaderRight');
const weeksMain = document.getElementById('weeksMain');
const items = document.getElementById('items');
const weeks = document.getElementsByClassName('weeks');

// Handles for all small elements to be used often
const search = document.getElementById('search');
const addWeek = document.getElementById('addWeek');
const newItemMenu = document.getElementById('newItemMenu');
const itemMenu = document.getElementById('itemMenu');
const newTopic = document.getElementById('newTopic');
const newNote = document.getElementById('newNote');
const newResource = document.getElementById('newResource');
const addLecturer = document.getElementById('addLecturer');
const addRoom = document.getElementById('addRoom');
const units = document.getElementById('units');
const newUnit = document.getElementById('newUnit');
const addNewUnit = document.getElementById('addUnit');

// Handles for all sidebar elements
const menu = document.getElementById('menu');
const sidebar = document.getElementById('sidebar');
const home = document.getElementById('home');
const allUnits = document.getElementById('allUnits');
const allTopics = document.getElementById('allTopics');
const allNotes = document.getElementById('allNotes');
const allResources = document.getElementById('allResources');
const allLecturers = document.getElementById('allLecturers');
const allRooms = document.getElementById('allRooms');
const help = document.getElementById('help');

// Retrieves the current logged in user and unit
const userLoggedIn = localStorage.getItem('user');
let retrieveUnit = localStorage.getItem('currentUnit');

// Path handle, used with paging
let path = window.location.pathname;

// Arrays to store the current Weeks and Items for the Unit
let weeksArray = [];
let topicsArray = [];
let notesArray = [];
let resourcesArray = [];
let lecturersArray = [];
let roomsArray = [];

/* Event listeners */

/* Accessibility Keyboard Shortcuts */

function keyboardShortcuts(event) {
  // Ctrl F to focus on search
  if (event.ctrlKey && event.keyCode == 70) {
    search.focus();
  }

  // Ctrl D to reload / redirect back to Dashboard
  if (event.ctrlKey && event.keyCode == 68) {
    if (path == '/dashboard') {
      window.location.reload(true);
    } else {
      window.location.href = '../';
    }
  }

  // Ctrl M to toggle the Sidebar
  if (event.ctrlKey && event.keyCode == 77) {
    sidebarToggle();
  }

  // Ctrl U to load the Units page
  if (event.ctrlKey && event.keyCode == 85) {
    menuPaths('units');
  }

  // Ctrl H to load the Help page
  if (event.ctrlKey && event.keyCode == 72) {
    menuPaths('help');
  }

  // Ctrl W to add a new week
  if (event.ctrlKey && event.keyCode == 87) {
    createNewWeek();
  }

  // Ctrl I to toggle the item menu
  if (event.ctrlKey && event.keyCode == 73) {
    newItemMenuToggle();
  }

  // Ctrl L to logout of the application
  if (event.ctrlKey && event.keyCode == 76) {
    localStorage.removeItem('login');
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('currentUnit');
    window.location.replace('../');
  }
}

document.addEventListener('keyup', keyboardShortcuts);

// Main Elements
titleHeader.addEventListener('click', function() {
  sidebarRemove();
  newItemMenuHide();
});

itemsHeaderLeft.addEventListener('click', function(event) {
  sidebarRemove();
  if (event.target.id == 'itemsHeaderLeft' || event.target.id == 'currentUnit') {
    newItemMenuHide();
  }
});

itemsHeaderRight.addEventListener('click', function(event) {
  sidebarRemove();
  newItemMenuHide();
});

weeksMain.addEventListener('click', function() {
  sidebarRemove();
  newItemMenuHide();
});

items.addEventListener('click', function() {
  sidebarRemove();
  newItemMenuHide();
});

// Menu
menu.addEventListener('click', function() {
  sidebarToggle();
  newItemMenuHide();
});

// Sidebar
function menuPaths(pathLink) {
  if (path == '/') {
    window.location.href = pathLink;
  } else {
    window.location.href = '../' + pathLink;
  }
}

home.addEventListener('click', reload);

allUnits.addEventListener('click', function() {
  menuPaths('units');
});

allTopics.addEventListener('click', function() {
  menuPaths('topics');
});

allNotes.addEventListener('click', function() {
  menuPaths('notes');
});

allResources.addEventListener('click', function() {
  menuPaths('resources');
});

allLecturers.addEventListener('click', function() {
  menuPaths('lecturers');
});

allRooms.addEventListener('click', function() {
  menuPaths('rooms');
});

help.addEventListener('click', function() {
  menuPaths('help');
});

// Logo and search
logo.addEventListener('click', reload);
search.addEventListener('keyup', searchItems);

// Add new week
addWeek.addEventListener('click', function() {
  createNewWeek();
});

// Item Menu
newItemMenu.addEventListener('click', newItemMenuToggle);
const newItemList = itemMenu.querySelectorAll('p');
for (let item of newItemList) {
  item.addEventListener('click', newItemMenuHide);
}
newTopic.addEventListener('click', createNewTopic);
newNote.addEventListener('click', createNewNote);
newResource.addEventListener('click', createNewResource);
addLecturer.addEventListener('click', createNewLecturer);
addRoom.addEventListener('click', createNewRoom);

// Main window event listener to begin loading the page
window.addEventListener('DOMContentLoaded', function() {
  // Welcome the current user logged in
  currentUser.textContent = 'Welcome ' + userLoggedIn;

  // Call to loadUnit to load the currentunit for the logged in user
  loadUnit();

  // Checks if itemMenu has been clicked, set by a redirect from other pages
  let itemMenuActive = localStorage.getItem('itemMenu');
  if (itemMenuActive) {
    // Shows the itemMenu only on the main dashboard
    itemMenu.classList.toggle('itemMenuExpanded');
    localStorage.removeItem('itemMenu');
  }

  // Detects a logout by the user
  logout.addEventListener('click', function() {
    // Removes all localStorage content, so the user is fully logged out
    localStorage.removeItem('login');
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('currentUnit');
    // Redirect user back to landing page
    window.location.replace('../');
  });
});

// Loads the selected unit for the current logged in user
async function loadUnit() {
  const url = '/api/units?user=' + encodeURIComponent(userLoggedIn);

  const response = await fetch(url);
  if (response.ok) {
    let data = await response.json();

    if (!retrieveUnit) {
      let unitName = data[0].unitName;
      let dateAdded = data[0].dateAdded;
      localStorage.setItem('currentUnit', unitName);
      localStorage.setItem('unitCreated', dateAdded);
      retrieveUnit = localStorage.getItem('currentUnit');
    }

    let currentUnit = document.getElementById('currentUnit');
    currentUnit.innerHTML += retrieveUnit;

  } else {
    console.error('Error retrieving the unit', response.status, response.statusText);
  }

  // Call to loadWeeks to load the weeks for the unit currently selected
  loadWeeks();
}

// Adds week to the unit from database
function addNewWeek(weekID, weekName, weekLocation) {
  // Creates element, adds id & class
  let newWeek = document.createElement('section');
  newWeek.id = weekID;
  let newWeekID = weekName.match(/\d+$/)[0];
  let text = 'weeks ' + newWeekID;
  newWeek.className += text;

  // Creates week heading
  let weekHeading = document.createElement('h3');
  weekHeading.textContent = 'Week ' + newWeekID;
  weekHeading.className = 'heading';
  newWeek.appendChild(weekHeading);

  // Appends week to weeksMain
  weeksMain.appendChild(newWeek);

  // Adds listeners for drag/drop, and week expand/collapse
  newWeek.addEventListener('dragover', allowDrop);
  newWeek.addEventListener('drop', dropItem);
  newWeek.addEventListener('click', weekToggle);

  // Adds week to array
  weeksArray.push(newWeek);
}

// Creates new week to unit from interface
function createNewWeek() {
  let newWeek = document.createElement('section');

  // ID Naming Algorithm
  if (weeksArray.length == 0) {
    // Default ID for first week
    var newWeekName = 1;
    newWeek.id = 'week'+101;
    var newWeekID = newWeek.id;
  } else {
    // If 1 or more weeks exist, find last id, increment by 1 for new id
    for (let week of weeksArray) {
      let classSplit = week.className.split(' ');
      newWeekName = classSplit[1];
      var id = week.id.match(/\d+$/)[0];
    }
    newWeekName++;
    id++;
    newWeek.id = 'week'+id;
    newWeekID = newWeek.id;
  }
  // Sets class for styling
  let newClass = 'weeks ' + newWeekName;
  newWeek.className += newClass;

  // Creates week heading
  let weekHeading = document.createElement('h3');
  weekHeading.textContent = 'Week ' + newWeekName;
  weekHeading.className = 'heading';
  newWeek.appendChild(weekHeading);

  // Appends week to weeksMain
  weeksMain.appendChild(newWeek);

  // Adds listeners for drag/drop, and week expand/collapse
  newWeek.addEventListener('dragover', allowDrop);
  newWeek.addEventListener('drop', dropItem);
  newWeek.addEventListener('click', weekToggle);

  // Adds new week to the db, with id, name, location as parameters
  addWeekDB(newWeek.id, 'week' + newWeekName, 'pos' + newWeekID);

  // Adds week to array
  weeksArray.push(newWeek);
}

// Expands and collapses a week to show and hide items
function weekToggle(event) {
  if (event.target.classList.contains('weeks') || event.target.classList.contains('heading')) {
    event.currentTarget.classList.toggle('weeksCollapsed');
  }
}

// Load weeks for the current unit
async function loadWeeks() {
  // Used with Registration to fetch how many weeks the new user selected
  const url = '/api/numberOfWeeks?unit=' + encodeURIComponent(retrieveUnit);
  const response = await fetch(url);
  if (response.ok) {
    let data = await response.json();

    // Load all weeks from database
    const url2 = '/api/weeks?unit=' + encodeURIComponent(retrieveUnit);
    const response2 = await fetch(url2);
    if (response2.ok) {
      let data2 = await response2.json();
      let currentRows = 0;
        for (let key in data2) {
          // Calls addNewWeek to add weeks from database to interface
          addNewWeek(data2[key].weekID, data2[key].weekName, data2[key].weekLocation);
          currentRows++;
        }
        // Checks URL path, to load items based on page selected
        if (path.includes('dashboard')) {
          loadItems();
        } else if (path.includes('topics')){
          loadTopics();
        } else if (path.includes('notes')){
          loadNotes();
        } else if (path.includes('resources')){
          loadResources();
        } else if (path.includes('lecturers')){
          loadLecturers();
        } else if (path.includes('rooms')){
          loadRooms();
        }

        // While loop to add the number of weeks, the new registered user requires
        while (currentRows < data) {
          createNewWeek();
          currentRows++;
        }

    } else {
      console.error('Error getting the weeks', response2.status, response2.statusText);
    }
  }
}

// Adds a new week to the unit's week table in the database
async function addWeekDB(weekID, weekName, weekLocation) {
  const url = '/api/addWeek?unit=' + encodeURIComponent(retrieveUnit) + '&weekID=' + encodeURIComponent(weekID) + '&weekName=' + weekName + '&weekLocation=' + encodeURIComponent(weekLocation);
  const response = await fetch(url, { method: 'POST' });
}

// Loads the items for the unit into the main dashboard
async function loadItems() {
  const url = '/api/items?unit=' + encodeURIComponent(retrieveUnit);

  const response = await fetch(url);
  if (response.ok) {
    let data = await response.json();
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        // Calls the respective add item function based on itemID
        if (data[key].itemID.includes('topic')) {
          addNewTopic(data[key].itemID, data[key].itemContent, data[key].itemLocation);
        } else if (data[key].itemID.includes('note')) {
          addNewNote(data[key].itemID, data[key].itemContent, data[key].itemLocation);
        } else if (data[key].itemID.includes('resrc')) {
          addNewResource(data[key].itemID, data[key].itemLocation);
        } else if (data[key].itemID.includes('lectr')) {
          addNewLecturer(data[key].itemID, data[key].itemContent, data[key].itemLocation);
        } else if (data[key].itemID.includes('room')) {
          addNewRoom(data[key].itemID, data[key].itemContent, data[key].itemLocation);
        }
      }
    }
  } else {
    console.error('Error getting the items', response.status, response.statusText);
  }
}

// Loads topic items into All Topics page
async function loadTopics() {
  const url = '/api/items?unit=' + encodeURIComponent(retrieveUnit);

  const response = await fetch(url);
  if (response.ok) {
    let data = await response.json();
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key].itemID.includes('topic')) {
          addNewTopic(data[key].itemID, data[key].itemContent, data[key].itemLocation);
        }
      }
    }
  } else {
    console.error('Error getting the topics', response.status, response.statusText);
  }
}

// Loads note items into All Notes page
async function loadNotes() {
  const url = '/api/items?unit=' + encodeURIComponent(retrieveUnit);

  const response = await fetch(url);
  if (response.ok) {
    let data = await response.json();
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key].itemID.includes('note')) {
          addNewNote(data[key].itemID, data[key].itemContent, data[key].itemLocation);
        }
      }
    }
  } else {
    console.error('Error getting the notes', response.status, response.statusText);
  }
}

// Loads resource items into All Resources page
async function loadResources() {
  const url = '/api/items?unit=' + encodeURIComponent(retrieveUnit);

  const response = await fetch(url);
  if (response.ok) {
    let data = await response.json();
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key].itemID.includes('resrc')) {
          addNewResource(data[key].itemID, data[key].itemLocation);
        }
      }
    }
  } else {
    console.error('Error getting the notes', response.status, response.statusText);
  }
}

// Loads lecturer items into All Lecturers page
async function loadLecturers() {
  const url = '/api/items?unit=' + encodeURIComponent(retrieveUnit);

  const response = await fetch(url);
  if (response.ok) {
    let data = await response.json();
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key].itemID.includes('lectr')) {
          addNewLecturer(data[key].itemID, data[key].itemContent, data[key].itemLocation);
        }
      }
    }
  } else {
    console.error('Error getting the notes', response.status, response.statusText);
  }
}

// Loads room items into All Rooms page
async function loadRooms() {
  const url = '/api/items?unit=' + encodeURIComponent(retrieveUnit);

  const response = await fetch(url);
  if (response.ok) {
    let data = await response.json();
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key].itemID.includes('room')) {
          addNewRoom(data[key].itemID, data[key].itemContent, data[key].itemLocation);
        }
      }
    }
  } else {
    console.error('Error getting the notes', response.status, response.statusText);
  }
}

// Loads files meta data for the unit from database
async function loadFiles(itemID, uploadForm) {
  const url = '/api/loadFiles?unit=' + encodeURIComponent(retrieveUnit) + '&itemID=' + encodeURIComponent(itemID);

  const response = await fetch(url);
  if (response.ok) {
  let data = await response.json();
    for (let key in data.file) {
      if (data.file.hasOwnProperty(key)) {
        // Restyle form from file upload, to a link to the uploaded file
        let form = document.getElementById(uploadForm);
        form.className = 'uploadedFile';
        form.innerHTML = 'Uploaded file: <a href="/upload/' + data.file[key].fileName + '"> ' + data.file[key].fileName + '</a>';
      }
    }
    // If no file meta data found for resource, delete item
    if (data.file == 'none') {
      let item = document.getElementById('itemID');
      deleteItem(itemID);
      deleteFile(itemID);
    }
  } else {
    console.error('Error loading uploaded files', response.status, response.statusText);
  }
}

// Delete a file from a unit
async function deleteFile(itemID) {
  const url = '/api/deleteFile?unit=' + encodeURIComponent(retrieveUnit) + '&itemID=' + encodeURIComponent(itemID);
  const response = await fetch(url, { method: 'DELETE' });
}

// Adds a new item to the database
async function addNewItem(itemID, itemContent, itemLocation) {
  const url = '/api/addItem?unit=' + encodeURIComponent(retrieveUnit) + '&itemID=' + encodeURIComponent(itemID) + '&itemContent=' + encodeURIComponent(itemContent) + '&itemLocation=' + encodeURIComponent(itemLocation);
  const response = await fetch(url, { method: 'POST' });
}

// Updates an item's text content
async function updateItem(itemID, itemContent) {
  const url = '/api/updateItem?unit=' + encodeURIComponent(retrieveUnit) + '&itemID=' + encodeURIComponent(itemID) + '&itemContent=' + encodeURIComponent(itemContent);
  const response = await fetch(url, { method: 'POST' });
}

// Delete an item from a unit
async function deleteItem(itemID) {
  const url = '/api/deleteItem?unit=' + encodeURIComponent(retrieveUnit) + '&itemID=' + encodeURIComponent(itemID);
  const response = await fetch(url, { method: 'DELETE' });
}

// Allows a drop to be made on an element
function allowDrop(event) {
  event.preventDefault();
}

// Used to transfer the data for an item to a drop target
function dragItem(event) {
  event.dataTransfer.setData('html', event.target.id);
}

// Handles an item drop on a target
function dropItem(event) {
  // Retrieves item data and appends it to the drop target
  let item = event.dataTransfer.getData('html');
  event.currentTarget.appendChild(document.getElementById(item));
  let idDrop = document.getElementById(item).id;
  if (idDrop.includes('resrc')) {
    var contentDrop = 'N/A';
  } else {
    // Retrieve text content of item
    contentDrop = document.getElementById(item).querySelector('p.itemText').innerHTML;
  }
  // Retrieve new location of item
  let locationDrop = event.currentTarget.id;
  // Updates item in database with new location
  addNewItem(idDrop, contentDrop, locationDrop);
}

// Show / hide sidebar
function sidebarToggle() {
  sidebar.classList.toggle('sidebarExpanded');
}

// Hide sidebar
function sidebarRemove() {
  sidebar.classList.remove('sidebarExpanded');
}

// Reload / redirect page to dashboard
function reload() {
  if (path == '/dashboard/') {
    window.location.reload(true);
  } else {
    window.location.href = '../';
  }
}

// New Item Menu Toggle
function newItemMenuToggle() {
  // If the user is not on the dashboard, redirect them
  if (path != '/dashboard/') {
    localStorage.setItem('itemMenu', 'true');
    window.location.href = '../';
  }
  // Toggle the item menu
  itemMenu.classList.toggle('itemMenuExpanded');
  // Change arrow icon based on expanded / collapsed menu
  if (newItemMenu.innerHTML === 'New Item <svg class="svg-inline--fa fa-angle-down fa-w-10" aria-hidden="true" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""><path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"></path></svg><!-- <i class="fas fa-angle-down"></i> -->') {
    newItemMenu.innerHTML = 'New Item <svg class="svg-inline--fa fa-angle-up fa-w-10" aria-hidden="true" data-prefix="fas" data-icon="angle-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""><path fill="currentColor" d="M177 159.7l136 136c9.4 9.4 9.4 24.6 0 33.9l-22.6 22.6c-9.4 9.4-24.6 9.4-33.9 0L160 255.9l-96.4 96.4c-9.4 9.4-24.6 9.4-33.9 0L7 329.7c-9.4-9.4-9.4-24.6 0-33.9l136-136c9.4-9.5 24.6-9.5 34-.1z"></path></svg><!-- <i class="fas fa-angle-up"></i> -->';
  } else {
    newItemMenu.innerHTML = 'New Item <svg class="svg-inline--fa fa-angle-down fa-w-10" aria-hidden="true" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""><path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"></path></svg><!-- <i class="fas fa-angle-down"></i> -->';
  }
}

// If user clicks outside itemMenu, hide the menu, and reset to default arrow
function newItemMenuHide() {
  itemMenu.classList.remove('itemMenuExpanded');
  newItemMenu.innerHTML = 'New Item <svg class="svg-inline--fa fa-angle-down fa-w-10" aria-hidden="true" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""><path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"></path></svg><!-- <i class="fas fa-angle-down"></i> -->';
}

// Text Content Events
function textEventItems(newItem, itemID, textField) {
  // If item leaves focus with no content, delete item
  newItem.addEventListener('focusout', function() {
    if(textField.textContent == '') {
      deleteItem(itemID);
      delete newItem;
      newItem.outerHTML = '';
    }
  });

  // Saves text content to database on keyup event, if empty delete item
  newItem.addEventListener('keyup', function() {
    if (textField.textContent.length == 0) {
      deleteItem(itemID);
    } else {
      updateItem(itemID, textField.innerHTML);
    }
  });

  // Adds a new line as HTML on enter key, used for reloading new lines from db
  textField.addEventListener('keypress', function(event) {
    if (event.keyCode == 13) {
      let linkBreak = document.createElement('br');
      textField.appendChild(lineBreak);
    }
  });

  // If item is clicked, focus text field
  newItem.addEventListener('click', function() {
    textField.focus();
  });
}

// Drag and Delete Events
function eventItems(newItem, itemID, deleteNewItem) {
  // On start of drag item, change styling, and call dragItem
  newItem.addEventListener('dragstart', function() {
    this.style.borderBottomLeftRadius = '0em';
    this.style.borderTopLeftRadius = '0em';
    dragItem(event);
  });

  // On end of drag item, change styling back
  newItem.addEventListener('dragend', function() {
    this.style.borderTopLeftRadius = '0.75em';
    this.style.borderBottomLeftRadius = '0.75em';
  });

  // On user clicking delete on an item, call deleteItem
  deleteNewItem.addEventListener('click', function() {
    deleteItem(itemID);
    delete newItem;
    newItem.outerHTML = '';
    if (itemID.includes('resrc')) {
      deleteFile(itemID);
    }
  });
}

// Adds new topic item from db
function addNewTopic(itemID, itemContent, itemLocation) {
  // Creates main item section, adds id & classes
  let newTopicItem = document.createElement('section');
  newTopicItem.id = itemID;
  let topicID = newTopicItem.id;
  newTopicItem.className += 'newItem newTopicItem';
  newTopicItem.draggable = 'true';

  // Adds an item letter to the left border
  let topicLetter = document.createElement('span');
  topicLetter.textContent = 'T';
  topicLetter.className = 'topicLetter';
  newTopicItem.appendChild(topicLetter);

  // Adds a delete cross on the right side of the item
  let deleteTopic = document.createElement('span');
  deleteTopic.innerHTML = '<i class="fas fa-times"></i>';
  deleteTopic.className = 'itemDelete';
  newTopicItem.appendChild(deleteTopic);

  // Adds a text field to the item
  let topicText = document.createElement('p');
  topicText.className = 'itemText';
  topicText.contentEditable = 'true';
  newTopicItem.appendChild(topicText);

  // Imports content from db to item
  if (itemContent) {
    topicText.innerHTML = itemContent;
  }

  // Appends new item to location stored in db
  let location = document.getElementById(itemLocation);
  location.appendChild(newTopicItem);
  topicText.focus();

  // Calls the event listeners for the item
  textEventItems(newTopicItem, topicID, topicText);
  eventItems(newTopicItem, topicID, deleteTopic);

  // Adds new item to an array
  topicsArray.push(newTopicItem);
}

// Creates new topic item from interface
async function createNewTopic() {
  // Fetches latest itemID for the unit
  const url = '/api/latestItemID?unit=' + encodeURIComponent(retrieveUnit);

  const response = await fetch(url);
  if (response.ok) {
    let data = await response.json();
    var latestTopicID = data.latestTopicID;
  } else {
    console.error('Error getting the latest ItemID', response.status, response.statusText);
  }

  let newTopicItem = document.createElement('section');
  // Uses fetched id to determine the next itemID
  let idValue = latestTopicID.match(/\d+/)[0];
  if (idValue == 0) {
    // Default item id
    idValue = 101;
  } else {
    // Increment to the next item id
    idValue++;
  }
  // Sets id and classes for the item
  newTopicItem.id = 'topic'+idValue;
  let topicID = newTopicItem.id;
  newTopicItem.className += 'newItem newTopicItem';
  newTopicItem.draggable = 'true';

  // Adds an item letter to the left border
  let topicLetter = document.createElement('span');
  topicLetter.textContent = 'T';
  topicLetter.className = 'topicLetter';
  newTopicItem.appendChild(topicLetter);

  // Adds a delete cross on the right side of the item
  let deleteTopic = document.createElement('span');
  deleteTopic.innerHTML = '<i class="fas fa-times"></i>';
  deleteTopic.className = 'itemDelete';
  newTopicItem.appendChild(deleteTopic);

  // Adds a text field to the item
  let topicText = document.createElement('p');
  topicText.className = 'itemText';
  topicText.contentEditable = 'true';
  newTopicItem.appendChild(topicText);

  // Appends new item to default items section
  items.appendChild(newTopicItem);
  topicText.focus();

  // Sends the new item id, text content, and location to the db
  addNewItem(topicID, topicText.textContent, 'items');

  // Calls the event listeners for the item
  textEventItems(newTopicItem, topicID, topicText);
  eventItems(newTopicItem, topicID, deleteTopic);

  // Adds new item to an array
  topicsArray.push(newTopicItem);
}

// Adds new note item from db
function addNewNote(itemID, itemContent, itemLocation) {
  // Creates main item section, adds id & classes
  let newNoteItem = document.createElement('section');
  newNoteItem.id = itemID;
  let noteID = newNoteItem.id;
  newNoteItem.className += 'newItem newNoteItem';
  newNoteItem.draggable = 'true';

  // Adds an item letter to the left border
  let noteLetter = document.createElement('span');
  noteLetter.textContent = 'N';
  noteLetter.className = 'noteLetter';
  newNoteItem.appendChild(noteLetter);

  // Adds a delete cross on the right side of the item
  let deleteNote = document.createElement('span');
  deleteNote.innerHTML = '<i class="fas fa-times"></i>';
  deleteNote.className = 'itemDelete';
  newNoteItem.appendChild(deleteNote);

  // Adds a text field to the item
  let noteText = document.createElement('p');
  noteText.className = 'itemText';
  noteText.contentEditable = 'true';
  newNoteItem.appendChild(noteText);

  // Imports content from db to item
  if (itemContent) {
    noteText.innerHTML = itemContent;
  }

  // Appends new item to location stored in db
  let location = document.getElementById(itemLocation);
  location.appendChild(newNoteItem);
  noteText.focus();

  // Calls the event listeners for the item
  textEventItems(newNoteItem, noteID, noteText);
  eventItems(newNoteItem, noteID, deleteNote);

  // Adds new item to an array
  notesArray.push(newNoteItem);
}

// Creates new note item from interface
async function createNewNote() {
  // Fetches latest itemID for the unit
  const url = '/api/latestItemID?unit=' + encodeURIComponent(retrieveUnit);

  const response = await fetch(url);
  if (response.ok) {
    let data = await response.json();
    var latestNoteID = data.latestNoteID;
  } else {
    console.error('Error getting the latest ItemID', response.status, response.statusText);
  }

  let newNoteItem = document.createElement('section');
  // Uses fetched id to determine the next itemID
  let idValue = latestNoteID.match(/\d+/)[0];
  if (idValue == 0) {
    // Default item id
    idValue = 101;
  } else {
    // Increment to the next item id
    idValue++;
  }
  // Sets id and classes for the item
  newNoteItem.id = 'note'+idValue;
  let noteID = newNoteItem.id;
  newNoteItem.className += 'newItem newNoteItem';
  newNoteItem.draggable = 'true';

  // Adds an item letter to the left border
  let noteLetter = document.createElement('span');
  noteLetter.textContent = 'N';
  noteLetter.className = 'noteLetter';
  newNoteItem.appendChild(noteLetter);

  // Adds a delete cross on the right side of the item
  let deleteNote = document.createElement('span');
  deleteNote.innerHTML = '<i class="fas fa-times"></i>';
  deleteNote.className = 'itemDelete';
  newNoteItem.appendChild(deleteNote);

  // Adds a text field to the item
  let noteText = document.createElement('p');
  noteText.className = 'itemText';
  noteText.contentEditable = 'true';
  newNoteItem.appendChild(noteText);

  // Appends new item to default items section
  items.appendChild(newNoteItem);
  noteText.focus();

  // Sends the new item id, text content, and location to the db
  addNewItem(noteID, noteText.textContent, 'items');

  // Calls the event listeners for the item
  textEventItems(newNoteItem, noteID, noteText);
  eventItems(newNoteItem, noteID, deleteNote);

  // Adds new item to an array
  notesArray.push(newNoteItem);
}

// Adds new resource item from db
async function addNewResource(itemID, itemLocation) {
  const url = '/api/loadFiles?unit=' + encodeURIComponent(retrieveUnit) + '&itemID=' + encodeURIComponent(itemID);

  // Fetch request to loadFiles to check if a file has been uploaded
  const response = await fetch(url);
  if (response.ok) {
  let data = await response.json();
    // If no file found, delete the item
    if (data.file == 'none') {
      let item = document.getElementById('itemID');
      deleteItem(itemID);
      deleteFile(itemID);
      return;
    }
  } else {
    console.error('Error deleting empty resource', response.status, response.statusText);
  }

  // Creates main item section, adds id & classes
  let newResourceItem = document.createElement('section');
  newResourceItem.id = itemID;
  let resourceID = newResourceItem.id;
  newResourceItem.className += 'newItem newResourceItem';
  newResourceItem.draggable = 'true';

  // Adds an item letter to the left border
  let resourceLetter = document.createElement('span');
  resourceLetter.textContent = 'R';
  resourceLetter.className = 'resourceLetter';
  newResourceItem.appendChild(resourceLetter);

  // Adds a delete cross on the right side of the item
  let deleteResource = document.createElement('span');
  deleteResource.innerHTML = '<i class="fas fa-times"></i>';
  deleteResource.className = 'itemDelete';
  newResourceItem.appendChild(deleteResource);

  // Adds a form to the item to allow a user to upload a file
  let resourceForm = document.createElement('form');
  resourceForm.id = 'upload' + resourceID;
  resourceForm.method = 'post';
  resourceForm.action = '/api/upload?unit=' + encodeURIComponent(retrieveUnit);
  resourceForm.enctype = 'multipart/form-data';
  newResourceItem.appendChild(resourceForm);

  // File container to restyle the file upload
  let newFileContainer = document.createElement('label');
  newFileContainer.textContent = 'Select a file...';
  newFileContainer.id = 'fileContainer';
  resourceForm.appendChild(newFileContainer);

  // File input field to be used with file container
  let newFile = document.createElement('input');
  newFile.type = 'file';
  newFile.name = 'fileInput';
  newFileContainer.appendChild(newFile);

  // File path to show the file the user has selected
  let filePath = document.createElement('p');
  filePath.id = 'filePath';
  resourceForm.appendChild(filePath);

  // File item id, used with loadFiles to identify item
  let fileItemID = document.createElement('input');
  fileItemID.type = 'hidden';
  fileItemID.name = 'itemID';
  fileItemID.value = resourceID;
  resourceForm.appendChild(fileItemID);

  // Upload submit to post file upload to server
  let fileUpload = document.createElement('input');
  fileUpload.type = 'submit';
  fileUpload.value = 'Upload';
  fileUpload.disabled = 'true';
  resourceForm.appendChild(fileUpload);

  // Appends new item to location stored in db
  let location = document.getElementById(itemLocation);
  location.appendChild(newResourceItem);

  // Calls the event listeners for the item
  eventItems(newResourceItem, resourceID, deleteResource);

  // Calls loadFiles, to load a file into the item
  loadFiles(resourceID, resourceForm.id);

  // Adds new item to an array
  resourcesArray.push(newResourceItem);

  // newFile event listener to detect if a file has been selected
  newFile.addEventListener('change', function(event) {
    // If a file has been selected, enable fileUpload to allow a post request
    filePath.style.display = 'block';
    filePath.innerHTML = 'Selected File: ' + this.files[0].name;
    fileUpload.style.marginTop = '0.6em';
    fileUpload.removeAttribute('disabled');
    // Restyling of fileUpload
    fileUpload.style.background = '#1D1A8B';
    fileUpload.onmouseover = function() {
      this.style.background = '#4a47a2';
    }
    fileUpload.onmouseout = function() {
      this.style.background = '#1D1A8B';
    }
  });
}

// Create new resource item from interface
async function createNewResource() {
  const url = '/api/latestItemID?unit=' + encodeURIComponent(retrieveUnit);

  // Fetch request to latestItemID to retrieve the latest id for the unit
  const response = await fetch(url);
  if (response.ok) {
    let data = await response.json();
    var latestResourceID = data.latestResourceID;
  } else {
    console.error('Error getting the latest ItemID', response.status, response.statusText);
  }

  // Creates main item section, adds id & classes
  let newResourceItem = document.createElement('section');
  let idValue = latestResourceID.match(/\d+/)[0];
  if (idValue == 0) {
    idValue = 101;
  } else {
    idValue++;
  }
  newResourceItem.id = 'resrc'+idValue;
  let resourceID = newResourceItem.id;
  newResourceItem.className += 'newItem newResourceItem';
  newResourceItem.draggable = 'true';

  // Adds an item letter to the left border
  let resourceLetter = document.createElement('span');
  resourceLetter.textContent = 'R';
  resourceLetter.className = 'resourceLetter';
  newResourceItem.appendChild(resourceLetter);

  // Adds a delete cross on the right side of the item
  let deleteResource = document.createElement('span');
  deleteResource.innerHTML = '<i class="fas fa-times"></i>';
  deleteResource.className = 'itemDelete';
  newResourceItem.appendChild(deleteResource);

  // Adds a form to the item to allow a user to upload a file
  let resourceForm = document.createElement('form');
  resourceForm.id = 'upload' + resourceID;
  resourceForm.action = '/api/upload?unit=' + encodeURIComponent(retrieveUnit);
  resourceForm.method = 'post';
  resourceForm.enctype = 'multipart/form-data';
  newResourceItem.appendChild(resourceForm);

  // File container to restyle the file upload
  let newFileContainer = document.createElement('label');
  newFileContainer.textContent = 'Select a file...';
  newFileContainer.id = 'fileContainer';
  resourceForm.appendChild(newFileContainer);

  // File input field to be used with file container
  let newFile = document.createElement('input');
  newFile.type = 'file';
  newFile.name = 'fileInput';
  newFileContainer.appendChild(newFile);

  // File path to show the file the user has selected
  let filePath = document.createElement('p');
  filePath.id = 'filePath';
  resourceForm.appendChild(filePath);

  // File item id, used with loadFiles to identify item
  let fileItemID = document.createElement('input');
  fileItemID.type = 'hidden';
  fileItemID.name = 'itemID';
  fileItemID.value = resourceID;
  resourceForm.appendChild(fileItemID);

  // Upload submit to post file upload to server
  let fileUpload = document.createElement('input');
  fileUpload.type = 'submit';
  fileUpload.value = 'Upload';
  fileUpload.disabled = 'true';
  resourceForm.appendChild(fileUpload);

  // Appends new item to default items section
  items.appendChild(newResourceItem);

  // Sends the new item id and location to the db
  addNewItem(resourceID, 'N/A', 'items');

  // Calls the event listeners for the item
  eventItems(newResourceItem, resourceID, deleteResource);

  // Adds new item to an array
  resourcesArray.push(newResourceItem);

  // newFile event listener to detect if a file has been selected
  newFile.addEventListener('change', function(event) {
    // If a file has been selected, enable fileUpload to allow a post request
    filePath.style.display = 'block';
    filePath.innerHTML = 'Selected File: ' + this.files[0].name;
    fileUpload.style.marginTop = '0.6em';
    fileUpload.removeAttribute('disabled');
    // Restyling of fileUpload
    fileUpload.style.background = '#1D1A8B';
    fileUpload.onmouseover = function() {
      this.style.background = '#4a47a2';
    }
    fileUpload.onmouseout = function() {
      this.style.background = '#1D1A8B';
    }
  });
}

// Adds new lecturer item from db
function addNewLecturer(itemID, itemContent, itemLocation) {
  // Creates main item section, adds id & classes
  let newLecturerItem = document.createElement('section');
  newLecturerItem.id = itemID;
  let lecturerID = newLecturerItem.id;
  newLecturerItem.className += 'newItem newLecturerItem';
  newLecturerItem.draggable = 'true';

  // Adds an item letter to the left border
  let lecturerLetter = document.createElement('span');
  lecturerLetter.textContent = 'L';
  lecturerLetter.className = 'lecturerLetter';
  newLecturerItem.appendChild(lecturerLetter);

  // Adds a delete cross on the right side of the item
  let deleteLecturer = document.createElement('span');
  deleteLecturer.innerHTML = '<i class="fas fa-times"></i>';
  deleteLecturer.className = 'itemDelete';
  newLecturerItem.appendChild(deleteLecturer);

  // Adds a text field to the item
  let lecturerText = document.createElement('p');
  lecturerText.className = 'itemText';
  lecturerText.style.minHeight = '2em';
  lecturerText.contentEditable = 'true';
  newLecturerItem.appendChild(lecturerText);

  // Imports content from db to item
  if (itemContent) {
    lecturerText.innerHTML = itemContent;
  }

  // Appends new item to location stored in db
  let location = document.getElementById(itemLocation);
  location.appendChild(newLecturerItem);
  lecturerText.focus();

  // Calls the event listeners for the item
  textEventItems(newLecturerItem, lecturerID, lecturerText);
  eventItems(newLecturerItem, lecturerID, deleteLecturer);

  // Adds new item to an array
  lecturersArray.push(newLecturerItem);
}

// Creates new lecturer item from interface
async function createNewLecturer() {
  // Fetches latest itemID for the unit
  const url = '/api/latestItemID?unit=' + encodeURIComponent(retrieveUnit);

  const response = await fetch(url);
  if (response.ok) {
    let data = await response.json();
    var latestLecturerID = data.latestLecturerID;
  } else {
    console.error('Error getting the latest ItemID', response.status, response.statusText);
  }

  let newLecturerItem = document.createElement('section');
  // Uses fetched id to determine the next itemID
  let idValue = latestLecturerID.match(/\d+/)[0];
  if (idValue == 0) {
    // Default item id
    idValue = 101;
  } else {
    // Increment to the next item id
    idValue++;
  }
  // Sets id and classes for the item
  newLecturerItem.id = 'lectr'+idValue;
  let lecturerID = newLecturerItem.id;
  newLecturerItem.className += 'newItem newLecturerItem';
  newLecturerItem.draggable = 'true';

  // Adds an item letter to the left border
  let lecturerLetter = document.createElement('span');
  lecturerLetter.textContent = 'L';
  lecturerLetter.className = 'lecturerLetter';
  newLecturerItem.appendChild(lecturerLetter);

  // Adds a delete cross on the right side of the item
  let deleteLecturer = document.createElement('span');
  deleteLecturer.innerHTML = '<i class="fas fa-times"></i>';
  deleteLecturer.className = 'itemDelete';
  newLecturerItem.appendChild(deleteLecturer);

  // Adds a text field to the item
  let lecturerText = document.createElement('p');
  lecturerText.className = 'itemText';
  lecturerText.style.minHeight = '2em';
  lecturerText.contentEditable = 'true';
  newLecturerItem.appendChild(lecturerText);

  // Appends new item to default items section
  items.appendChild(newLecturerItem);
  lecturerText.focus();

  // Sends the new item id, text content, and location to the db
  addNewItem(lecturerID, lecturerText.textContent, 'items');

  // Calls the event listeners for the item
  textEventItems(newLecturerItem, lecturerID, lecturerText);
  eventItems(newLecturerItem, lecturerID, deleteLecturer);

  // Adds new item to an array
  lecturersArray.push(newLecturerItem);
}

// Adds new room item from db
function addNewRoom(itemID, itemContent, itemLocation) {
  // Creates main item section, adds id & classes
  let newRoomItem = document.createElement('section');
  newRoomItem.id = itemID;
  let roomID = newRoomItem.id;
  newRoomItem.className += 'newItem newRoomItem';
  newRoomItem.draggable = 'true';

  // Adds an item letter to the left border
  let roomLetter = document.createElement('span');
  roomLetter.textContent = 'R';
  roomLetter.className = 'roomLetter';
  newRoomItem.appendChild(roomLetter);

  // Adds a delete cross on the right side of the item
  let deleteRoom = document.createElement('span');
  deleteRoom.innerHTML = '<i class="fas fa-times"></i>';
  deleteRoom.className = 'itemDelete';
  newRoomItem.appendChild(deleteRoom);

  // Adds a text field to the item
  let roomText = document.createElement('p');
  roomText.className = 'itemText';
  roomText.style.minHeight = '2em';
  roomText.contentEditable = 'true';
  newRoomItem.appendChild(roomText);

  // Imports content from db to item
  if (itemContent) {
    roomText.innerHTML = itemContent;
  }

  // Appends new item to location stored in db
  let location = document.getElementById(itemLocation);
  location.appendChild(newRoomItem);
  roomText.focus();

  // Calls the event listeners for the item
  textEventItems(newRoomItem, roomID, roomText);
  eventItems(newRoomItem, roomID, deleteRoom);

  // Adds new item to an array
  roomsArray.push(newRoomItem);
}

// Creates new room item from interface
async function createNewRoom() {
  // Fetches latest itemID for the unit
  const url = '/api/latestItemID?unit=' + encodeURIComponent(retrieveUnit);

  const response = await fetch(url);
  if (response.ok) {
    let data = await response.json();
    var latestRoomID = data.latestRoomID;
  } else {
    console.error('Error getting the latest ItemID', response.status, response.statusText);
  }

  let newRoomItem = document.createElement('section');
  // Uses fetched id to determine the next itemID
  let idValue = latestRoomID.match(/\d+/)[0];
  if (idValue == 0) {
    // Default item id
    idValue = 101;
  } else {
    // Increment to the next item id
    idValue++;
  }
  // Sets id and classes for the item
  newRoomItem.id = 'room'+idValue;
  let roomID = newRoomItem.id;
  newRoomItem.className += 'newItem newRoomItem';
  newRoomItem.draggable = 'true';

  // Adds an item letter to the left border
  let roomLetter = document.createElement('span');
  roomLetter.textContent = 'R';
  roomLetter.className = 'roomLetter';
  newRoomItem.appendChild(roomLetter);

  // Adds a delete cross on the right side of the item
  let deleteRoom = document.createElement('span');
  deleteRoom.innerHTML = '<i class="fas fa-times"></i>';
  deleteRoom.className = 'itemDelete';
  newRoomItem.appendChild(deleteRoom);

  // Adds a text field to the item
  let roomText = document.createElement('p');
  roomText.className = 'itemText';
  roomText.style.minHeight = '2em';
  roomText.contentEditable = 'true';
  newRoomItem.appendChild(roomText);

  // Appends new item to default items section
  items.appendChild(newRoomItem);
  roomText.focus();

  // Sends the new item id, text content, and location to the db
  addNewItem(roomID, roomText.textContent, 'items');

  // Calls the event listeners for the item
  textEventItems(newRoomItem, roomID, roomText);
  eventItems(newRoomItem, roomID, deleteRoom);

  // Adds new item to an array
  roomsArray.push(newRoomItem);
}

// Shows all items, used with search
function homeLayout() {
  sidebarRemove();
  for (let topic of topicsArray) {
    topic.removeAttribute('style');
  }
  for (let note of notesArray) {
    note.removeAttribute('style');
  }
  for (let resource of resourcesArray) {
    resource.removeAttribute('style');
  }
  for (let lecturer of lecturersArray) {
    lecturer.removeAttribute('style');
  }
  for (let room of roomsArray) {
    room.removeAttribute('style');
  }
}

// Shows topic items only, used with search
function allTopicsDisplay() {
  for (let topic of topicsArray) {
    topic.removeAttribute('style');
  }
  for (let note of notesArray) {
    note.style.display = 'none';
  }
  for (let resource of resourcesArray) {
    resource.style.display = 'none';
  }
  for (let lecturer of lecturersArray) {
    lecturer.style.display = 'none';
  }
  for (let room of roomsArray) {
    room.style.display = 'none';
  }
}

// Shows note items only, used with search
function allNotesDisplay() {
  for (let topic of topicsArray) {
    topic.style.display = 'none';
  }
  for (let note of notesArray) {
    note.removeAttribute('style');
  }
  for (let resource of resourcesArray) {
    resource.style.display = 'none';
  }
  for (let lecturer of lecturersArray) {
    lecturer.style.display = 'none';
  }
  for (let room of roomsArray) {
    room.style.display = 'none';
  }
}

// Shows note items only, used with search
function allResourcesDisplay() {
  for (let topic of topicsArray) {
    topic.style.display = 'none';
  }
  for (let note of notesArray) {
    note.style.display = 'none';
  }
  for (let resource of resourcesArray) {
    resource.removeAttribute('style');
  }
  for (let lecturer of lecturersArray) {
    lecturer.style.display = 'none';
  }
  for (let room of roomsArray) {
    room.style.display = 'none';
  }
}

// Shows lecturer items only, used with search
function allLecturersDisplay() {
  for (let topic of topicsArray) {
    topic.style.display = 'none';
  }
  for (let note of notesArray) {
    note.style.display = 'none';
  }
  for (let resource of resourcesArray) {
    resource.style.display = 'none';
  }
  for (let lecturer of lecturersArray) {
    lecturer.removeAttribute('style');
  }
  for (let room of roomsArray) {
    room.style.display = 'none';
  }
}

// Shows room items only, used with search
function allRoomsDisplay() {
  for (let topic of topicsArray) {
    topic.style.display = 'none';
  }
  for (let note of notesArray) {
    note.style.display = 'none';
  }
  for (let resource of resourcesArray) {
    resource.style.display = 'none';
  }
  for (let lecturer of lecturersArray) {
    lecturer.style.display = 'none';
  }
  for (let room of roomsArray) {
    room.removeAttribute('style');
  }
}

// Search items for keywords typed by the user
function searchItems() {
  // Display item type by search value
  if (search.value.toLowerCase().includes('topic')) {
    allTopicsDisplay();
    return;
  } else if (search.value.toLowerCase().includes('note')) {
    allNotesDisplay();
    return;
  } else if (search.value.toLowerCase().includes('resource')) {
    allResourcesDisplay();
    return;
  } else if (search.value.toLowerCase().includes('lecturer')) {
    allLecturersDisplay();
    return;
  } else if (search.value.toLowerCase().includes('room')) {
    allRoomsDisplay();
    return;
  } else if (search.value.toLowerCase().includes('unit')) {
    window.location.href = '../units';
  } else if (search.value.toLowerCase().includes('help')) {
    window.location.href = '../help';
  } else {
    // Resets to show all items
    homeLayout();
  }

  // Search for keywords in topic items
  for (let topic of topicsArray) {
    let content = topic.querySelector('p.itemText').textContent;
    if (content.toLowerCase().includes(search.value.toLowerCase())) {
      topic.removeAttribute('style');
    } else {
      topic.style.display = 'none';
    }
  }

  // Search for keywords in note items
  for (let note of notesArray) {
    let content = note.querySelector('p.itemText').textContent;
    if (content.toLowerCase().includes(search.value.toLowerCase())) {
      note.removeAttribute('style');
    } else {
      note.style.display = 'none';
    }
  }

  // Search for keywords in note items
  for (let resource of resourcesArray) {
    let content = resource.querySelector('form.uploadedFile').innerHTML;
    if (content.toLowerCase().includes(search.value.toLowerCase())) {
      resource.removeAttribute('style');
    } else {
      resource.style.display = 'none';
    }
  }

  // Search for keywords in lecturer items
  for (let lecturer of lecturersArray) {
    let content = lecturer.querySelector('p.itemText').textContent;
    if (content.toLowerCase().includes(search.value.toLowerCase())) {
      lecturer.removeAttribute('style');
    } else {
      lecturer.style.display = 'none';
    }
  }

  // Search for keywords in room items
  for (let room of roomsArray) {
    let content = room.querySelector('p.itemText').textContent;
    if (content.toLowerCase().includes(search.value.toLowerCase())) {
      room.removeAttribute('style');
    } else {
      room.style.display = 'none';
    }
  }
}
