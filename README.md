# ProjetEmoviz

Emoviz is a tool to evaluate the emotion of student, then they are working.
It's decomposed into two tools : 
 - Emore-L, which is situated here : projetEmoviz/public/Questionnaire 
 - CATE, situated here : projetEmoviz/public/Annotation
  
The first one use a ESM (experience sampling method) to ask the student their emotions.
The second one use a system of annotation, which ask their emotion then they annotate.

The two tools use nodejs, so you need to install it first (you can find documentation here : https://nodejs.org/en/).
If use multiple library, others than nodejs : 
 - SocketIo, that you can find here : http://socket.io/. It permit communication between the server and the user, but it permit too, to communication between user (not the user directly, the computer eh).
 - Express, that you can find here : http://expressjs.com/ . This library permit to manage our different link easily.
 - mysql, you can find a tutorial here: https://codeforgeek.com/2015/01/nodejs-mysql-tutorial/ . It permit to use a mysql db with the server.

With the package and all the library added, you have to precise your db server. You go on the file projetEmoviz, you open the file server.js. Find the variable connection, and add the user, password and database name.
Take care ! The DB must be formatate before. You can find the structure on the root of this project (sql file useable).

After changing this, you go on the root of projetEmoviz, and launch : nodejs server.js
And use your browser to display your different webpage. If your work on local, you have to go on 127.0.0.1:8080/webpage.
Don't miss the 8080, it's the port where you can enter.
Voila a list of link after 8080/ that you can enter :
 - /Questionnaire/login -> it's the ESM for the experimentation, you have to precise the name (it create an entry in the database, if not existant)
 - /visualisation/version01 -> from version 01 to 07 (you have to precise a number for page 02 and 07, like /visualisation/version02/10, 10 is the ID of your student, so if your student is not existant, the page will be blank)
  /visualisation -> resume with links all the version
 - /image/Presentation -> Page to present the experimentation for Cate. Link to the two document used by Cate. (in french)
 - /image/Solo/*/login -> the * represent the document used. Example : In projetEmoviz/public/ImageCours, you can find some files, like "ChapitreEmotions", it's what we used to complet the *. This link give you the possibility to write/erase or modify your annotations.
  Warning : for the moment, we use some precise format for our document.
 - /image/General/*/login -> Same than before. It's the general link, you can see all the annotation that you wrote, but also from your colleague. (no erase or modify possible).
 - /image/visualisation/login -> it permit you to watch all of your annotation on one page, without the rest of the document.
  
