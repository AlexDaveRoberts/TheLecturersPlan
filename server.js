/* Server */

/* Database Connection */
const db = require('./connect');

/* Packages */
const fs = require('fs');
const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
app.use(fileUpload());

// Requests for static web pages
app.use('/', express.static('web', { extensions: ['html'] }));

const pages = ['/dashboard', '/units', '/topics', '/notes', '/resources', '/lecturers', '/rooms', 'help'];

for (let page of pages) {
  app.use(page, express.static('web/dashboard', { extensions: ['html'] }));
}

// Login and Register
app.get('/api/login', login);
app.post('/api/register', register);

// Units
app.get('/api/units', units);
app.post('/api/addUnit', addUnit);

// Items
app.get('/api/items', items);
app.post('/api/addItem', addItem);
app.post('/api/updateItem', updateItem);
app.delete('/api/deleteItem', deleteItem);
app.get('/api/latestItemID', latestItemID);

// Weeks
app.get('/api/weeks', weeks);
app.post('/api/addWeek', addWeek);
app.get('/api/numberOfWeeks', numberOfWeeks);

// File Upload
app.post('/api/upload', upload);
app.get('/api/loadFiles', loadFiles);
app.get('/api/numberOfFiles', numberOfFiles);
app.delete('/api/deleteFile', deleteFile);

// Login Request
function login(req, res) {
  // Requests email address and password
  const email = req.query.email;
  const password = req.query.password;

  res.setHeader('Content-Type', 'application/json');

  // Retrieves all accounts from userLogin where the email address and password equal to the user entered values
  db.query('SELECT * FROM userLogin WHERE userEmail = "' + email + '" AND password = "' + password + '"', (err,result) => {
    // If one result, the account exists in db
    if (result.length == 1) {
      res.send({
        "login": 'true',
        "user": result[0].username
      });
      // Else, the account doesn't exist
    } else {
      res.send({
        "login": 'false'
      });
    }
  });
}

// Register request
function register(req, res) {
  // Requests all the new user inputs from Registration form
  const name = req.query.name;
  const email = req.query.email;
  const password = req.query.password;
  const unit = req.query.unit;
  const weeks = req.query.weeks;

  res.setHeader('Content-Type', 'application/json');

  // Validation to check if the account exists, if greater than one return false, the account cannot be created
  db.query('SELECT * FROM userLogin WHERE userEmail = "' + email + '"', (err,result) => {
    if (result.length >= 1) {
      res.send({
        "register": 'false'
      });
    } else {
      // Select last user row from table, so the userID can be incremented ready for new login account
      db.query('SELECT * FROM userLogin ORDER BY userID DESC LIMIT 1', (err,result) => {
        let userID = result[0].userID;
        userID++;

        // Insert new login values into userLogin
        db.query('INSERT INTO userLogin (userID, username, userEmail, password) VALUES ("' + userID + '", "' + name + '", "' + email + '", "' + password + '")', (err,result) => {
          if (err) throw err;
        });
      });

      // Creates a new units table for the user
      db.query('CREATE TABLE ' + name + 'Units (unitName VARCHAR(20), dateAdded DATETIME, PRIMARY KEY (unitName))', function (err, result) {
        if (err) throw err;
      });

      // Insert the first unit into the units table
      db.query('INSERT INTO ' + name + 'Units (unitName, dateAdded) VALUES ("' + unit + '", CURRENT_TIMESTAMP())', (err,result) => {
        if (err) throw err;
      });

      // Creates a new weeks table for the user
      db.query('CREATE TABLE ' + unit + 'Weeks (weekID VARCHAR(10), weekName VARCHAR(10), weekLocation VARCHAR(10), dateAdded DATETIME, PRIMARY KEY (weekID))', function (err, result) {
        if (err) throw err;
      });

      // Creates a unit initialisation table with the numberOfWeeks the user requires, to be used on first load on Dashboard
      db.query('CREATE TABLE ' + unit + 'Initialise (numberOfWeeks VARCHAR(10), PRIMARY KEY (numberOfWeeks))', function (err, result) {
        if (err) throw err;
      });

      // Insert numberOfWeeks into unit initialisation table
      db.query('INSERT INTO ' + unit + 'Initialise (numberOfWeeks) VALUES ("' + weeks + '")', (err,result) => {
        if (err) throw err;
      });

      // Creates a unit items table for the user
      db.query('CREATE TABLE ' + unit + 'Items (itemID VARCHAR(10), itemContent VARCHAR(240), itemLocation VARCHAR(10), dateAdded DATETIME, PRIMARY KEY (itemID))', function (err, result) {
        if (err) throw err;
      });

      // Creates a unit files table for the user
      db.query('CREATE TABLE ' + unit + 'Files (fileID INT(10), fileName VARCHAR(50), itemID VARCHAR(10), dateAdded DATETIME, PRIMARY KEY (fileID))', function (err, result) {
        if (err) throw err;
      });

      // Return registration true, username and weeks, so the user can be logged in to the Dashboard
      res.send({
        "register": 'true',
        "user": name,
        "weeks": weeks
      });
    }
  });
}

