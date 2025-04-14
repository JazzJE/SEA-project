// array that will store all the book objects
let bookArray = [];

// array that will store all the indices of the book objects already displayed
let displayedBooksIndices = [];

// array that will store all the categories possible book objects indices stored in displayedBooksIndices
let categoryOptions = [];

// initialize arrays and event listener
document.addEventListener("DOMContentLoaded", init());

// initialization function
async function init()
{
  // parse the dataset and assin to bookArray
  bookArray = await parseBooks();

  // event listener so when user clicks on the filter input, the value is cleared for them to type
  const categoryInput = document.getElementById('categoryInput');
  categoryInput.addEventListener('click', function ()
  {
    this.value = '';
  });

  // initialize a batch cards for when website first loads
  addCards();
}

// parse the json into the project
async function parseBooks() 
{
  try {
    const response = await fetch("Amazon_popular_books_dataset.json");
    const bookObjectArray = await response.json();

    // only get the relevant fields for each book
    modifiedBookObjectArray = bookObjectArray.map(book =>
      (
        {
          ISBN: book.ISBN10 ?? "N/A",
          price: book.final_price ?? "unknown",
          imageURL: book.image_url,
          rating: book.rating,
          reviewsCount: book.reviews_count ?? "N/A",
          title: book.title,
          url: book.url,
          author: book.brand ?? "N/A",
          category: book.categories[1],
        }
      )
    )
    return modifiedBookObjectArray;
  } catch {
    alert("[ERROR] Failed to load the dataset! Please refresh.");
  }
}

// function to update the cards that should be displayed
function showCards() 
{
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
  const templateCard = document.querySelector(".card");

  // display every book that has an index stored as an element inside of the displayedBooksIndices array
  for (let i = 0; i < displayedBooksIndices.length; i++) 
  {
    const nextCard = templateCard.cloneNode(true); // Copy the template card
    editCardContent
    (
      {
        card: nextCard, 
        ISBN: bookArray[displayedBooksIndices[i]].ISBN, 
        imageURL: bookArray[displayedBooksIndices[i]].imageURL, 
        title: bookArray[displayedBooksIndices[i]].title,
        author: bookArray[displayedBooksIndices[i]].author,
        category: bookArray[displayedBooksIndices[i]].category,
        price: bookArray[displayedBooksIndices[i]].price,
        rating: bookArray[displayedBooksIndices[i]].rating,
        reviewsCount: bookArray[displayedBooksIndices[i]].reviewsCount,
        url: bookArray[displayedBooksIndices[i]].url,
      }
    ); // edit the card to have the book object i's information stored as an element of displayedBooksIndices
    cardContainer.appendChild(nextCard); // add the new card to the container
  }

  // update the category input to only consider the displayed cards categories
  updateCategoryDropdown();
}

// function to delete the last card and redisplay
function removeLastCard() 
{
  // check if there actually are any cards being displayed
  if (displayedBooksIndices.length == 0)
  {
    alert("[ERROR] There are no cards currently displayed!");
  }

  // else, continue to remove the last card and re-render the cards
  else
  {
    displayedBooksIndices.pop();
    showCards();
  }
}

// edit the inputted card
function editCardContent({card, imageURL, title, category, ISBN, price, rating, reviewsCount, url, author}) 
{
  card.style.display = "block";

  const cardHeader = card.querySelector("h2");
  cardHeader.textContent = title;

  const cardImage = card.querySelector("img");
  cardImage.src = imageURL;
  cardImage.alt = "'" + title + "'" + " Image";

  const list = card.querySelector("ul");

  const authorPoint = card.querySelector("li:nth-child(1)");
  authorPoint.innerHTML = '<b>Author:</b> ' + author;

  const categoryPoint = card.querySelector("li:nth-child(2)");
  categoryPoint.innerHTML = '<b>Category:</b> ' + category;

  const ratingPoint = card.querySelector("li:nth-child(3)");
  ratingPoint.innerHTML = '<b>Rating: </b>' + rating;

  const reviewsPoint = card.querySelector("li:nth-child(4)");
  reviewsPoint.innerHTML = '<b>Number of Reviews: </b>' + reviewsCount;

  const ISBNPoint = card.querySelector("li:nth-child(5)");
  ISBNPoint.innerHTML = '<b>ISBN #: </b>' + ISBN;

  const pricePoint = card.querySelector("li:nth-child(6)");
  (price === null)? (pricePoint.innerHTML = '<b>Price (2022): </b>unknown'): (pricePoint.innerHTML = '<b>Price (2022): </b>$' + price);

  const purchaseButton = card.querySelector("button");

  // when the user clicks on the purchase button, send them to the relevant Amazon url to purchase
  purchaseButton.addEventListener
  (
    "click", 
    function() { window.open(url, '_blank')}
  );
}

