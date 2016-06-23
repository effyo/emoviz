// Necessite nodejs

var fs = require('fs')
    , http = require('http')
    , socketio = require('socket.io') // documentation sur http://socket.io/
		, mysql = require('mysql')
		, express    = require("express");
//var plotly = require('plotly')("maxence.trannois", "vppmmiytwx"); // necessaire pour créer des graphiques au moyen de plotly
// Documentation de plotly disponible sur le site de plotly
// Si non utiliser, a enlever
// my bdd
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',// mdp pour la base de données sur vps : Sical01
  database : 'emotionBDD2'
});

// my server
var app = express();
// Donne accès depuis les pages HTML, au dossier public qui est compris dans le dossier
app.use('/public', express.static(__dirname + '/public'));


// Link des différentes pages créer
app.get('/Questionnaire/:nom', function (req, res) {
		res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/public/Questionnaire/index.html'));
});
app.get('/visualisation/version01/*', function (req, res) {
		res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/public/Questionnaire/VisualisationGen.html'));
});
app.get('/visualisation/version02/:nom', function (req, res) {
		res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/public/Questionnaire/VisualisationStarPlot.html'));
});
app.get('/visualisation/version03/*', function (req, res) {
		res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/public/Questionnaire/VisualisationBarChart.html'));
});
app.get('/visualisation/version04/*', function (req, res) {
		res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/public/Questionnaire/VisualisationStarPlotMoy.html'));
});
app.get('/visualisation/version05/*', function (req, res) {
		res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/public/Questionnaire/VisualisationAwareness.html'));
});
app.get('/visualisation/version06/*', function (req, res) {
		res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/public/Questionnaire/VisualisationPekrun.html'));
});
app.get('/visualisation/version07/:nom', function (req, res) {
		res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/public/Questionnaire/VisualisationBarChartIndi.html'));
});
app.get('/visualisation/*', function (req, res) {
		res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/public/explicationPage/redirectVisualisation.html'));
});
app.get('/image/Presentation', function (req, res) {
		res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/public/Annotation/presentationAnnotation.html'));
});
app.get('/image/general/*/:nom', function (req, res) {
		res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/public/Annotation/AnnotationImageGeneral.html'));
});
app.get('/image/Solo/*/:nom', function (req, res) {
		res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/public/Annotation/AnnotationImageSolo.html'));
});
app.get('/image/visualisation/pieChart', function (req, res) {
		res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/public/Annotation/VisualisationAnnotationEmotionMoyenne.html'));
});
app.get('/image/visualisation/*', function (req, res) {
		res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/public/Annotation/VisualisationAnnotation.html'));
});


app.get('/lienPerso/equipe/sical/', function (req, res) {
		res.writeHead(200, { 'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/public/explicationPage/intro.html')); // Ancienne version d'accès aux différentes page du site
    // enlever pour éviter que les élèves de l'expérience deux voient les données de la première expé
});

// Les deux prochaines fonctionnent permettent de définir la page par défaut. A changer oups.html pour changer la page d'erreur
app.get('*', function(req, res, next) {
  var err = new Error();
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  if(err.status !== 404) {
    return next();
  }
  res.writeHead(200, { 'Content-type': 'text/html'});
  res.end(fs.readFileSync(__dirname + '/public/explicationPage/oups.html'));
});
// On écoute le port ouvert 8080, a changer si on utilise un autre port
var server = http.createServer(app).listen(process.env.PORT || 8080);


