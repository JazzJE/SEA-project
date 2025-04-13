/**
 * Data Catalog Project Starter Code - SEA Stage 2
 *
 * This file is where you should be doing most of your work. You should
 * also make changes to the HTML and CSS files, but we want you to prioritize
 * demonstrating your understanding of data structures, and you'll do that
 * with the JavaScript code you write in this file.
 *
 * The comments in this file are only to help you learn how the starter code
 * works. The instructions for the project are in the README. That said, here
 * are the three things you should do first to learn about the starter code:
 * - 1 - Change something small in index.html or style.css, then reload your
 *    browser and make sure you can see that change.
 * - 2 - On your browser, right click anywhere on the page and select
 *    "Inspect" to open the browser developer tools. Then, go to the "console"
 *    tab in the new window that opened up. This console is where you will see
 *    JavaScript errors and logs, which is extremely helpful for debugging.
 *    (These instructions assume you're using Chrome, opening developer tools
 *    may be different on other browsers. We suggest using Chrome.)
 * - 3 - Add another string to the titles array a few lines down. Reload your
 *    browser and observe what happens. You should see a fourth "card" appear
 *    with the string you added to the array, but a broken image.
 *
 */

// array that will store all the card objects
let cardArray = [];

// array that will store all the card objects' indices already displayed; used so that we will not display the same card twice
let displayedCardsIndices = [];

// This calls the addCards() function when the page is first loaded
document.addEventListener("DOMContentLoaded", initializeCards());

// initialize the cards when the page is first loaded
async function initializeCards()
{
  // cardArray will store all the objects of each book
  cardArray = await parseBooks();

  // initialize event listener for filtering
  const categoryDropdown = document.getElementById('categoryDropdown');
  let categoryOptions = [];

  // get all the categories that are possible within the data set
  for (let i = 0; i < cardArray.length; i++) if (!(categoryOptions.includes(cardArray[i].category))) 
    categoryOptions.push(cardArray[i].category);

  // for every category possible, create an option for it and append it to the dropdown menu
  for (let i = 0; i < categoryOptions.length; i++)
  {
    newOption = document.createElement("option");
    newOption.value = categoryOptions[i];
    categoryDropdown.appendChild(newOption);
  }

  // when the user inputs a value to filter with, re-render the displayed cards only with those categories
  const categoryInput = document.getElementById('categoryInput');
  categoryInput.addEventListener('input', function() {
    if (categoryOptions.includes(this.value))
    {
      // if the object's category is not the same as the inputted one, then delete that object from the displayed cards list
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

  addCard();
}

// parse the json into the project
async function parseBooks() 
{
  // turn the json file into a list of numbers
  const response = await fetch("Amazon_popular_books_dataset.json");
  const bookObjectArray = await response.json();

  // only get the relevant fields for our objects
  modifiedBookObjectArray = bookObjectArray.map(book =>
    (
      {
        ISBN: book.ISBN10 ?? "N/A",
        price: book.final_price,
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

  // for each object that is should be displayed, display the object
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
    ); // display all the objects with the given indexes that are elements of the displayedCardsIndices array
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
// takes in ISBN, price, imageURL, rating, reviewsCount, title, url, category
function editCardContent({card, imageURL, title, category, ISBN, price, rating, reviewsCount, url, author}) 
{
  card.style.display = "block";

  const cardHeader = card.querySelector("h2");
  cardHeader.textContent = title;

  const cardImage = card.querySelector("img");
  cardImage.src = imageURL;
  cardImage.alt = title + " Poster";

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
  pricePoint.innerHTML = '<b>Price (2022): </b>$' + price;

  const purchaseButton = card.querySelector("button");
  purchaseButton.addEventListener
  (
    "click", 
    function() { window.open(url, '_blank')}
  );

  // You can use console.log to help you debug!
  // View the output by right clicking on your website,
  // select "Inspect", then click on the "Console" tab
  console.log("new card:", title, "- html: ", card);
}

// function to add card to the display
function addCard()
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

      // generate a random index (rand) within the range of the data set to be used to refer to the (rand)th example
      let rand = Math.floor(Math.random() * cardArray.length);

      // ensure that the random indice is not already inside of the displayedCardsIndices array, ergo already displayed
      // if already displayed, then reassign rand to a new index and reperform check through the array
      for (let i = 0; i < displayedCardsIndices.length; i++)
      {
        if (rand == displayedCardsIndices[i])
        {
          rand = Math.floor(Math.random() * cardArray.length);
          i = -1;
        }
      }

      // add the new card index to the array of displayed indices
      displayedCardsIndices.push(rand);

      console.log(displayedCardsIndices);

      // create the new card
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

// sort the displayed cards from lowest to highest price
function sortByPrice()
{
  
}