// function to add ten cards to the display
function addCards()
{
  for (let j = 0; j < 10; j++)
  {
    
    // if all the cards are displayed, simply do nothing and output an error
    if (bookArray.length == displayedBooksIndices.length)
    {
      alert("[ERROR] All the cards are displayed!");
      break;
    }

    // else, add a card
    else
    {
      const cardContainer = document.getElementById("card-container");
      const templateCard = document.querySelector(".card");

      // generate a random book index within the range of the data set
      let rand = Math.floor(Math.random() * bookArray.length);

      // ensure that the random indice is not already an element inside of the displayedBooksIndices array
      // if already inside (ergo displayed), then reassign rand to a new book index and reperform if the new values is in the array
      for (let i = 0; i < displayedBooksIndices.length; i++)
      {
        if (rand == displayedBooksIndices[i])
        {
          rand = Math.floor(Math.random() * bookArray.length);
          i = -1;
        }
      }

      // add the random/new book index to the array of displayed indices
      displayedBooksIndices.push(rand);

      // create the new card with the random book index
      const nextCard = templateCard.cloneNode(true); // copy template
      editCardContent
      (
        {
        card: nextCard,
        ISBN: bookArray[rand].ISBN, 
        imageURL: bookArray[rand].imageURL, 
        title: bookArray[rand].title,
        author: bookArray[rand].author,
        category: bookArray[rand].category,
        price: bookArray[rand].price,
        rating: bookArray[rand].rating,
        reviewsCount: bookArray[rand].reviewsCount,
        url: bookArray[rand].url,
        }
      ); // edit the card with index rand's object
      cardContainer.appendChild(nextCard); // add new card to the container
    }
  }

  // update the category input to only consider the displayed cards categories
  updateCategoryDropdown();
}

// sort the displayed cards from lowest to highest price using linear sort
function sortByPrice()
{
  // this is a range value so that when objects with null prices are appended to the end of the displayedCardIndices list,
  // we can exclude these objects from being observed and sorted
  let sortRange = displayedBooksIndices.length;
  
  // place all the objects with unknown values for price at the end of the displayed cards, and decrease the range we will sort through
  for (let i = 0; i < sortRange; i++)
  {
    if (bookArray[displayedBooksIndices[i]].price == "unknown") 
    {
      displayedBooksIndices.push((displayedBooksIndices.splice(i, 1))[0]);
      i--;
      sortRange--;
    }
  }

  // use a linear sort to sort the books that we know from smallest to greatest in price
  for (let i = 0; i < sortRange - 1; i++)
  {
    // initialize the object with the smallest price as the index stored in the first element of the displayedBooksIndices array
    let minIndex = i;

    // for every subsequent indice stored as elements in displayedBooksIndices up to the sortRange,
    // check if the book indice is already displayed
    for (let j = i + 1; j < sortRange; j++)
    {
      if (bookArray[displayedBooksIndices[minIndex]].price > bookArray[displayedBooksIndices[j]].price) minIndex = j;
    }

    // swap function to switch the element that stores the index with the minimum price with the current element we are at
    let temp = displayedBooksIndices[i];
    displayedBooksIndices[i] = displayedBooksIndices[minIndex];
    displayedBooksIndices[minIndex] = temp;
    
  }

  // update the displayed cards
  showCards();
}

// update the dropdown menu to only include the categories of the book objects
function updateCategoryDropdown()
{
  const categoryDropdown = document.getElementById('categoryDropdown');
  categoryDropdown.innerHTML = "";

  // reset the categoryOptions
  categoryOptions.length = 0;

  // get all the categories that are possible within the displayedCards
  for (let i = 0; i < displayedBooksIndices.length; i++) if (!(categoryOptions.includes(bookArray[displayedBooksIndices[i]].category))) 
    categoryOptions.push(bookArray[displayedBooksIndices[i]].category);

  // for every displayed card category possible, create an option for it and append it to the dropdown menu
  for (let i = 0; i < categoryOptions.length; i++)
  {
    newOption = document.createElement("option");
    newOption.value = categoryOptions[i];
    categoryDropdown.appendChild(newOption);
  }

  // event listener for when the user inputs a value to filter with, where it is updated to only the categories of the displayedCards
  const categoryInput = document.getElementById('categoryInput');
  categoryInput.removeEventListener('input', filterBooks);
  categoryInput.addEventListener('input', filterBooks);
}

// filter the books based on the category inputted within the dropdown list and the categories that are possible in the categoryOptions
function filterBooks(obj)
  {
    const value = obj.target.value;

    // if the value inputted is inside of the categoryOptions, then get rid of all the objects indices
    // that are not of that value within the displayedBooksIndices array
    if (categoryOptions.includes(value))
      {
        for (let i = 0; i < displayedBooksIndices.length; i++)
        {
          if (bookArray[displayedBooksIndices[i]].category != value)
          {
            displayedBooksIndices.splice(i, 1);
            i--;
          }
        }

        // update the displayed cards
        showCards();
    }
  }