// fonction d'écoute
socketio.listen(server).on('connection', function (socket) {	
		// fonction de remplissage de la bdd
			var identifiantUser = 0;
			
			//QUESTIONNAIRE
			
			//attend un message qui s'appelle "message", pour traiter l'info
    	socket.on('message', function (msg) {
		  	
		  		// vérifie si le nom existe déjà
					connection.query('SELECT ID FROM Identification WHERE nom =\"'+app.get('user')+'\";',function(err,rows){
						
							if(err) throw err;
							if (rows.length != 1){	//sinon le crée		
								connection.query('insert into Identification(Nom) values ("'+ app.get('user') +'")' );
							}
					});
				
					// requete sur la base mysql qui recherche l'id correspondant au nom
					connection.query('SELECT ID as myID FROM Identification WHERE nom =\"'+app.get('user')+'\";',function(err,rows){
							
							var myID = rows[0].myID;
							if(err) throw err;
						
						//Requete qui récupère le nombre de réponse pour l'ID, pour faire un ajout +1 dessus. C'est pour compter le nombre de fois que l'utilisateur a rempli le questionnaire
						connection.query( 'SELECT max(NBReponse) as numb FROM Questionnaire where IDNom=\"' + rows[0].ID+'\";', function(err2,rows2){
							var nbreponse = 1;
							if (rows2.length != 0) nbreponse = rows2[0].numb + 1;
							
							//fonction qui enregistre les données venant du questionnaire
							connection.query(
								'insert into Questionnaire (Q1,Q2,Q3,Q4,Q5,Q6_1,Q6_2,Q6_3,Q6_4,Q6_5,Q6_6,Q6_7,Q6_8,Q6_9,Q7,Q8,Q9,IDNom,NBReponse,day,beginTime,endTime,type,URL) values ("' + 
								 msg.Q1 + '", "' + 
								 msg.Q2 + '", "' + 
								 msg.Q3 + '", "' + 
								 msg.Q4 + '", "' + 
								 msg.Q5 + '", "' + 
								 msg.Q6_1+ '", "'+ 
								 msg.Q6_2+ '", "'+
								 msg.Q6_3+ '", "'+
								 msg.Q6_4+ '", "'+
								 msg.Q6_5+ '", "'+ 
								 msg.Q6_6 + '", "'+ 
								 msg.Q6_7 + '", "'+ 
								 msg.Q6_8 + '", "'+ 
								 msg.Q6_9 + '", "'+ 
								 msg.Q7 + '", "' + 
								 msg.Q8 + '", "' + 
								 msg.Q9 + '", "' + 
								 myID + '", "' + 
								 nbreponse + '", "' +
								 msg.day + '", "' + 
								 msg.timeBegin + '", "' + 
								 msg.timeEnd + '", "' + 
								 msg.type + '", "' + 
								 msg.URL+
								 '")'
				 			);
		  			});
		  	});
		  	});
		  	// fonction de récupération des données :
		  	socket.on('serverMessage', function ( response) {
		  		if (response =="Bonjour"){
						connection.query('SELECT * FROM Questionnaire',function(err,rows){
							if(err) throw err;
							socket.emit('bddMess', rows);
						});
					}
		  	});
		  	
		  	
		  	//ANNOTATION
		  	
		  	
		  	// Recherche toutes les annotations en relation avec une personne (version perso)
		  	socket.on('askAnnotation', function (data){
		  		connection.query('SELECT * FROM Annotation where login=\"' + data +'\";' ,function(err,rows){
							if(err) throw err;
							socket.emit('resultAnnotation', rows);
						});
		  	
		  	});
		  	
		  	// Recherche toutes les annotations (version classe)
		  	socket.on('askAnnotationAll', function (data){
		  		connection.query('SELECT * FROM Annotation ;' ,function(err,rows){
							if(err) throw err;
							socket.emit('resultAnnotationAll', rows);
						});
		  	
		  	});
		  	
		  	// Enregistre les traces de changement de page, pour faire des analyses
		  	socket.on('changePage', function (data){
					connection.query(
						'insert into changePage (direction,date,login) values ("' + 
						 data[0] + '", "' + 
						 data[1] + '", "' + 
						 data[2] + 
						 '")'
		 			);
		  	
		  	
		  	});
		  	
		  	//Rajoute une nouvelle annotation
		  	socket.on('annotationMessageServeur', function ( response) {
		  	
					connection.query(
								'insert into Annotation (text,src,height,width,x,y,login,emotion,time) values ("' + 
								 response.text + '", "' + 
								 response.src + '", "' + 
								 response.height + '", "' + 
								 response.width + '", "' + 
								 response.x + '", "' +
								 response.y + '", "' + 
								 response.login + '", "' +
								 response.emotion + '", "' +
								 response.time +
								 '")'
				 			);
				 		socket.broadcast.emit('annotationMessageClient', response);// envoi au utilisateur la nouvelle annotation, pour qu'il la rajoute
		  	});
		  	
		  	// Supprime une annotation
		  	socket.on('deleteAnnotationServeur', function ( response) {
		  		
					connection.query('DELETE from Annotation where Annotation.text = "'+response[0].text+ '"'+
					' AND Annotation.src = "'+ response[0].src + '"'+
					' AND Annotation.height = "'+response[0].height + '"'+
					' AND Annotation.width = "'+ response[0].width +'"'+
					' AND Annotation.x = "'+ response[0].x + '"'+
					' AND Annotation.y = "'+ response[0].y + '"'
					
					);
				 		socket.broadcast.emit('deleteAnnotationClient', response[1]);// Indique aux autres utilisateurs qu'il faut supprimer l'annotation
		  	});
		  	
		  	
		  	//Change une annotation
		  	socket.on('changeAnnotationServeur', function ( response) {
					
					
							
							connection.query('UPDATE Annotation set Annotation.text = \"'+response[0].text + '\"'+
						' where Annotation.src = \"'+ response[0].src + '\"'+
						' AND Annotation.height = \"'+response[0].height + '\"'+
						' AND Annotation.width = \"'+ response[0].width +'\"'+
						' AND Annotation.x = \"'+ response[0].x + '\"'+
						' AND Annotation.y = \"'+ response[0].y + '\" ;'
					
						);
						var data = new Array(response[1], response[0].text); // Recréer une valeur necessaire pour changer l'annotation.
					socket.broadcast.emit('changeAnnotationClient', data);// demande a changer l'annotation 
					
		  		
					
				 		
		  	});
		  	
		  	
		  	// On demande au serveur tout les annotations pour initialiser la page (fait la meme chose que la fonction plus haut, a changer ! 
		  	socket.on('askInit', function (response){
		  		connection.query('select * from Annotation', function(err,rows){
		  			if (err) throw err;
		  			socket.emit('answerInit',rows);
		  			//console.log("init");
		  		});  		
		  	});
		  	
		  	//Fonction créer pour faire un fichier CSV directement des réponses au questionnaire
				// Fonction old : a refaire pour correspondre au besoin
		  	/*
		  	socket.on('serverNest', function ( response) {
					createCSV(response);
					sendGraphics(response, socket);
		  			
		  	});*/
		  	
    	
});

    	// vraiment moche, a refaire
    	/* Fonction Plotly, créer pour s'amuser
    	function sendGraphics(nest, socket){
    		
    		
    		var moyQ6_1 =0;
    		var cptQ6_1 =0;
    		var moyQ6_2 =0;
    		var cptQ6_2 =0;
    		var moyQ6_3 =0;
    		var cptQ6_3 =0;
    		var moyQ6_4 =0;
    		var cptQ6_4 =0;
    		var moyQ6_5 =0;
    		var cptQ6_5 =0;
    		var moyQ6_6 =0;
    		var cptQ6_6 =0;
    		var moyQ6_7 =0;
    		var cptQ6_7 =0;
    		var moyQ6_8 =0;
    		var cptQ6_8 =0;
    		var moyQ6_9 =0;
    		var cptQ6_9 =0;
    		
    		for (var eachRow =0; eachRow<nest.length; eachRow++){
    			var rows = nest[eachRow]["values"];	
    			for (var i = 0; i <rows.length; i++) {
						if (rows[i]["Q6_1"] != 0){
							moyQ6_1 += rows[i]["Q6_1"];
							cptQ6_1++;
						}
						if (rows[i]["Q6_2"] != 0){
							moyQ6_2 += rows[i]["Q6_2"];
							cptQ6_2++;
						}
						if (rows[i]["Q6_3"] != 0){
							moyQ6_3 += rows[i]["Q6_3"];
							cptQ6_3++;
						}
						if (rows[i]["Q6_4"] != 0){
							moyQ6_4 += rows[i]["Q6_4"];
							cptQ6_4++;
						}
						if (rows[i]["Q6_5"] != 0){
							moyQ6_5 += rows[i]["Q6_5"];
							cptQ6_5++;
						}
						if (rows[i]["Q6_6"] != 0){
							moyQ6_6 += rows[i]["Q6_6"];
							cptQ6_6++;
						
						if (rows[i]["Q6_7"] > 0 && rows[i]["Q6_7"] < 8  ){
							moyQ6_7 += rows[i]["Q6_7"];
							cptQ6_7++;
						}
						if (rows[i]["Q6_8"] > 0 && rows[i]["Q6_8"] < 8){
							moyQ6_8 += rows[i]["Q6_8"];
							cptQ6_8++;
						}
						if (rows[i]["Q6_9"] > 0 && rows[i]["Q6_9"] < 8){
							moyQ6_9 += rows[i]["Q6_9"];
							cptQ6_9++;
						}
				  }
    		}
    		moyQ6_1 /= cptQ6_1;
    		moyQ6_2 /= cptQ6_2;
    		moyQ6_3 /= cptQ6_3;
    		moyQ6_4 /= cptQ6_4;
    		moyQ6_5 /= cptQ6_5;
    		moyQ6_6 /= cptQ6_6;
    		moyQ6_7 /= cptQ6_7;
    		moyQ6_8 /= cptQ6_8;
    		moyQ6_9 /= cptQ6_9;
    		var data = [
    			{
    				x : ["Plaisir", "Anxiete","Curiosité","Ennui","Engagement","Confusion","Surprise","Frustration","Neutre"],
    				y : [moyQ6_1, moyQ6_2,moyQ6_3, moyQ6_4,moyQ6_5, moyQ6_6,moyQ6_7, moyQ6_8, moyQ6_9],
    				type : "bar"
    			}
    		];
    		var graphOptions = {filename :"basic-bar", fileopt:"overwrite"};
    		plotly.plot(data, graphOptions, function (err, msg){
		  		socket.emit('graph', msg);
    		}); 	
    	};
 	}*/
 			// fichier CSV créer directement lors de l'accès sur une page.
    	function createCSV(nest){
				var wstream = fs.createWriteStream('myOutput.txt');
				wstream.write("NomUser ; IdUser ; nbreMess ; Jour ; BeginTime; endTime; Q1 ;  Q2  ;  Q3  ;  Q4  ;  Q5  ;  Q6_1 ;  Q6_2 ; Q6_3  ; Q6_4  ; Q6_5 ;  Q6_6 ; Q6_7  ;  Q6_8; Q6_9 ;  Q7  ;  Q8  ;  Q9 ; type;\n");
				
				for (var eachRow =0; eachRow<nest.length; eachRow++){
					
					var rows = nest[eachRow]["values"];	
					var cpt =0;		
					
					for (var i = 0; i <rows.length; i++) {
						cpt++;
						var temp = "";
						if (i==0) temp = rows[i]["login"];
						wstream.write(temp + ";" + eachRow + ";" + cpt +";"+rows[i]["Q1"] + ';' + rows[i]["Q2"] + ";" + rows[i]["Q3"] + ";" + rows[i]["Q4"] + ";" + rows[i]["Q5"] + ";" + rows[i]["Q6_1"] + ";" + rows[i]["Q6_2"] +";"+ rows[i]["Q6_3"] + ";" + rows[i]["Q6_4"] + ";"+ rows[i]["Q6_5"] + ";" + rows[i]["Q6_6"] +";"+ rows[i]["Q6_7"] + ";" + rows[i]["Q6_8"] +";"+ rows[i]["Q6_9"] +";" + rows[i]["Q7"] + ";" + rows[i]["Q8"] + ";" + rows[i]["Q9"] + ";"+ rows[i]["Day"]+ ";"+ rows[i]["beginTime"]+ ";"+ rows[i]["endTime"]+ ";"+ rows[i]["type"]+ ";"+ rows[i]["URL"] +";\n"
						);
				  }	
		   	}
		   wstream.end();
			};
