/* Database Connection */
const db = require('./connect');

console.log('Initialisation script started');

db.query('CREATE TABLE WebScriptWeeks (weekID VARCHAR(10), weekName VARCHAR(10), weekLocation VARCHAR(10), dateAdded DATETIME, PRIMARY KEY (weekID))', (err,result) => {
  if (err) throw err;
  console.log('Created WebScript Weeks');
});

db.query('CREATE TABLE WebScriptItems (itemID VARCHAR(10), itemContent VARCHAR(240), itemLocation VARCHAR(10), dateAdded DATETIME, PRIMARY KEY (itemID))', (err,result) => {
  if (err) throw err;
  console.log('Created WebScript Items');
});

db.query('CREATE TABLE WebScriptFiles (fileID INT(10), fileName VARCHAR(50), itemID VARCHAR(10), dateAdded DATETIME, PRIMARY KEY (fileID))', (err,result) => {
  if (err) throw err;
  console.log('Created WebScript Files');
});

db.query('CREATE TABLE WebScriptInitialise (numberOfWeeks VARCHAR(10), PRIMARY KEY (numberOfWeeks))', (err,result) => {
  if (err) throw err;
  console.log('Created WebScript Initialise');
});

db.query('CREATE TABLE WebF2Weeks (weekID VARCHAR(10), weekName VARCHAR(10), weekLocation VARCHAR(10), dateAdded DATETIME, PRIMARY KEY (weekID))', (err,result) => {
  if (err) throw err;
  console.log('Created WebF2 Weeks');
});

db.query('CREATE TABLE WebF2Items (itemID VARCHAR(10), itemContent VARCHAR(240), itemLocation VARCHAR(10), dateAdded DATETIME, PRIMARY KEY (itemID))', (err,result) => {
  if (err) throw err;
  console.log('Created WebF2 Items');
});

db.query('CREATE TABLE WebF2Files (fileID INT(10), fileName VARCHAR(50), itemID VARCHAR(10), dateAdded DATETIME, PRIMARY KEY (fileID))', (err,result) => {
  if (err) throw err;
  console.log('Created WebF2 Files');
});

db.query('CREATE TABLE WebF2Initialise (numberOfWeeks VARCHAR(10), PRIMARY KEY (numberOfWeeks))', (err,result) => {
  if (err) throw err;
  console.log('Created WebF2 Initialise');
});

db.query('CREATE TABLE GUDEWeeks (weekID VARCHAR(10), weekName VARCHAR(10), weekLocation VARCHAR(10), dateAdded DATETIME, PRIMARY KEY (weekID))', (err,result) => {
  if (err) throw err;
  console.log('Created GUDE Weeks');
});

db.query('CREATE TABLE GUDEItems (itemID VARCHAR(10), itemContent VARCHAR(240), itemLocation VARCHAR(10), dateAdded DATETIME, PRIMARY KEY (itemID))', (err,result) => {
  if (err) throw err;
  console.log('Created GUDE Items');
});

db.query('CREATE TABLE GUDEFiles (fileID INT(10), fileName VARCHAR(50), itemID VARCHAR(10), dateAdded DATETIME, PRIMARY KEY (fileID))', (err,result) => {
  if (err) throw err;
  console.log('Created GUDE Files');
});

db.query('CREATE TABLE GUDEInitialise (numberOfWeeks VARCHAR(10), PRIMARY KEY (numberOfWeeks))', (err,result) => {
  if (err) throw err;
  console.log('Created GUDE Initialise');
});

db.query('CREATE TABLE INSEWeeks (weekID VARCHAR(10), weekName VARCHAR(10), weekLocation VARCHAR(10), dateAdded DATETIME, PRIMARY KEY (weekID))', (err,result) => {
  if (err) throw err;
  console.log('Created INSE Weeks');
});

db.query('CREATE TABLE INSEItems (itemID VARCHAR(10), itemContent VARCHAR(240), itemLocation VARCHAR(10), dateAdded DATETIME, PRIMARY KEY (itemID))', (err,result) => {
  if (err) throw err;
  console.log('Created INSE Items');
});

db.query('CREATE TABLE INSEFiles (fileID INT(10), fileName VARCHAR(50), itemID VARCHAR(10), dateAdded DATETIME, PRIMARY KEY (fileID))', (err,result) => {
  if (err) throw err;
  console.log('Created INSE Files');
});

db.query('CREATE TABLE INSEInitialise (numberOfWeeks VARCHAR(10), PRIMARY KEY (numberOfWeeks))', (err,result) => {
  if (err) throw err;
  console.log('Created INSE Initialise');
});

db.query('CREATE TABLE ADPROCWeeks (weekID VARCHAR(10), weekName VARCHAR(10), weekLocation VARCHAR(10), dateAdded DATETIME, PRIMARY KEY (weekID))', (err,result) => {
  if (err) throw err;
  console.log('Created ADPROC Weeks');
});

db.query('CREATE TABLE ADPROCItems (itemID VARCHAR(10), itemContent VARCHAR(240), itemLocation VARCHAR(10), dateAdded DATETIME, PRIMARY KEY (itemID))', (err,result) => {
  if (err) throw err;
  console.log('Created ADPROC Items');
});

