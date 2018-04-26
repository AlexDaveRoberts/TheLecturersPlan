/* Help JS */

// Handles for all main sections to be used often
const titleHeader = document.getElementById('titleHeader');
const helpSection = document.getElementById('helpSection');

// Search handle
const search = document.getElementById('search');

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

  // Ctrl U to load the Units page
  if (event.ctrlKey && event.keyCode == 85) {
    window.location.href = '../units';
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
helpSection.addEventListener('click', sidebarRemove);

// Sidebar
menu.addEventListener('click', sidebarToggle);

home.addEventListener('click', function() {
  window.location.href = '../';
});

allUnits.addEventListener('click', function() {
  window.location.href = '../units';
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
  window.location.reload(true);
});

// Logo and search
logo.addEventListener('click', function() {
  window.location.href = '../';
});
search.addEventListener('keyup', searchItems);

// Main window event listener to begin loading the page
window.addEventListener('DOMContentLoaded', function() {

  // Welcome the current user logged in
  currentUser.textContent = 'Welcome ' + userLoggedIn;

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

// Show / hide sidebar
function sidebarToggle() {
  sidebar.classList.toggle('sidebarExpanded');
}

// Hide sidebar
function sidebarRemove() {
  sidebar.classList.remove('sidebarExpanded');
}

// Search items for keywords typed by the user
function searchItems() {
  // Redirect to page by search value
  if (search.value.toLowerCase().includes('dashboard')) {
    window.location.href = '../';
  } else if (search.value.toLowerCase().includes('unit')) {
    window.location.href = '../units';
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
  }
}