// Units request
function units(req, res) {
  // Request logged in user
  const user = req.query.user;

  // Retrieves all of the units for the user
  db.query('SELECT * FROM ' + user + 'Units', (err, result) => {
    if (err) throw err;
    let units = JSON.stringify(result);

    // Sends units back as JSON object
    res.setHeader('Content-Type', 'application/json');
    res.send(units);
  });
}

// Add unit request
function addUnit(req, res) {
  // Request logged in user and unit name
  const user = req.query.user;
  const unit = req.query.unit;
  const weeks = req.query.weeks;

  // Insert into the user's unit table, the new unit name
  db.query('INSERT INTO ' + user + 'Units (unitName, dateAdded) VALUES ("' + unit + '", CURRENT_TIMESTAMP())', (err,result) => {
    if (err) throw err;
  });

  // Creates a new weeks table for the user
  db.query('CREATE TABLE ' + unit + 'Weeks (weekID VARCHAR(10), weekName VARCHAR(10), weekLocation VARCHAR(10), dateAdded DATETIME, PRIMARY KEY (weekID))', function (err, result) {
    if (err) throw err;
  });

  // Creates a new items table for the user
  db.query('CREATE TABLE ' + unit + 'Items (itemID VARCHAR(10), itemContent VARCHAR(240), itemLocation VARCHAR(10), dateAdded DATETIME, PRIMARY KEY (itemID))', function (err, result) {
    if (err) throw err;
  });

  // Creates a new files table for the user
  db.query('CREATE TABLE ' + unit + 'Files (fileID INT(10), fileName VARCHAR(50), itemID VARCHAR(10), dateAdded DATETIME, PRIMARY KEY (fileID))', function (err, result) {
    if (err) throw err;
  });

  // Creates a unit initialisation table with the numberOfWeeks the user requires, to be used on first load on Dashboard
  db.query('CREATE TABLE ' + unit + 'Initialise (numberOfWeeks VARCHAR(10), PRIMARY KEY (numberOfWeeks))', function (err, result) {
    if (err) throw err;
  });

  // Insert 0 into unit initialisation table, as the new unit has been created on the Dashboard
  db.query('INSERT INTO ' + unit + 'Initialise (numberOfWeeks) VALUES ("' + weeks + '")', (err,result) => {
    if (err) throw err;
  });

  // Sends back a successful 200 OK response
  res.sendStatus(200);
}

// Items request
function items(req, res) {
  // Request unit name
  const unit = req.query.unit;

  // Retrieves all items from the unit the user is currently viewing on the Dashboard
  db.query('SELECT * FROM ' + unit + 'Items ORDER BY dateAdded DESC', (err, result) => {
    if (err) throw err;
    let items = JSON.stringify(result);

    // Sends items back as JSON object
    res.setHeader('Content-Type', 'application/json');
    res.send(items);
  });
}

