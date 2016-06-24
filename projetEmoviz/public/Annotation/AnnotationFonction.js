  
  //var globale
  var WIDTH = 900;
  var HEIGHT = 1100;
  var WIDTHIMG = 45;//size of glyph
  var HEIGHTIMG = 45;
  var tabTemp = new Array("Plaisir", "Anxiete", "Curiosite", "Ennui", "Engagement", "Confusion", "Surprise", "Frustration");//, "Neutre"
  var currentSelected = null; //needed to post the glyph then the mouse 
  var listAnnotation = new Array();// save annotation to deal with it easily
  
  var CheminComplet = document.location.href;
	var NomDuFichier = CheminComplet.substring(CheminComplet.lastIndexOf( "/" )+1 ); // to have th pseudonyme
	
	var count = 0;
	var pos = CheminComplet.indexOf('/');
	var listPos = new Array(); // list of each position of / on the website bar

	


	while (pos !== -1 ) {
		
		count++;
		listPos.push(pos);
		pos = CheminComplet.indexOf('/', pos + 1);
	}
	var nomDossier = CheminComplet.substring(listPos[listPos.length-2]+1, listPos[listPos.length-1] );// to have the name of the file (name of the document)
	
	
	/////////////////////////////////////////////////////////////////
	///function to create the popUp. First arg is for the position of the annotation
	// second one is for the name of the popUp. And third one is where we add it on the html page////
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
	///Same function but for the temp emotion, used then we pass (the mouse) on an annotation//
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
	
	
	// take a string corresponding to emotion, to put it on a usable form for display it
	function strtok (value){
			var cpt = 0;
			var pos = value.indexOf('/');
			var posPrec = 0;
			var res = new Array(); // list of the feeling
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
		// modify text of one annotation
		function changeAnnotation(pos,newValue){
			listAnnotation[pos].text = newValue;
			
		
		}
		
		
		// Find a specific annotation
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
		// Reset le box around a pop up
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
			
			for (var i = 1; i<15; i++){ // 15 is a limit for the number of page. Didn't find to count the number of page into a file
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
		//bouton refresh
		function refresh(){
			document.location.reload();
		}	
