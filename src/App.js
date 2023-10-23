import React, { useState, useEffect } from 'react';
import './App.css';
import Search from './components/Search';
import RecipeList from './components/RecipeList';

function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [receipe, setReceipe] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [storedItems, setStoredItems] = useState([]);
  const [favoritedItems, setFavoritedItems] = useState([]);

  useEffect(() => {
    const storedItemsString = localStorage.getItem('selectedItems');
    if (storedItemsString) {
      const items = JSON.parse(storedItemsString);
      setStoredItems(items);
    }
    const favoritedItemsString = localStorage.getItem('favoritedItems');
    if (favoritedItemsString) {
      const items = JSON.parse(favoritedItemsString);
      setFavoritedItems(items);
    }

  }, []);


  const getReceipe = (query) => {
    fetch(`https://api.edamam.com/search?q=${query}&app_id=b5cc47cf&app_key=
    21ed60d6569e7fdf35e9a53b0c72fb30`)
      .then((response) => response.json())
      .then((data) => {
        setReceipe(data.hits);
        console.log(data.hits);
      });
  }

  const handleItemClick = (recipe) => {
    setSelectedItem(recipe);
  };

  const closePopup = () => {
    setSelectedItem(null);
  };

  const handleFavourite = () => {
    setShowFavorites(!showFavorites);
  }

  const favorite = (e, recipe) => {
    e.stopPropagation();
    const selectedItemString = JSON.stringify(recipe);

    const isFavorited = favoritedItems.some((item) => item.uri === recipe.uri);

    if (isFavorited) {
      const updatedItems = storedItems.filter((item) => item !== selectedItemString);
      localStorage.setItem('selectedItems', JSON.stringify(updatedItems));
      const updatedFavoritedItems = favoritedItems.filter((item) => item.uri !== recipe.uri);
      localStorage.setItem('favoritedItems', JSON.stringify(updatedFavoritedItems));
      setFavoritedItems(updatedFavoritedItems);
    } else {
      const updatedItems = [...storedItems, selectedItemString];
      localStorage.setItem('selectedItems', JSON.stringify(updatedItems));
      const updatedFavoritedItems = [...favoritedItems, recipe];
      localStorage.setItem('favoritedItems', JSON.stringify(updatedFavoritedItems));
      setFavoritedItems(updatedFavoritedItems);
    }
  };

  return (
    <>
       <Search onSearch={getReceipe} showFavorites={showFavorites} handleFavourite={handleFavourite} />
      <RecipeList
        receipe={receipe}
        favoritedItems={favoritedItems}
        onItemClick={handleItemClick}
        onFavorite={favorite}
      />

      {selectedItem && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>
              &times;
            </span>
            <img src={selectedItem.recipe.image} alt="" />
            <div className='contentss'>
              <h3>Recipe Details</h3>
              <p>{selectedItem.recipe.label}</p>
              <ol>
                {selectedItem.recipe.ingredients.map((ingredients) => (
                  <li key={selectedItem.recipe.ingredients.indexOf(ingredients)}>{ingredients.text}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}

      {showFavorites && (
        <div className="popup-fav">
          <div className='pops'>
          <span className="close" onClick={handleFavourite}>
            &times;
          </span>
          <h3>Favourites</h3>
          {favoritedItems.map((item) => (
            <div key={item.uri} className='itemss'>
              <img src={item.image} alt="" />
              <p>{item.label}</p>
              <button onClick={(e) => favorite(e, item)}>Remove</button>
            </div>
          ))}
          </div>
        </div>
      )}
    </>
  );
}

export default App;