// Add item request
function addItem(req, res) {
  // Request unit name, the item id, content and location
  const unit = req.query.unit;
  const itemID = req.query.itemID;
  const itemContent = req.query.itemContent;
  const itemLocation = req.query.itemLocation;

  // Retrieve all items for the unit
  db.query('SELECT * FROM ' + unit + 'Items ORDER BY dateAdded DESC', (err, rows) => {
    if (err) throw err;

    // Loop through every item to see if the item exists
    for (let row of rows) {
      if (row.itemID == itemID) {
        var match = true;
      };
    };

    // If the item does not exist, a new item row will be created
    if (!match) {
      db.query('INSERT INTO ' + unit + 'Items (itemID, itemContent, itemLocation, dateAdded) VALUES ("' + itemID + '", "' + itemContent + '", "' + itemLocation + '", CURRENT_TIMESTAMP())', (err,result) => {
        if (err) throw err;
      });
    } else {
      // Else, the item exists, update the content and location for the item
      db.query('UPDATE ' + unit + 'Items SET itemContent = "' + itemContent + '" WHERE itemID = "' + itemID + '"', (err,result) => {
        if (err) throw err;
      });

      db.query('UPDATE ' + unit + 'Items SET itemLocation = "' + itemLocation + '" WHERE itemID = "' + itemID + '"', (err,result) => {
        if (err) throw err;
      });
    };
  });

  // Sends back a successful 200 OK response
  res.sendStatus(200);
}

// Update item request
function updateItem(req, res) {
  // Request unit name, the item id and content
  const unit = req.query.unit;
  const itemID = req.query.itemID;
  const itemContent = req.query.itemContent;

  // Updates the content for the item
  db.query('UPDATE ' + unit + 'Items SET itemContent = "' + itemContent + '" WHERE itemID = "' + itemID + '"', (err,result) => {
    if (err) throw err;
  });

  // Sends back a successful 200 OK response
  res.sendStatus(200);
}

// Delete item request
function deleteItem(req, res) {
  // Request unit name and item id
  const unit = req.query.unit;
  const itemID = req.query.itemID;

  // Delete the item from the unit's items table
  db.query('DELETE FROM ' + unit + 'Items WHERE itemID = "' + itemID + '"', (err,result) => {
    if (err) throw err;
  });

  // Sends back a successful 200 OK response
  res.sendStatus(200);
}

// Latest item id request
function latestItemID(req, res) {
  // Retrieves unit name, and sets default item ids
  const unit = req.query.unit;
  let latestTopicID = '0';
  let latestNoteID = '0';
  let latestResourceID = '0';
  let latestLecturerID = '0';
  let latestRoomID = '0';

  // Query for every type of item in the unit's item table, nested inside each other to ensure the latest item id is returned
  db.query('SELECT * FROM ' + unit + 'Items WHERE itemID LIKE "topic%" ORDER BY itemID DESC LIMIT 1', (err, result) => {
    if (result.length > 0) {
      latestTopicID = result[0].itemID;
    }

    db.query('SELECT * FROM ' + unit + 'Items WHERE itemID LIKE "note%" ORDER BY itemID DESC LIMIT 1', (err, result) => {
      if (result.length > 0) {
        latestNoteID = result[0].itemID;
      }

      db.query('SELECT * FROM ' + unit + 'Items WHERE itemID LIKE "resrc%" ORDER BY itemID DESC LIMIT 1', (err, result) => {
        if (result.length > 0) {
          latestResourceID = result[0].itemID;
        }

        db.query('SELECT * FROM ' + unit + 'Items WHERE itemID LIKE "lectr%" ORDER BY itemID DESC LIMIT 1', (err, result) => {
          if (result.length > 0) {
            latestLecturerID = result[0].itemID;
          }

          db.query('SELECT * FROM ' + unit + 'Items WHERE itemID LIKE "room%" ORDER BY itemID DESC LIMIT 1', (err, result) => {
            if (result.length > 0) {
              latestRoomID = result[0].itemID;
            }

            // Return latest item ids for each type of item as JSON object
            res.setHeader('Content-Type', 'application/json');
            res.send({
              "latestTopicID": latestTopicID,
              "latestNoteID": latestNoteID,
              "latestResourceID": latestResourceID,
              "latestLecturerID": latestLecturerID,
              "latestRoomID": latestRoomID
            });
          });
        });
      });
    });
  });
}

// Weeks request
function weeks(req, res) {
  // Retrieve unit name
  const unit = req.query.unit;

  // Retrieve all weeks for the unit
  db.query('SELECT * FROM ' + unit + 'Weeks ORDER BY weekLocation', (err, result) => {
    if (err) throw err;
    let weeks = JSON.stringify(result);

    // Sends weeks back as JSON object
    res.setHeader('Content-Type', 'application/json');
    res.send(weeks);
  });
}

