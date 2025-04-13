// array that will store all the book objects
let cardArray = [];

// array that will store all the indices of the book objects already displayed
let displayedCardsIndices = [];

// initialize arrays and relevant buttons
document.addEventListener("DOMContentLoaded", initializeCards());

// initialize the cards when the page is first loaded
async function initializeCards()
{
  // cardArray will store all each book as objects
  cardArray = await parseBooks();

  const categoryDropdown = document.getElementById('categoryDropdown');
  
  // get all the categories that are possible within the data set
  let categoryOptions = [];
  for (let i = 0; i < cardArray.length; i++) if (!(categoryOptions.includes(cardArray[i].category))) 
    categoryOptions.push(cardArray[i].category);

  // for every category possible, create an option for it and append it to the dropdown menu
  for (let i = 0; i < categoryOptions.length; i++)
  {
    newOption = document.createElement("option");
    newOption.value = categoryOptions[i];
    categoryDropdown.appendChild(newOption);
  }

  // event listener for when the user inputs a value to filter with, re-render the displayed cards only with those categories
  const categoryInput = document.getElementById('categoryInput');
  categoryInput.addEventListener('input', function() {
    if (categoryOptions.includes(this.value))
    {
      for (let i = 0; i < displayedCardsIndices.length; i++)
      {
        if (cardArray[displayedCardsIndices[i]].category != this.value)
        {
          displayedCardsIndices.splice(i, 1);
          i--;
        }
      }
      showCards();
    }

  })

  // initialize cards for when website first loads
  addCards();
}

// parse the json into the project
async function parseBooks() 
{
  const response = await fetch("Amazon_popular_books_dataset.json");
  const bookObjectArray = await response.json();

  // only get the relevant fields for our objects
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
}

// function to update the cards that should be displayed
function showCards() 
{
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
  const templateCard = document.querySelector(".card");

  // display every object that has an index stored as an element inside of the displayedCardsIndices array
  for (let i = 0; i < displayedCardsIndices.length; i++) 
  {
    const nextCard = templateCard.cloneNode(true); // Copy the template card
    editCardContent
    (
      {
        card: nextCard, 
        ISBN: cardArray[displayedCardsIndices[i]].ISBN, 
        imageURL: cardArray[displayedCardsIndices[i]].imageURL, 
        title: cardArray[displayedCardsIndices[i]].title,
        author: cardArray[displayedCardsIndices[i]].author,
        category: cardArray[displayedCardsIndices[i]].category,
        price: cardArray[displayedCardsIndices[i]].price,
        rating: cardArray[displayedCardsIndices[i]].rating,
        reviewsCount: cardArray[displayedCardsIndices[i]].reviewsCount,
        url: cardArray[displayedCardsIndices[i]].url,
      }
    ); // edit the card with relevant information
    cardContainer.appendChild(nextCard); // Add new card to the container
  }
}

// function to delete the last card and redisplay
function removeLastCard() 
{
  // check if there actually are any cards being displayed
  if (displayedCardsIndices.length == 0)
  {
    alert("[ERROR] There are no cards currently displayed!");
  }

  // else, continue to remove the last card and re-render the cards
  else
  {
    displayedCardsIndices.pop();
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
  cardImage.alt = title + " Image";

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
  (price === null)? (pricePoint.innerHTML = '<b>Price (2022): </b>unknown'): (pricePoint.innerHTML = '<b>Price (2022): </b>' + price);

  const purchaseButton = card.querySelector("button");

  // when the user clicks on the button, send them to the relevant Amazon url to purchase
  purchaseButton.addEventListener
  (
    "click", 
    function() { window.open(url, '_blank')}
  );

  console.log("new card:", title, "- html: ", card);
}

// function to add ten cards to the display
function addCards()
{
  for (let j = 0; j < 10; j++)
  {
    
    // if all the cards are displayed, simply do nothing and output an error
    if (cardArray.length === displayedCardsIndices.length)
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
      let rand = Math.floor(Math.random() * cardArray.length);

      // ensure that the random book indice is not already an element inside of the displayedCardsIndices array
      // if already displayed, then reassign rand to a new index and reperform check through the array
      for (let i = 0; i < displayedCardsIndices.length; i++)
      {
        if (rand == displayedCardsIndices[i])
        {
          rand = Math.floor(Math.random() * cardArray.length);
          i = -1;
        }
      }

      // add the new book index to the array of displayed indices
      displayedCardsIndices.push(rand);

      // create the new card with the book index
      const nextCard = templateCard.cloneNode(true); // Copy the template card
      editCardContent
      (
        {
        card: nextCard,
        ISBN: cardArray[rand].ISBN, 
        imageURL: cardArray[rand].imageURL, 
        title: cardArray[rand].title,
        author: cardArray[rand].author,
        category: cardArray[rand].category,
        price: cardArray[rand].price,
        rating: cardArray[rand].rating,
        reviewsCount: cardArray[rand].reviewsCount,
        url: cardArray[rand].url,
        }
      ); // display the rand object
      cardContainer.appendChild(nextCard); // Add new card to the container
    }
  }
}

// sort the displayed cards from lowest to highest price using linear sort
function sortByPrice()
{
  // this is a range value so that when objects with null prices are appended to the end of the displayedCardIndices list,
  // we can exclude these objects from being observed and sorted, displayed at the end of the sort
  let sortRange = displayedCardsIndices.length;
  
  // place all the objects with unknown values for price at the end of the displayed cards
  // also reduce the elements that we will thus sort and ignore these unknown prices by decreasing the sort range
  for (let i = 0; i < sortRange; i++)
  {
    if (cardArray[displayedCardsIndices[i]].price == "unknown") 
    {
      displayedCardsIndices.push((displayedCardsIndices.splice(i, 1))[0]);
      i--;
      sortRange--;
    }
  }

  // for all the values that we want to sort, use a linear sort to order them from smallest to greatest
  for (let i = 0; i < sortRange - 1; i++)
  {
    // initialize the object with the smallest price as the index stored in the first element of the displayedCardsIndices array
    let minIndex = i;

    // for every subsequent indice stored as elements in displayedCardsIndices from the minIndex to the sortRange
    // check if the object stored in the index element
    for (let j = i + 1; j < sortRange; j++)
    {
      if (cardArray[displayedCardsIndices[minIndex]].price > cardArray[displayedCardsIndices[j]].price) minIndex = j;
    }

    // swap function to switch the index stored in the (i)th element and the (minIndex)th element of the displayedCardsIndices
    let temp = displayedCardsIndices[i];
    displayedCardsIndices[i] = displayedCardsIndices[minIndex];
    displayedCardsIndices[minIndex] = temp;
  }

  // update the displayed cards
  showCards();
}