/* Units JS */

// Handles for all main sections to be used often
const titleHeader = document.getElementById('titleHeader');
const unitsSection = document.getElementById('unitsSection');

// Handles for all small elements to be used often
const search = document.getElementById('search');
const unitItemsList = document.getElementById('unitItemsList');
const newUnit = document.getElementById('newUnit');
const newNumberOfWeeks = document.getElementById('newNumberOfWeeks');
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

// Retrieves the current logged in user
const userLoggedIn = localStorage.getItem('user');

// Retrieve the current unit and its date created local storage
const retrieveUnit = localStorage.getItem('currentUnit');
const unitCreatedDate = localStorage.getItem('unitCreated');

/* Event listeners */

/* Accessibility Keyboard Shortcuts */

function keyboardShortcuts(event) {
  // Ctrl F to focus on search
  if (event.ctrlKey && event.keyCode == 70) {
    search.focus();
  }

  // Ctrl D to redirect back to Dashboard
  if (event.ctrlKey && event.keyCode == 68) {
    window.location.href = '../';
  }

  // Ctrl M to toggle the Sidebar
  if (event.ctrlKey && event.keyCode == 77) {
    sidebarToggle();
  }

  // Ctrl H to load the Help page
  if (event.ctrlKey && event.keyCode == 72) {
    window.location.href = '../help';
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
titleHeaderLeft.addEventListener('click', sidebarRemove);
titleHeaderRight.addEventListener('click', sidebarRemove);
unitsSection.addEventListener('click', sidebarRemove);

// Sidebar
menu.addEventListener('click', sidebarToggle);

home.addEventListener('click', function() {
  window.location.href = '../';
});

allUnits.addEventListener('click', function() {
  window.location.reload(true);
});

allTopics.addEventListener('click', function() {
  window.location.href = '../topics';
});

allNotes.addEventListener('click', function() {
  window.location.href = '../notes';
});

allResources.addEventListener('click', function() {
  window.location.href = '../resources';
});

allLecturers.addEventListener('click', function() {
  window.location.href = '../lecturers';
});

allRooms.addEventListener('click', function() {
  window.location.href = '../rooms';
});

help.addEventListener('click', function() {
  window.location.href = '../help';
});

// Logo and search
logo.addEventListener('click', function() {
  window.location.href = '../';
});
search.addEventListener('keyup', searchItems);

// Add new unit
addNewUnit.addEventListener('click', addUnit);

// Reset styling for new inputs
newUnit.addEventListener('focus', resetInputs);
newUnit.addEventListener('click', resetInputs);
newNumberOfWeeks.addEventListener('focus', resetInputs);
newNumberOfWeeks.addEventListener('click', resetInputs);

// Main window event listener to begin loading the page
window.addEventListener('DOMContentLoaded', function() {

  // Welcome the current user logged in
  currentUser.textContent = 'Welcome ' + userLoggedIn;

  // Call to loadUnits to load the units for the logged in user
  loadUnits();

  // Load Unit Information Section
  dateCreated(unitCreatedDate);
  numberOfWeeks(retrieveUnit);
  numberOfItems(retrieveUnit);
  numberOfFiles(retrieveUnit);

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

// Loads the units for the current logged in user
async function loadUnits() {
  const url = '/api/units?user=' + encodeURIComponent(userLoggedIn);

  const response = await fetch(url);
  if (response.ok) {
    let data = await response.json();
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        // Unit name handle
        let unitName = data[key].unitName;

        // Unit radio input, used to change units
        let unitInput = document.createElement('input');
        unitInput.type = 'radio';
        unitInput.name = 'units';
        unitInput.id = unitName + 'Unit';
        unitItemsList.appendChild(unitInput);

        // Unit label, used to show the unit on interface
        let unitLabel = document.createElement('label');
        unitLabel.setAttribute('for', unitName + 'Unit');
        unitLabel.innerHTML = unitName;
        unitLabel.className = 'unitItem';
        unitItemsList.appendChild(unitLabel);

        // If more than 3 units, change list to 2 column grid layout
        if (data[key] == data[3]) {
          unitItemsList.style.display = 'grid';
          unitItemsList.style.gridTemplateColumns = '10em 10em';
        }

        // Set default selected unit to current unit
        if (retrieveUnit == unitName) {
          unitInput.checked = true;
          unitLabel.style.background = '#00cc00';
        }

        // Unit input change event, executed when the user clicks on a unit
        unitInput.addEventListener('change', function() {
          // Retrieve unit date
          let dateAdded = data[key].dateAdded;

          // Set the local storage cache to selected unit and date created
          localStorage.setItem('currentUnit', unitName);
          localStorage.setItem('unitCreated', dateAdded);

          // Reset styling on all units
          let unitItems = document.getElementsByClassName('unitItem');
          for (let unit of unitItems) {
            unit.removeAttribute('style');
          }

          // Set styling on clicked unit
          unitLabel.style.background = '#00cc00';

          // Reset unit information fields
          unitCreated.innerHTML = '<label>Created: </label>';
          numOfWeeks.innerHTML = '<label>Weeks: </label>';
          numOfTopics.innerHTML = '<label>Topics: </label>';
          numOfNotes.innerHTML = '<label>Notes: </label>';
          numOfResources.innerHTML = '<label>Resources: </label>';
          numOfLecturers.innerHTML = '<label>Lecturers: </label>';
          numOfRooms.innerHTML = '<label>Rooms: </label>';
          numOfFiles.innerHTML = '<label>Files: </label>';

          // Call unit information functions
          dateCreated(dateAdded);
          numberOfWeeks(unitName);
          numberOfItems(unitName);

          // Reset files list, and load files into list
          filesList.innerHTML = '<h2>Files</h2>';
          numberOfFiles(unitName);
        });
      }
    }
  } else {
    console.error('Error loading the units', response.status, response.statusText);
  }
}

// Creation date of unit
function dateCreated(dateAdded) {
  // Regular expression to access the year, month and day values
  let dateAddedReg = dateAdded.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  let year = dateAddedReg[1];
  let month = dateAddedReg[2];
  let day = dateAddedReg[3];

  // Insert the date into the Unit Information section
  unitCreated.innerHTML += day + '/' + month + '/' + year;
}

// Number of weeks
async function numberOfWeeks(unitName) {
  const url = '/api/weeks?unit=' + encodeURIComponent(unitName);

  const response = await fetch(url);
  if (response.ok) {
    let data = await response.json();

    // Count the number of weeks for unit
    let numOfWeeksCounter = 0;

    for (let key in data) {
      numOfWeeksCounter++;
    }

    // Insert result into Unit Information
    numOfWeeks.innerHTML += numOfWeeksCounter;
  }
}

// Number of items
async function numberOfItems(unitName) {
  const url = '/api/items?unit=' + encodeURIComponent(unitName);

  const response = await fetch(url);
  if (response.ok) {
    let data = await response.json();

    // Count the number of items for unit
    let numOfTopicsCounter = 0;
    let numOfNotesCounter = 0;
    let numOfResourcesCounter = 0;
    let numOfLecturersCounter = 0;
    let numOfRoomsCounter = 0;

    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (data[key].itemID.includes('topic')) {
          numOfTopicsCounter++;
        } else if (data[key].itemID.includes('note')) {
          numOfNotesCounter++;
        } else if (data[key].itemID.includes('resrc')) {
          numOfResourcesCounter++;
        } else if (data[key].itemID.includes('lectr')) {
          numOfLecturersCounter++;
        } else if (data[key].itemID.includes('room')) {
          numOfRoomsCounter++;
        }
      }
    }

    // Insert result into Unit Information
    numOfTopics.innerHTML += numOfTopicsCounter;
    numOfNotes.innerHTML += numOfNotesCounter;
    numOfResources.innerHTML += numOfResourcesCounter;
    numOfLecturers.innerHTML += numOfLecturersCounter;
    numOfRooms.innerHTML += numOfRoomsCounter;
  }
}

