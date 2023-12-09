//Creating a cocktailsearch object and storing all the required parameters and functions here

const cocktailSearch = {

  config: {
    COCKTAILDB_LATEST_URL: 'https://www.thecocktaildb.com/api/json/v2/9973533/latest.php',
    COCKTAILDB_BASE_URL: 'https://www.thecocktaildb.com/api/json/v1/1/search.php?',
    COCKTAILDB_DETAILED_URL: 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?'
  },

  dom: {},
  
  initUi(){

    this.dom = {
      latestCocktails: document.querySelector( '#latestCocktails' ),
      backToHomeButton: document.querySelector( '#backToHomeButton' ),
      backToSearchResults: document.querySelector( '#backToSearchResults' ),
      searchForm: document.querySelector( '#searchForm' ),
      searchText: document.querySelector( '#searchText' ),
      searchResults: document.querySelector( '#cocktailresults' ),
      cocktailDetails: document.querySelector( '#cocktaildetails' )
    }; //end of this.dom

    //to check this.dom information
    console.log( this.dom.latestCocktails );
    console.log( this.dom.searchForm );
    
    this.loadLatestCocktails();

    //handling the searchForm by addeventListener
    this.dom.searchForm.addEventListener('submit', ev => {
      ev.preventDefault(); //to stop reloading the page
      this.loadSearchResults( this.dom.searchText.value);
    })//to submit an event in serachForm

    this.dom.searchText.focus();

    this.dom.latestCocktails.addEventListener('click', ev => {
      if (ev.target.tagName === 'IMG') {
        console.log(`img clicked and ID is:`, ev.target.dataset.id);
        this.loadCocktailDetails(ev.target.dataset.id, true);
      }
    });
  
    this.dom.searchResults.addEventListener('click', ev => {
      if (ev.target.tagName === 'IMG') {
        console.log(`img clicked and ID is:`, ev.target.dataset.id);
        this.loadCocktailDetails(ev.target.dataset.id, false);
      }
    });


    }, // end of initUi function

    toggleSearchForm(enable) {
      this.dom.searchForm.style.display = enable ? 'block' : 'none';
    },

  loadLatestCocktails() {
    axios.get(this.config.COCKTAILDB_LATEST_URL)
      .then(res => {
        console.log(`latest cocktails data:`, res.data.drinks);
        //this.clearLatestResults();
        this.renderLatestCocktails(res.data.drinks);
      })
      .catch(err => {
        console.warn('Error fetching latest cocktails:', err);
      });
  }, //end of loadLatestCocktails


  renderLatestCocktails(drinks) {
    console.log(`latest drinks:`, drinks)
    const latestCocktailsHeading = document.createElement('h2');
    latestCocktailsHeading.textContent = 'Latest Cocktails';
    this.dom.latestCocktails.appendChild(latestCocktailsHeading);
      
    for (const drink of drinks) {
      console.log( drink.strDrink);//to check the title of the drink in the console
      const cocktailContainer = document.createElement('div');
      cocktailContainer.classList.add('cocktail-container');    

      const titleNode = document.createElement('h3');
      titleNode.textContent = drink.strDrink;

      const imgNode = document.createElement('img');
      imgNode.src = drink.strDrinkThumb;
      imgNode.alt = drink.strDrink;

      //we know the drinkid here and so we can use it to get ID when img clciked
      imgNode.dataset.id = drink.idDrink;
 
      cocktailContainer.appendChild(titleNode);
      cocktailContainer.appendChild(imgNode);

      this.dom.latestCocktails.appendChild(cocktailContainer);
    }
    
  },//end of renderLatestCocktails
 
  loadSearchResults( searchText ){

    console.log( `Text in loadsearchResults:`, searchText );//to check the serachForm is taking input or not

    axios.get( this.config.COCKTAILDB_BASE_URL, {
      params: {
        s: searchText
      }
    })
      .then( res => {
        console.log( 'data:', res.data.drinks);//to check the drinks data
        this.clearLatestResults(); // Clear the latest results before rendering new ones
        this.renderSearchResults( res.data.drinks);
        
        this.addBackToHomeButton(); // Back to home button after new search
      })
      .catch( err => {
        console.warn('Please search again with the correct drink name', err );
        //to display message to user in DOM if no serach wa sfound
      });

  }, //end of loadSearchResults

  addBackToHomeButton() {
    const backButton = document.createElement('button');
    backButton.textContent = 'Back to Home Page';
      backButton.addEventListener('click', () => {
        window.location.href = 'http://127.0.0.1:5500/index.html?'; // Replace 'index.html' with your homepage URL
      });
  
    this.dom.backToHomeButton.innerHTML = ''; // Clear previous content
    this.dom.backToHomeButton.appendChild(backButton);
  },

  clearLatestResults(){
    this.dom.latestCocktails.innerHTML = '';
  },

  renderSearchResults( drinks ){
    console.log( `in renderSearchResults:`, drinks );

    this.dom.searchResults.replaceChildren(); // clear loading message
    
    for( const drink of drinks ){

      console.log( drink.strDrink);//to check the title of the drink in the console
      console.log( drink.strDrinkThumb);//to check the thumbnilimg of the drink in the console

      const drinkContainer = document.createElement('div'); // Created a container for each drink
      drinkContainer.classList.add('drink-container');
    
      const titleNode = document.createElement('div'); // Created a div for the title
      titleNode.textContent = drink.strDrink; // Set the drink title text
      titleNode.classList.add('drink-title'); // Added a class for styling 
    
      const imgNode = document.createElement('img');//for the image
      imgNode.src = drink.strDrinkThumb + '/preview';//image source
      imgNode.alt = drink.strDrink;

      //we know the drinkid here and so we can use it to get ID when img clciked
      imgNode.dataset.id = drink.idDrink;
    
      drinkContainer.appendChild(titleNode); // Append title before the image
      drinkContainer.appendChild(imgNode); // Append the image
    
      this.dom.searchResults.appendChild(drinkContainer);      
    } // each drink

  }, // end of renderSearchResults
   
  loadCocktailDetails(id, isLatestCocktail = false) {
    this.toggleSearchForm(false);
    const url = isLatestCocktail ? this.config.COCKTAILDB_LATEST_URL : this.config.COCKTAILDB_DETAILED_URL;
  
    axios.get(url, {
        params: {
          i: id
        }
      })
      .then(res => {
        console.log('data:', res.data.drinks[0]); // Check the drinks data
        this.renderCocktailDetails(res.data.drinks[0]);
        
      })
      .catch(err => {
        console.warn('Error fetching cocktail details:', err);
      });
  },

  // renderCocktailDetails function to handle a single drink object
  renderCocktailDetails(drink) {
    
    this.dom.searchResults.style.display = 'none';
    this.dom.cocktailDetails.style.display = 'block';
    
    
    this.dom.cocktailDetails.innerHTML = ''; // Clear previous details
    this.dom.latestCocktails.innerHTML = '';// Clear previous details
    this.dom.backToHomeButton.innerHTML = '';//clear the backtohomebutton

    

    //created a div and stored in drinkcontainer and added cocktail-container lass
    const drinkContainer = document.createElement('div');
    drinkContainer.classList.add('cocktail-container');

    // created an image elementa and appended to drinkcontainer div and further appended to dom
    const imgNode = document.createElement('img');
    imgNode.src = drink.strDrinkThumb;
    imgNode.alt = drink.strDrink;
    drinkContainer.appendChild(imgNode);

    //Created a container for details of the cocktail
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('cocktail-details');

    //Add a coktail name
    const headingTag = document.createElement('h2');
    headingTag.innerHTML = drink.strDrink;
    detailsContainer.appendChild(headingTag);
    this.dom.cocktailDetails.appendChild(headingTag);

    // Display Tags
    if (drink.strTags) {
      const tagsSection = document.createElement('div');
      tagsSection.classList.add('tags-section');

      const tagsHeading = document.createElement('h3');
      tagsHeading.textContent = 'Tags:';
      tagsSection.appendChild(tagsHeading);

      const tagsText = document.createElement('p');
      tagsText.textContent = drink.strTags;
      tagsSection.appendChild(tagsText);

    detailsContainer.appendChild(tagsSection);
    }

    // Create a section for ingredients
    const ingredientsSection = document.createElement('div');
    ingredientsSection.classList.add('ingredients-section');

    const ingredientsHeading = document.createElement('h3');
    ingredientsHeading.textContent = 'Ingredients:';
    ingredientsSection.appendChild(ingredientsHeading);

    // Loop through ingredients and display them
    for (let i = 1; i <= 15; i++) {
      const ingredient = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];

      if (ingredient) {
        const ingredientItem = document.createElement('p');
        ingredientItem.textContent = `${measure ? measure + ' ' : ''}${ingredient}`;
        ingredientsSection.appendChild(ingredientItem);
      }
    }

    detailsContainer.appendChild(ingredientsSection);

    // Create a section for instructions
    const instructionsSection = document.createElement('div');
    instructionsSection.classList.add('instructions-section');

    const instructionsHeading = document.createElement('h3');
    instructionsHeading.textContent = 'Instructions:';
    instructionsSection.appendChild(instructionsHeading);

    const instructionsText = document.createElement('p');
    instructionsText.textContent = drink.strInstructions;
    instructionsSection.appendChild(instructionsText);

    detailsContainer.appendChild(instructionsSection);
    drinkContainer.appendChild(detailsContainer);

    this.dom.cocktailDetails.appendChild(drinkContainer);
    this.addBackToSearchButton();    
  },

  addBackToSearchButton() {
    const backToSearchButton = document.createElement('button');
    backToSearchButton.textContent = 'Back to Search Results';
    backToSearchButton.addEventListener('click', () => {
      
      this.dom.searchResults.style.display = 'block';
      this.dom.cocktailDetails.style.display = 'none';
      this.toggleSearchForm(true);
      this.addBackToHomeButton();
      this.hideBackToSearchButton(); // To hide the "Back to Search Results" button
    });

    this.dom.backToSearchResults.innerHTML = '';
    this.dom.backToSearchResults.appendChild(backToSearchButton);
  },

  hideBackToSearchButton() {
    this.dom.backToSearchResults.innerHTML = '';
  },

}; // cocktailSearch main app object

cocktailSearch.initUi();

