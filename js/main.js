console.log("Welcome to TheCockTail Search App");
console.log( axios );

//Creating a cocktailsearch object and storing all the required parameters and functions here

const cocktailSearch = {

  config: {
    COCKTAILDB_BASE_URL: 'https://www.thecocktaildb.com/api/json/v1/1/search.php?'
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

      const drinkContainer = document.createElement('div'); // Create a container for each drink
    
      const titleNode = document.createElement('div'); // Create a div for the title
      titleNode.textContent = drink.strDrink; // Set the drink title text
      titleNode.classList.add('drink-title'); // Add a class for styling if needed
    
      const imgNode = document.createElement('img');
      imgNode.src = drink.strDrinkThumb + '/preview';
      imgNode.alt = drink.strDrink;
    
      drinkContainer.appendChild(titleNode); // Append title before the image
      drinkContainer.appendChild(imgNode); // Append the image
    
      this.dom.searchResults.appendChild(drinkContainer);

      

    } // each drink

  }, // end of renderSearchResults


























}; // cocktailSearch main app object


cocktailSearch.initUi();