db.query('CREATE TABLE ADPROCFiles (fileID INT(10), fileName VARCHAR(50), itemID VARCHAR(10), dateAdded DATETIME, PRIMARY KEY (fileID))', (err,result) => {
  if (err) throw err;
  console.log('Created ADPROC Files');
});

db.query('CREATE TABLE ADPROCInitialise (numberOfWeeks VARCHAR(10), PRIMARY KEY (numberOfWeeks))', (err,result) => {
  if (err) throw err;
  console.log('Created ADPROC Initialise');
});

db.query('CREATE TABLE User1Units (unitID INT(10) NOT NULL AUTO_INCREMENT, unitName VARCHAR(20), dateAdded DATETIME, PRIMARY KEY (unitID))', (err,result) => {
  if (err) throw err;
  console.log('Created User1 Units');
});

db.query('CREATE TABLE User2Units (unitID INT(10) NOT NULL AUTO_INCREMENT, unitName VARCHAR(20), dateAdded DATETIME, PRIMARY KEY (unitID))', (err,result) => {
  if (err) throw err;
  console.log('Created User2 Units');
});

db.query("INSERT INTO WebScriptWeeks VALUES ('week101', 'week1', 'pos101', CURRENT_TIMESTAMP()), ('week102', 'week2', 'pos102', CURRENT_TIMESTAMP()), ('week103', 'week3', 'pos103', CURRENT_TIMESTAMP()), ('week104', 'week4', 'pos104', CURRENT_TIMESTAMP()), ('week105', 'week5', 'pos105', CURRENT_TIMESTAMP()), ('week106', 'week6', 'pos106', CURRENT_TIMESTAMP())", (err,result) => {
  if (err) throw err;
  console.log('Added weeks into WebScript');
});

db.query("INSERT INTO WebScriptItems VALUES ('resrc101', 'N/A', 'week101', CURRENT_TIMESTAMP()), ('note101', 'First half of lecture assigned to Jacek<div><br><div>Second half assigned to Rich</div></div>', 'week101', CURRENT_TIMESTAMP()), ('topic101', 'Promises', 'week101', CURRENT_TIMESTAMP()), ('lectr101', 'Rich', 'week102', CURRENT_TIMESTAMP()), ('topic102', 'REST', 'week103', CURRENT_TIMESTAMP()), ('room101', 'Buckingham 1.01', 'week103', CURRENT_TIMESTAMP()), ('lectr102', 'Jacek', 'week105', CURRENT_TIMESTAMP()), ('room102', 'Lion Gate 0.14a', 'week105', CURRENT_TIMESTAMP()), ('topic103', 'Web Sockets', 'items', CURRENT_TIMESTAMP())", (err,result) => {
  if (err) throw err;
  console.log('Added items into WebScript');
});

db.query('INSERT INTO WebScriptFiles (fileID, fileName, itemID, dateAdded) VALUES ("1", "promises.js", "resrc101", CURRENT_TIMESTAMP())', (err,result) => {
  if (err) throw err;
  console.log('Added files into WebScript');
});

db.query("INSERT INTO WebScriptInitialise VALUES ('0')", (err,result) => {
  if (err) throw err;
  console.log('Initialised WebScript');
});

db.query("INSERT INTO WebF2Weeks VALUES ('week101', 'week1', 'pos101', CURRENT_TIMESTAMP()), ('week102', 'week2', 'pos102', CURRENT_TIMESTAMP()), ('week103', 'week3', 'pos103', CURRENT_TIMESTAMP()), ('week104', 'week4', 'pos104', CURRENT_TIMESTAMP()), ('week105', 'week5', 'pos105', CURRENT_TIMESTAMP())", (err,result) => {
  if (err) throw err;
  console.log('Added weeks into WebF2');
});

db.query("INSERT INTO WebF2Items VALUES ('topic101', 'Protocols', 'week101', CURRENT_TIMESTAMP()), ('resrc101', 'N/A', 'week101', CURRENT_TIMESTAMP()), ('topic102', 'SEO', 'week103', CURRENT_TIMESTAMP()), ('note101', 'Meta tags<div>Reciprocal links</div><div>Dynamic content</div>', 'week103', CURRENT_TIMESTAMP()), ('room101', 'Buckingham 0.07', 'week105', CURRENT_TIMESTAMP()), ('topic103', 'XML', 'items', CURRENT_TIMESTAMP()), ('lectr101', 'Ann', 'items', CURRENT_TIMESTAMP())", (err,result) => {
  if (err) throw err;
  console.log('Added items into WebF2');
});

db.query('INSERT INTO WebF2Files (fileID, fileName, itemID, dateAdded) VALUES ("1", "email protocols PPT.pptx", "resrc101", CURRENT_TIMESTAMP())', (err,result) => {
  if (err) throw err;
  console.log('Added files into WebF2');
});

db.query("INSERT INTO WebF2Initialise VALUES ('0')", (err,result) => {
  if (err) throw err;
  console.log('Initialised WebF2');
});