// Loads files meta data for the unit from database
async function numberOfFiles(unitName) {
  const url = '/api/numberOfFiles?unit=' + encodeURIComponent(unitName);

  const response = await fetch(url);
  if (response.ok) {
    let data = await response.json();

    // Count the number of files for unit
    let numOfFilesCounter = 0;

    // Insert every file for unit into the files list
    for (let key in data.files) {
      let fileList = document.createElement('p');
      fileList.className = 'fileList';
      fileList.innerHTML = '<a href="../upload/' + data.files[key].fileName + '">' + data.files[key].fileName + '</a>';
      filesList.appendChild(fileList);
      if (data.length != 0) {
        numOfFilesCounter++;
      }
    }

    // Insert result into Unit Information
    numOfFiles.innerHTML += numOfFilesCounter;

    // If no files uploaded for unit, inform user
    if (data.files.length == 0) {
      let fileList = document.createElement('p');
      fileList.className = 'fileList';
      fileList.innerHTML += 'No files uploaded';
      filesList.appendChild(fileList);
    }
  }
}

// Adds a new unit to the user logged in
async function addUnit() {
  // Default valid form
  let valid = true;

  // Validation for an empty field
  if (newUnit.value.length < 1) {
    value = false;
    newUnit.style.border = '0.05em solid #ff0000';
  // Validation to check if value entered is a number between 1 and 24
  } else if (isNaN(newNumberOfWeeks.value) || newNumberOfWeeks.value <= 0 || newNumberOfWeeks.value >= 25) {
    value = false;
    newNumberOfWeeks.style.border = '0.05em solid #ff0000';
  // If no errors, add new unit
  } else if (valid) {
    const url = '/api/addUnit?unit=' + encodeURIComponent(newUnit.value) + '&user=' + encodeURIComponent(userLoggedIn) + '&weeks=' + encodeURIComponent(newNumberOfWeeks.value);

    const response = await fetch(url, { method: 'POST' });
    if (response.ok) {
      // Sets new unit as the loaded unit and reload page
      localStorage.setItem('currentUnit', newUnit.value);
      window.location.reload(true);
    } else {
      console.error('Error adding a new unit', response.status, response.statusText);
    }
  }
}

// Show / hide sidebar
function sidebarToggle() {
  sidebar.classList.toggle('sidebarExpanded');
}

// Hide sidebar
function sidebarRemove() {
  sidebar.classList.remove('sidebarExpanded');
}

// Reset styling for new inputs
function resetInputs() {
  newUnit.removeAttribute('style');
  newNumberOfWeeks.removeAttribute('style');
}

// Search items for keywords typed by the user
function searchItems() {
  // Redirect to page by search value
  if (search.value.toLowerCase().includes('dashboard')) {
    window.location.href = '../';
  } else if (search.value.toLowerCase().includes('topic')) {
    window.location.href = '../topics';
  } else if (search.value.toLowerCase().includes('note')) {
    window.location.href = '../notes';
  } else if (search.value.toLowerCase().includes('resource')) {
    window.location.href = '../resources';
  } else if (search.value.toLowerCase().includes('lecturer')) {
    window.location.href = '../lecturers';
  } else if (search.value.toLowerCase().includes('room')) {
    window.location.href = '../rooms';
  } else if (search.value.toLowerCase().includes('help')) {
    window.location.href = '../help';
  }
}
