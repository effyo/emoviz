jQuery.noConflict();
  $(function(){
  			
    var iosocket = io.connect();
    iosocket.emit('askInit',"Bonjour" ); // ask the serveur all the annotation
    
    //Init annotation
    iosocket.on('answerInit', function(rows){// catch the InitMessage from the serveur and initialize all the annotation on the page
    // a good change to do here, is to give the annotation relatate to the page
			
			var result = document.getElementById('result');
			
			for (var eachRow =0; eachRow<rows.length; eachRow++){
				createAnnotation(rows[eachRow]);
			}
		});
		//////////////////////////////////////////////////////////////////
		
		//function that react to the server
		/////////////////////////////////////////////////////////////////
    iosocket.on('annotationMessageClient', function(rows){// catch then a new annotation is coming (from another user)
				createAnnotation(rows);
			
		});
		iosocket.on('deleteAnnotationClient', function(rows){// catch then a annotation is deleted (by another user)
			anno.removeAnnotation(valueGlob[rows][0]);// enleve l'annotation
			valueGlob[rows][1].parentNode.removeChild(valueGlob[rows][1]); // enleve l'affichage emotionnel
			valueGlob.splice(rows, 1);// l'enleve du tableau
			
		});
		
		iosocket.on('changeAnnotationClient', function(rows){ // catch then a change is done (by another user)
		//0 => new annotation 1=> text of the old annotation
			
			changeAnnotation(rows[0],rows[1]);
		});
		//////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
		//////////////////////handler for annotation//////////////////////
		//////////////////////////////////////////////////////////////////
		//////////////////////////////////////////////////////////////////
		
     //////////////////////////////////////////////////////////////////
		////////////////////////save annotation////////////////////////////
		///////////////////////////////////////////////////////////////////
		anno.addHandler('onAnnotationCreated', function(annotation, event) {
			var parent = event.element.parentNode;
			var temp = parent.getElementsByClassName("annotorious-editor");
			var popUp = temp[0].getElementsByClassName("myPopUp");
			var eachEmotion = popUp[0].getElementsByClassName("myImg");
			var emotionRessenti = "";
			for (var j = 0; j<eachEmotion.length; j++){
				if (eachEmotion[j].value)
					
					emotionRessenti += tabTemp[j] + "/";
			
			}
			var date = new Date();
			
			var json = { 
    								text: annotation.text, 
    								src: annotation.src,
    								height: annotation.shapes[0].geometry.height,
    								width: annotation.shapes[0].geometry.width,
    								x: annotation.shapes[0].geometry.x,
    								y:annotation.shapes[0].geometry.y,
    								login : NomDuFichier,
    								emotion : emotionRessenti,
    								time : date
 								 };
				iosocket.emit('annotationMessageServeur',json);
				
				var numberPage = (json.src).substring(json.src.length - 8, json.src.length -4 );
				var parentByAnno = document.getElementById("anno" + parseInt(numberPage));
				
				/*var myValue = popDef(parentByAnno, json, eachEmotion, (parseInt(numberPage)-1)*HEIGHT);
				//var myValue = popDef(parent, json, eachEmotion,0);
				valueGlob.push(new Array(annotation,myValue));*/
				
				var entryValue = new Array();
				entryValue.push(parentByAnno);
				entryValue.push(json);
				entryValue.push(strtok(emotionRessenti));
				entryValue.push((parseInt(numberPage)-1)*HEIGHT);
				valueGlob.push(new Array(annotation,entryValue));
				resetPopUp(temp[0].getElementsByClassName("myPopUp"));
		});
		/////////////////////////////////////////////////////////////////////////
		///////////////////////////selection handler/////////////////////////////
		/////////////////////////////////////////////////////////////////////////
		anno.addHandler('onSelectionCompleted', function(event) {
			
			
			var myClass = (event.mouseEvent.target.parentNode).getElementsByClassName("annotorious-editor");
			var firstTime = myClass[0].getElementsByClassName("myPopUp");
			if (firstTime.length==0){
				pop(pos,"myPopUp",myClass[0]);
			}
			
		});
		
		/////////////////////////////////////////////////////////////////////////
		///////////////////////////onMouseOver handler///////////////////////////
		/////////////////////////////////////////////////////////////////////////
		anno.addHandler('onMouseOverAnnotation', function(annotation, event) {
			
			if (typeof annotation.C == "undefined"){
				currentSelected.parentNode.removeChild(currentSelected);
				currentSelected =null;
			
			}else{
				if (currentSelected != null)
					currentSelected.parentNode.removeChild(currentSelected);
				var temp = findAnnotation(annotation.C);
				
				currentSelected = popDef(valueGlob[temp][1][0], valueGlob[temp][1][1], valueGlob[temp][1][2], valueGlob[temp][1][3]);
			
			}
		});
		
		/////////////////////////////////////////////////////////////////////////
		///////////////////////////delete handler////////////////////////////////
		/////////////////////////////////////////////////////////////////////////
		
		anno.addHandler('onAnnotationRemoved', function(annotation) {
		
		// necessaire pour eviter d'avoir du rouge apres (si selection est faite)
			var parent = event.element.parentNode;
			var temp = parent.getElementsByClassName("annotorious-editor");
			var popUp = temp[0].getElementsByClassName("myPopUp");
			resetPopUp(popUp);
		
		
			var temp = findAnnotation(annotation);
			var CheminComplet = document.location.href;
			var NomDuFichier = CheminComplet.substring(CheminComplet.lastIndexOf( "/" )+1 );
			var json = { 
    								text: annotation.text, 
    								src: annotation.src,
    								height: annotation.shapes[0].geometry.height,
    								width: annotation.shapes[0].geometry.width,
    								x: annotation.shapes[0].geometry.x,
    								y:annotation.shapes[0].geometry.y,
    								login : NomDuFichier
 								 };
 								 
 			var tab = new Array(json,temp);
				iosocket.emit('deleteAnnotationServeur',tab);
				//console.log("hello");
				//console.log(valueGlob[temp][1]);
				//valueGlob[temp][1].parentNode.removeChild(valueGlob[temp][1]); // enleve l'affichage emotionnel
				valueGlob.splice(temp, 1);

		});
		/////////////////////////////////////////////////////////////////////////
		///////////////////////////updated handler///////////////////////////////
		/////////////////////////////////////////////////////////////////////////
		anno.addHandler('onAnnotationUpdated', function(annotation) {
		
			// necessaire pour eviter d'avoir du rouge apres (si selection est faite)
			var parent = event.element.parentNode;
			var temp = parent.getElementsByClassName("annotorious-editor");
			var popUp = temp[0].getElementsByClassName("myPopUp");
			resetPopUp(popUp);
			
			
			
			var pos = findAnnotation(annotation);
			var json = { 
    								text: annotation.text, 
    								src: annotation.src,
    								height: annotation.shapes[0].geometry.height,
    								width: annotation.shapes[0].geometry.width,
    								x: annotation.shapes[0].geometry.x,
    								y:annotation.shapes[0].geometry.y,
    								login : NomDuFichier
 								 };
 								 
 				var tab = new Array(json,pos); // Necessaire pour renvoyer l'annotation a tout les utilisateurs
				iosocket.emit('changeAnnotationServeur',tab);
				
		});
		function changePageSolo(){// Est necessaire ici pour atteindre iosocket
		
			iosocket.emit('changePage', new Array("goto solo",new Date(), NomDuFichier) );
			var blabla = CheminComplet.substring(0, listPos[listPos.length-3]+1 )+
													"Solo"+
													CheminComplet.substring(listPos[listPos.length-2], listPos[listPos.length] );
			this.location.href = blabla;
		}
				
});
