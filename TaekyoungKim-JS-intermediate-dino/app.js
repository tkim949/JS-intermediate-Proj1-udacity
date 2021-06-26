   "use strict";
   /*
   Taekyoung Kim
   Due date: May 17th 2021
   Dinosaurs project for JavaScript Intermediate NanoDegree
   Used the given starter code from Udacity!
   */
    
    //Create the basic Constructor for both human and dino
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
    function Basic(species, weight, height, diet) {
        this.species = species;
        this.weight = weight;
        this.height = height;
        this.diet = diet;
    }
    
    // Create Dino Constructor
    function Dino(species, weight, height, diet, where, when, fact) {
        Basic.call(this, species, weight, height, diet)
        this.where = where;
        this.when = when;
        this.fact = fact;

    }

    // Create Dino Objects and Array

    function createDinoArray(dinos) {
        var dinoArr = new Array();
        dinos.forEach((dino) => {
            const dinoObj = new Dino(
                dino.species, 
                dino.weight,
                dino.height,
                dino.diet,
                dino.where,
                dino.when,
                dino.fact,
            )
            dinoArr.push(dinoObj);
        });
        return dinoArr;
    }


    // Create Human Object
    function Human(name, weight, height, diet) {
        //human is species' title, not the person's name from the form.
        Basic.call(this, "human", weight, height, diet);
        this.name = name;
    }

    // Use IIFE to get human data from form
    function getHumanFromForm() {
        return (function() {
            const name = document.getElementById("name").value;
            const heightFeet = Number(document.getElementById("feet").value);
            const heightInches = Number(document.getElementById("inches").value);
            const weight = Number(document.getElementById("weight").value);
            const diet = document.getElementById("diet").value;

            return new Human(name, weight, heightFeet * 12 + heightInches, diet);
        })();
    }

    // Create Dino Compare Method 1
    // NOTE: Weight in JSON file is in lbs, height in inches. 
    function compareWeight(dino) {
        const dinoWeight = Number(dino.weight);
        const humanWeight = getHumanFromForm().weight;
        
        if(dinoWeight > humanWeight) {
            return `${dino.species} is heavier than ${getHumanFromForm().name}!`;
        }else if(dinoWeight < humanWeight) {
            return `${dino.species} is lighter than ${getHumanFromForm().name}!`;
        }else{
            return `${dino.species} and ${getHumanFromForm().name} are the same weight`;
        }

    }

    // Create Dino Compare Method 2
    // NOTE: Weight in JSON file is in lbs, height in inches.
    function compareHeight(dino) {
        const dinoHeight = Number(dino.height);
        const humanHeight = getHumanFromForm().height;
        //let compHt = "have the same height";
        if(dinoHeight > humanHeight) {
            return `${dino.species} is taller than ${getHumanFromForm().name}!`;
        }else if(dinoHeight < humanHeight) {
            return `${dino.species} is shorter than ${getHumanFromForm().name}!`;
        }else {
            return `${dino.species} and ${getHumanFromForm().name} have the same height`;
        }
        
    }

    
    // Create Dino Compare Method 3
    // NOTE: Weight in JSON file is in lbs, height in inches.
    function compareDiet(dino) {

        if(dino.diet === getHumanFromForm().diet.toLowerCase()) {
            return `You both have same diet`;
        }else {
            return `You are ${getHumanFromForm().diet} and ${dino.species} is ${dino.diet}`;
        }
    }

    // Generate Tiles for each Dino in Array
    // Add tiles to DOM
    function createTile(creature) {
        const tile = document.createElement('div');
        tile.classList.add('grid-item');
        tile.innerHTML = `<h3>${creature.species}</h3>
                           <img src="images/${creature.species.toLowerCase()}.png" alt="image of ${creature.species}"/>`;
        if(creature.species !== "Pigeon" && creature instanceof Dino) {
            const facts = [
                    creature.fact,
                    compareWeight(creature),
                    compareHeight(creature),
                    compareDiet(creature)
            ];
            let idx = Math.floor(Math.random()* facts.length);
            tile.innerHTML += `<p>${facts[idx]}</p>`;
        }else if(creature.species === "Pigeon") {
            tile.innerHTML += `<p>${creature.fact}</p>`;
        }
        document.getElementById('grid').appendChild(tile);
    }
    //Generate Grid of Tiles
    // Remove form from screen
    function createGrid(array) {
        array.forEach(obj => createTile(obj));
        document.getElementById('dino-compare').style.display = 'none';
        document.getElementById('grid').style.display = 'flex';
    }   

    //Get whole array that consists human and dinos
    //get the grid randomly generated every time.
    //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    //Fisher–Yates shuffle with ES6
    function getWholeArray(array) {
        
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.slice(0,4).concat(getHumanFromForm()).concat(array.slice(4,8));

    }

let dinoArray = [];

// get the Dinos info from dino.json file
//https://stackoverflow.com/questions/65731429/fetch-api-cannot-load-url-scheme-must-be-http-or-https-for-cors-request
fetch("dino.json")
    .then(response => response.json())
    .then(data => dinoArray = createDinoArray(data.Dinos))
    .catch(err => console.log(`${err}: Cannot get info from dino.json`));

// On button click, prepare and display infographic
document.getElementById('btn').addEventListener("click", () => {
    const wholeArr = getWholeArray(dinoArray);
    createGrid(wholeArr);
});   