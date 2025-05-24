//************************************************************************************
// Pour commencer, on initialise un objet monstre avec les caractéristiques nécessaires
// Et fonctions utiles (decrémenter pts vie, changerAwake, ...)
//*************************************************************************************
let monstre = {
	name: "", // nom de steve
	life: 0, // points de vie 
	money: 0, // argent de steve
	awake: false, // état de sommeil
	premierePartie: true, // premiere partie (permet de ne lancer qu'une seule fois la fonction hasard dans la fonction go)

	ajoutVie: function(n) {this.life += n;}, // factorise l'ajout de vie pour steve

	ajoutArgent: function(n) {this.money += n;}, // factorise l'ajout de monnaie pour steve

	apteAction: function() {return this.life > 0 && this.awake;} // factorise la vérification à l'aptitude d'effectuer une action pour steve
};




//**********************************
// Declaration des fonctions du jeu
//**********************************
function init (n,l,m) {
	if (monstre.life<=0){
		monstre.name=n;
		monstre.life=l;
		monstre.money=m;
		monstre.awake=true;
		log("Le jeu démarre ! ");
	}	
}

function go () {
	init ("Steve", 40, 0); // On initialise steve avec son nom, 40 PV, 0 d'argent
	displayStatus(); // On met a jour l'affichage
	if(monstre.premierePartie){ // Lorsque c'est la premiere partie, on appel la fonction hasard toute les 12s
		setInterval(hasard, 12000);
	}
	monstre.premierePartie=false; // On change la première partie, donc la fonction hasard n'est pas appelée plusieurs fois en une partie
}

function run () {
	if (monstre.apteAction()) {
		monstre.ajoutVie(-1);
		log("Steve court : -1 vie");
		hit(); // On joue l'animation lorsque steve perd des points de vie
		document.getElementById('run').play(); // on joue le son correspondant
		displayStatus();
		return
	}
	log("Steve ne peut pas courir");
}


function fight () {
	if (monstre.apteAction() && monstre.life>=3) { // on ne fait rien si steve a moins de 3 point de vie
		monstre.ajoutVie(-3); // On retire 3 points de vie
		log("Steve s'est battu : -3 vie");
		hit(); // On affiche "l'animation" losque steve perd de la vie
		document.getElementById('hit').play();
		displayStatus();
		return
	}
	log("Steve ne peut pas se battre");
}


function work () {
	if (monstre.apteAction()){
		monstre.ajoutVie(-1);
		monstre.ajoutArgent(2);
		log("Steve mine : -1 vie, +2 XP");
		hit();
		document.getElementById('work').play(); // on joue le son correspondant
		displayStatus();
		return
	}
	log("Steve ne peut pas miner");
}


function sleep () {
	if(monstre.apteAction()){
		monstre.awake=false; // On endort steve
		log("Steve s'est endormi");
		setTimeout(() => { // permet d'ajouter un timer de 7s et de le revéiller ensuite
			monstre.awake=true;
			log("Steve s'est réveillé : +1 vie");
			monstre.ajoutVie(1);
			displayStatus();
		}, 7000);
		return
	}
	log("Steve ne peut pas dormir");
}


function eat () {
	if (monstre.apteAction() && monstre.money>=3){ // on vérifie si il peut manger et si il a assez d'argent
		monstre.ajoutVie(2); 
		monstre.ajoutArgent(-3);
		log("Steve a mangé : +2 vie, -3 XP");
		document.getElementById('eat').play(); // On joue le son correspondant
		displayStatus();
		return
	}
	log("Steve ne peut pas manger");
}


function show() {
	log(`Steve possède ${monstre.life} points de vie et ${monstre.money} XP.`);
}


function kill() { // On met tout simplement la vie et l'argent de steve a 0
	monstre.life=0;
	monstre.money=0;
	log("Steve est mort");
	displayStatus();
	document.getElementById('hit').play();
}


function hasard() {
	let action = [run, eat, work, fight, sleep]; // On stock à un index différent chaque fonction dans un tableau
	if(monstre.apteAction()){
		action[Math.floor(Math.random()*action.length)](); // On accède a une fonction dans un index aléatoire
		displayStatus();
	}
	
}


// On effectue la recherche de l'element du DOM une seule fois pour une meilleure performance
let actionBox = document.getElementById("actionbox");
function log(message) {
  	let msg = monstre.life !== 0 ? message : "Steve est mort";

  	let p = document.createElement("p");
  	p.textContent = msg;

  	actionBox.insertBefore(p, actionBox.firstChild);
}

function displayStatus() {
	document.getElementById("money").textContent = monstre.money; // On actualise l'argent de steve dans le DOM
	let vieActuelle=monstre.life; // On récupère la vie de steve
	if(vieActuelle>40){vieActuelle=40;} // On met un palier à 40 pv pour afficher la barre pleine en cas de surplus de points de vies
	let vie=document.getElementById("vie");
	// Formule permettant d'avoir tout les mutliples de 4 (de 0 à 40) permettant d'afficher la barre de vie correspondante
	vie.src = "img/coeur"+Math.floor(vieActuelle / 4) * 4 + ".png"; // ON affiche la bonne barre avec le nom de fichier correpondant
}





//*****************************************************************
// ajout d'une fonction bonus (Changement de couleur du personnage)
//*****************************************************************

// On effectue la recherche de l'element du DOM une seule fois pour une meilleure performance
let steveImg=document.getElementById('steveSkin');
function hit(){
	steveImg.src = "img/stevehit.png"; // On change l'image de base par l'image de steve qui prend des dégats
    setTimeout(() => {
      	steveImg.src = "img/steve.png"; // On remet l'image de base au bout de 0.5s
    }, 500);
}

//******************************
// Ajout des bouton fonctionnels
//******************************
document.getElementById("b1").addEventListener('click', go);
document.getElementById("b2").addEventListener('click', run);
document.getElementById('b3').addEventListener('click', fight);
document.getElementById('k').addEventListener('click', kill);
document.getElementById('b7').addEventListener('click', work);
document.getElementById('b5').addEventListener('click', eat);
document.getElementById('b6').addEventListener('click', show);
document.getElementById('b4').addEventListener('click', sleep);