  
  //var globale
  var WIDTH = 900;
  var HEIGHT = 1100;
  var WIDTHIMG = 45;// taille des glyphes
  var HEIGHTIMG = 45;
  var tabTemp = new Array("Plaisir", "Anxiete", "Curiosite", "Ennui", "Engagement", "Confusion", "Surprise", "Frustration");//, "Neutre"
  var currentSelected = null; // necessaire a pour l'affichage des glyphes quand on passe la souris sur l'annotation
  var listAnnotation = new Array();// enregistrer les annotations, pour pouvoir les modifier facilement
  
  var CheminComplet = document.location.href;
	var NomDuFichier = CheminComplet.substring(CheminComplet.lastIndexOf( "/" )+1 ); // avoir le pseudonyme
	
	var count = 0;
	var pos = CheminComplet.indexOf('/');
	var listPos = new Array(); // Liste des positions des / dans la barre de recherche

	


	while (pos !== -1 ) {
		
		count++;
		listPos.push(pos);
		pos = CheminComplet.indexOf('/', pos + 1);
	}
	var nomDossier = CheminComplet.substring(listPos[listPos.length-2]+1, listPos[listPos.length-1] );// On recherche le nom du fichier
	
	
	/////////////////////////////////////////////////////////////////
	///Fonction de création de pop up (pour rajouter les glyphes)////
	/////////////////////////////////////////////////////////////////
	function pop(pos,namePop, parent) {
		var myPopUp = document.createElement('div');
		myPopUp.id = namePop;
		myPopUp.className = "mypopup";
		
		
		for (var emotion = 0; emotion<tabTemp.length;emotion++){
			
			
			var newEmotion = document.createElement("img");
			newEmotion.value = false;
			newEmotion.title = tabTemp[emotion];
			newEmotion.src = "/public/emoticone/emoticone_"+tabTemp[emotion]+".jpg";
			newEmotion.className = "myImg";
			newEmotion.width = WIDTHIMG;
			newEmotion.height = HEIGHTIMG;
			newEmotion.id = "emotion"+emotion;
			newEmotion.onclick = function changeEtat( that ){
			if (this.value){
				
				this.className = "myImg borderBlue";
				this.value = false;
			}else{
				this.className = "myImg borderRed";
				this.value = true;
			}
			};
			myPopUp.appendChild(newEmotion);
		
		}
		
		var myObjet = document.getElementById('mySpace');
		
		myPopUp.style.top = -17 ;
		myPopUp.style.left = 210 ;
		myPopUp.style.zIndex = 100;
		
		parent.appendChild(myPopUp);
		
	}
	/////////////////////////////////////////////////////////////////
	///Meme fonction mais pour la version survolage de l'annotation//
	/////////////////////////////////////////////////////////////////
	function popDef(parent, pos, tabEmotion, ajout){
		var myPopUp = document.createElement('div');
																																												
		myPopUp.className = "mypopup";
		
		
		for (var emotion = 0; emotion<tabTemp.length;emotion++){
		
			
			var newEmotion = document.createElement("img");
			newEmotion.value = false;
			newEmotion.src = "/public/emoticone/emoticone_"+tabTemp[emotion]+".jpg";
			newEmotion.className = "myImg borderBlack";
			newEmotion.width = WIDTHIMG;
			newEmotion.height = HEIGHTIMG;
			newEmotion.style.position = "relative";
			newEmotion.id = "emotion"+emotion;
			if (tabEmotion[emotion].value) {
				newEmotion.style.opacity = 0.5;
				newEmotion.title = tabTemp[emotion];
			}else {
				newEmotion.style.opacity = 0;
				newEmotion.style.display = "none";
			}
			myPopUp.appendChild(newEmotion);
		
		}
		
		
		
		myPopUp.style.top = pos.y*HEIGHT + ajout + 24 ;
		myPopUp.style.left = (pos.width+pos.x)*WIDTH + 2  ;
		myPopUp.style.zIndex = 5;
		parent.appendChild(myPopUp);
		return myPopUp;
	}	
	
	
	// décompose une chaine de caractère en tableau pour recréer une annotation
	function strtok (value){
			var cpt = 0;
			var pos = value.indexOf('/');
			var posPrec = 0;
			var res = new Array(); // c'est une liste des différentes emotions
			////
			var tabEmotion = new Array();
			for (var i = 0; i<tabTemp.length;i++){
				tabEmotion.push ({ value : false });
			
			}
	


			while (pos !== -1 ) {
				var resultSubString = value.substring(posPrec, pos);
				res.push(resultSubString);
				posPrec = pos + 1;
				pos = value.indexOf('/', pos + 1);
			}
			
			
			for (var i = 0; i<res.length;i++){
				tabEmotion[tabTemp.indexOf(res[i])].value = true;
			
			}
			return tabEmotion;	
		
		}
		// change le texte d'une annotation
		function changeAnnotation(pos,newValue){
			listAnnotation[pos].text = newValue;
			
		
		}
		
		
		// Recherche une annotation dans notre liste d'annotation
		function findAnnotation(annotation){
			for (var i = 0; i<listAnnotation.length;i++){
				if (annotation.shapes[0].geometry.x == listAnnotation[i][0].shapes[0].geometry.x &&
						annotation.shapes[0].geometry.y == listAnnotation[i][0].shapes[0].geometry.y &&
						annotation.shapes[0].geometry.height == listAnnotation[i][0].shapes[0].geometry.height &&
						annotation.shapes[0].geometry.width == listAnnotation[i][0].shapes[0].geometry.width &&
						annotation.shapes[0].geometry.src == listAnnotation[i][0].shapes[0].geometry.src)
						return i;
				
			}
			console.log("erreur");
			return -1;
		
		}
		// Reset le contour du pop up, necessaire pour éviter d'avoir un cadre lorsque l'on crée une nouvelle annotation
		function resetPopUp(myPopUp){
			var elementChildren = myPopUp[0].children;
			for (var i = 0; i < elementChildren.length; i++) {
					elementChildren[i].className = "myImg borderNull";
					elementChildren[i].value = false;
			}
		
		}
		/////////////////////////////////////////////////////////////////////////
		//////////////////////////////////init //////////////////////////////////
		/////////////////////////////////////////////////////////////////////////
		function initDocument(parent){
			
			for (var i = 1; i<15; i++){ // Façon simple de limiter le nombre page => on regarde la taille de l'image
				var myDiv = document.createElement("div");
					//myDiv.width = WIDTH;
					//myDiv.height = HEIGHT;
					myDiv.id = "anno"+i;
				var currentImage = document.createElement("img");
				if (i<10){
					currentImage.src = "/public/ImageCours/"+nomDossier+"/000" + i+".jpg";
				}
				else if (i<100)
					currentImage.src = "/public/ImageCours/"+nomDossier+"/00" + i+".jpg";
				else if (i<1000)
					currentImage.src = "/public/ImageCours/"+nomDossier+"/0" + i+".jpg";
			
			
					currentImage.className = "annotatable";
					currentImage.width = WIDTH;
					currentImage.height = HEIGHT;
					currentImage.style.zIndex = 10;
					myDiv.appendChild(currentImage);
					parent.appendChild(myDiv);
				
				
			
			}
		}
		//bouton refresh (rien de grandiose)
		function refresh(){
			document.location.reload();
		}	
