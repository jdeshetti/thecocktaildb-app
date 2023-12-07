console.log("Welcome to TheCockTail Search App");
console.log( axios );

//Creating a cocktailsearch object and storing all the required parameters and functions here

const cocktailSearch = {

  config: {
    COCKTAILDB_BASE_URL: 'https://www.thecocktaildb.com/api/json/v1/1/search.php?',
    COCKTAILDB_DETAILED_URL: 'https://www.thecocktaildb.com/api/json/v1/1/lookup.php?'
  },

  dom: {},

  initUi(){

    this.dom = {
      searchForm: document.querySelector( '#searchForm' ),
      searchText: document.querySelector( '#searchText' ),
      searchResults: document.querySelector( '#cocktailresults' ),
      cocktailDetails: document.querySelector( '#cocktaildetails' )
    }; //end of this.dom

    console.log( this.dom.searchForm );//to check this.dom information

    //handling the searchForm by addeventListener

    this.dom.searchForm.addEventListener('submit', ev => {
      ev.preventDefault(); //to stop reloading the page
      this.loadSearchResults( this.dom.searchText.value);
    })//to submit an event in serachForm

    this.dom.searchText.focus();

    this.dom.searchResults.addEventListener('click', ev => {
      console.log(`clicked image:`, ev.target.dataset.id);//to check the ID is displaying?
      this.loadCocktailDetails( ev.target.dataset.id);
      
    }); //cocktailimg click result handler




  }, // end of initUi function

  loadSearchResults( searchText ){

    console.log( `Text in loadsearchResults:`, searchText );//to check the serachForm is taking input or not

    axios.get( this.config.COCKTAILDB_BASE_URL, {
      params: {
        s: searchText

      }
    })
      .then( res => {
        console.log( 'data:', res.data.drinks);//to check the drinks data
        this.renderSearchResults( res.data.drinks);
      })
      .catch( err => {
        console.warn('Please search again with the correct drink name', err );
        //to display message to user in DOM if no serach wa sfound
      });

  }, //end of loadSearchResults

  renderSearchResults( drinks ){

    console.log( `in renderSearchResults:`, drinks );

    this.dom.searchResults.replaceChildren(); // clear (loading message)
    
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

  
  
  
  
  // Adjust the loadCocktailDetails function
  loadCocktailDetails(id) {
    axios.get(this.config.COCKTAILDB_DETAILED_URL, {
      params: {
        i: id
      }
    })
      .then(res => {
        console.log( 'data:', res.data.drinks[0]);//to check the drinks data
        if (res.data.drinks) {
        this.renderCocktailDetails(res.data.drinks[0]); // Assuming only one drink is returned
        } else {
        console.warn('No details found for this cocktail ID:', id);
        }
      })
      .catch(err => {
      console.warn('Error fetching cocktail details:', err);
      });
  },

  // Adjust the renderCocktailDetails function to handle a single drink object
  renderCocktailDetails(drink) {
    this.dom.searchResults.style.display = 'none';
    this.dom.cocktailDetails.style.display = 'block';
    this.dom.cocktailDetails.innerHTML = ''; // Clear previous details

    const headingTag = document.createElement('h2');
    headingTag.innerHTML = drink.strDrink;
    this.dom.cocktailDetails.appendChild(headingTag);

  
  
    const categoryTag = document.createElement('p');
    categoryTag.innerHTML = `Category: ${drink.strCategory}`;
    this.dom.cocktailDetails.appendChild(categoryTag);
  

    // Display the image
    const imgNode = document.createElement('img');
    imgNode.src = drink.strDrinkThumb;
    imgNode.alt = drink.strDrink;
    this.dom.cocktailDetails.appendChild(imgNode);
  },
}; // cocktailSearch main app object


cocktailSearch.initUi();

