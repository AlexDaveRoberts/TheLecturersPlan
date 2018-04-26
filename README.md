The Lecturer's Plan - UP822938
===============

The Lecturer's Plan - a web application for lecturers to be able to efficiently plan their units, lectures and practicals.



Installation
------------

To run The Lecturer's Plan, a server with Node.js and MySQL installed is required.

1. By using a FTP application, for example FileZilla, copy the folder: TheLecturersPlan, to the root public web directory.

2. To initialise the application for first use, change the current working directory to the application's directory by using: cd TheLecturersPlan;

3. Install all of the dependencies that the application relies on, by typing: npm install

4. Next, is to execute the database initialisation script, this creates the application's database, tables, and sample content to be displayed within the interface. To execute this script use the following command: npm run init

NB: The database connection file has the default credentials set, user: root, and password: root, if your login credentials differ, update these on both lines 6 and 7 in the connect.js file.

5. To start the web server for the application use: npm run start

6. Navigate to the IP address of the web server, and you should be presented with the landing page for The Lecturer's Plan.



Initialised User Accounts
-------------------------

If you would like to view user accounts which contain sample data they are as follows:

| Email         | Password   |
| ------------- |:----------:|
| user1@tlp.com | lecturer18 |
| user2@tlp.com | planner18  |

You can create a new account by using the Registration system, linked from the Landing page.



More Information
----------------

For more information, visit the Help section located with a link from the sidebar or by using CTRL+H from the Main Dashboard which explains all of the features of The Lecturer's Plan.