db.query("INSERT INTO GUDEWeeks VALUES ('week101', 'week1', 'pos101', CURRENT_TIMESTAMP()), ('week102', 'week2', 'pos102', CURRENT_TIMESTAMP()), ('week103', 'week3', 'pos103', CURRENT_TIMESTAMP())", (err,result) => {
  if (err) throw err;
  console.log('Added weeks into GUDE');
});

db.query("INSERT INTO GUDEItems VALUES ('topic101', 'Prototypes', 'week101', CURRENT_TIMESTAMP()), ('note101', 'Visual Basic<div>Balsamiq</div><div>Marvel</div>', 'items', CURRENT_TIMESTAMP()), ('resrc101', 'N/A', 'items', CURRENT_TIMESTAMP())", (err,result) => {
  if (err) throw err;
  console.log('Added items into GUDE');
});

db.query('INSERT INTO GUDEFiles (fileID, fileName, itemID, dateAdded) VALUES ("1", "Mobile Prototype 5.png", "resrc101", CURRENT_TIMESTAMP())', (err,result) => {
  if (err) throw err;
  console.log('Added files into GUDE');
});

db.query("INSERT INTO GUDEInitialise VALUES ('0')", (err,result) => {
  if (err) throw err;
  console.log('Initialised GUDE');
});

db.query("INSERT INTO INSEWeeks VALUES ('week101', 'week1', 'pos101', CURRENT_TIMESTAMP()), ('week102', 'week2', 'pos102', CURRENT_TIMESTAMP()), ('week103', 'week3', 'pos103', CURRENT_TIMESTAMP()), ('week104', 'week4', 'pos104', CURRENT_TIMESTAMP()), ('week105', 'week5', 'pos105', CURRENT_TIMESTAMP())", (err,result) => {
  if (err) throw err;
  console.log('Added weeks into INSE');
});

db.query("INSERT INTO INSEItems VALUES ('note101', '<div>User and system requirements</div><div><br></div><div>Functional requirements</div><div><br></div><div>Non-functional requirements</div>', 'week102', CURRENT_TIMESTAMP()), ('topic101', 'Specification', 'week102', CURRENT_TIMESTAMP()), ('note102', 'Maintenance<div>Testing</div>', 'week104', CURRENT_TIMESTAMP()), ('topic102', 'Testing', 'week104', CURRENT_TIMESTAMP()), ('room101', 'Richmond LT1', 'items', CURRENT_TIMESTAMP())", (err,result) => {
  if (err) throw err;
  console.log('Added items into INSE');
});

db.query("INSERT INTO INSEInitialise VALUES ('0')", (err,result) => {
  if (err) throw err;
  console.log('Initialised INSE');
});

db.query("INSERT INTO ADPROCWeeks VALUES ('week101', 'week1', 'pos101', CURRENT_TIMESTAMP()), ('week102', 'week2', 'pos102', CURRENT_TIMESTAMP()), ('week103', 'week3', 'pos103', CURRENT_TIMESTAMP())", (err,result) => {
  if (err) throw err;
  console.log('Added weeks into ADPROC');
});

db.query("INSERT INTO ADPROCItems VALUES ('note101', 'Elementary data types<div><br><div>Compound data types</div></div>', 'week102', CURRENT_TIMESTAMP()), ('topic101', 'Data types', 'week102', CURRENT_TIMESTAMP()), ('resrc101', 'N/A', 'items', CURRENT_TIMESTAMP())", (err,result) => {
  if (err) throw err;
  console.log('Added items into ADPROC');
});

db.query('INSERT INTO ADPROCFiles (fileID, fileName, itemID, dateAdded) VALUES ("1", "lecture09 names, binding and scopes.ppt", "resrc101", CURRENT_TIMESTAMP())', (err,result) => {
  if (err) throw err;
  console.log('Added files into ADPROC');
});

db.query("INSERT INTO ADPROCInitialise VALUES ('0')", (err,result) => {
  if (err) throw err;
  console.log('Initialised ADPROC');
});

db.query("INSERT INTO User1Units VALUES ('', 'WebScript', '2018-03-26 10:35:21'), ('', 'WebF2', '2018-03-28 11:17:53'), ('', 'GUDE', CURRENT_TIMESTAMP())", (err,result) => {
  if (err) throw err;
  console.log('Added units for User1');
});

db.query("INSERT INTO User2Units VALUES ('', 'INSE', '2018-03-30 15:46:08'), ('', 'ADPROC', CURRENT_TIMESTAMP())", (err,result) => {
  if (err) throw err;
  console.log('Added units for User2');
});

db.query("CREATE TABLE userLogin (userID INT, username VARCHAR(30) NOT NULL, userEmail VARCHAR(60) NOT NULL, password VARCHAR(25) NOT NULL, PRIMARY KEY (userID))", (err,result) => {
  if (err) throw err;
  console.log('Created user login table');
});

db.query("INSERT INTO userLogin VALUES (1, 'User1', 'user1@tlp.com','lecturer18'), (2, 'User2', 'user2@tlp.com','planner18')", (err,result) => {
  if (err) throw err;
  console.log('Added accounts to user login');
  console.log('Database initialisation complete');
  process.exit(0);
});