// Add week request
function addWeek(req, res) {
  // Retrieves the unit name, week id, name and location
  const unit = req.query.unit;
  const weekID = req.query.weekID;
  const weekName = req.query.weekName;
  const weekLocation = req.query.weekLocation;

  // Inserts a new week row into the unit's week table
  db.query('INSERT INTO ' + unit + 'Weeks (weekID, weekName, weekLocation, dateAdded) VALUES ("' + weekID + '", "' + weekName + '", "' + weekLocation + '", CURRENT_TIMESTAMP())', (err,result) => {
    if (err) throw err;
  });

  // Sends back a successful 200 OK response
  res.sendStatus(200);
}

// Number of weeks request for initialisation
function numberOfWeeks(req, res) {
  // Retrieve unit name
  const unit = req.query.unit;

  // Retrieves the numberOfWeeks value to initialise a new unit
  db.query('SELECT * FROM ' + unit + 'Initialise', (err,result) => {
    let numberOfWeeks = result[0].numberOfWeeks;
    // Sends back numberOfWeeks
    res.send(numberOfWeeks);
  });
}

// Upload request for file upload
function upload(req, res) {
  // Retrieve unit name
  const unit = req.query.unit;

  // Handles for the file input, name of file and item id the file is attached to
  const fileInput = req.files.fileInput;
  const fileName = req.files.fileInput.name;
  const itemID = req.body.itemID;

  // Moves file upload to the upload directory
  fileInput.mv(__dirname + '/web/upload/'+fileName, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
  });

  // Default file id
  let latestFileID = 1;

  // Retrieves the latest file id from the unit's file table
  db.query('SELECT * FROM ' + unit + 'Files WHERE fileID ORDER BY fileID DESC LIMIT 1', (err, result) => {
    if (result.length > 0) {
      // Increment the file id for new file entry
      latestFileID = result[0].fileID;
      latestFileID++;
    }

    // Inserts new file row into unit's file table with file id, name and item id
    db.query('INSERT INTO ' + unit + 'Files (fileID, fileName, itemID, dateAdded) VALUES ("' + latestFileID + '", "' + fileName + '", "' + itemID + '", CURRENT_TIMESTAMP())', (err,result) => {
      if (err) throw err;
    });
  });

  // Refresh the Dashboard to show a link to the new file
  res.redirect('../');
}

// Load files request
function loadFiles(req, res) {
  // Retrieves the unit name and item id
  const unit = req.query.unit;
  const itemID = req.query.itemID;

  // Retrieves the item's file row from the unit's file table by item id
  db.query('SELECT * FROM ' + unit + 'Files WHERE itemID = "' + itemID + '"', (err, result) => {
    if (err) throw err;
    if (result.length == 1) {
      // If 1 result, the file has been matched
      var file = result;
    } else {
      // Else, the file does not exist, set none to delete empty item
      file = 'none';
    }

    // Sends file row back as JSON object
    res.setHeader('Content-Type', 'application/json');
    res.send({
      "file": file
    });
  });
}

// Number of files request, used with the units section
function numberOfFiles(req, res) {
  // Retrieves the unit name
  const unit = req.query.unit;

  // Retrieves all the files from the unit's file table
  db.query('SELECT * FROM ' + unit + 'Files', (err, files) => {
    if (err) throw err;

    // Sends file row back as JSON object
    res.setHeader('Content-Type', 'application/json');
    res.send({
      "files": files
    });
  });
}

// Delete file request
function deleteFile(req, res) {
  // Retrieves the unit name and item id
  const unit = req.query.unit;
  const itemID = req.query.itemID;

  // Retrieves the item's file row from the unit's file table by item id
  db.query('SELECT * FROM ' + unit + 'Files WHERE itemID = "' + itemID + '"', (err, result) => {
    if (result.length > 0) {
      let fileName = result[0].fileName;

      // Removes the file from the upload folder
      fs.unlink(__dirname + '/web/upload/'+fileName, function(err) {
        if (err) throw err;
      });
    }
  });

  // Delete the file row from the unit's file table based on the item's id
  db.query('DELETE FROM ' + unit + 'Files WHERE itemID = "' + itemID + '"', (err,result) => {
    if (err) throw err;
  });

  // Sends back a successful 200 OK response
  res.sendStatus(200);
}

app.listen(8080);
