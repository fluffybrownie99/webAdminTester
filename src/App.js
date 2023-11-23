import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [cocktail, setCocktail] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // ... (rest of your imports and App function)

  const fetchData = async () => {
    try {
      const response = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php');
      const drinkData = response.data.drinks[0]; // The API wraps the drink data in a 'drinks' array.

      // Extract ingredients and measures
      const ingredients = [];
      const measures = [];
      for (let i = 1; i <= 15; i++) { // Assume there will not be more than 15 ingredients.
        if (drinkData[`strIngredient${i}`]) {
          ingredients.push(drinkData[`strIngredient${i}`]);
          measures.push(drinkData[`strMeasure${i}`] || ""); // Use an empty string if no measure is provided.
        }
      }

      // Now, you can update your state with this structured information
      setCocktail({
        name: drinkData.strDrink,
        image: drinkData.strDrinkThumb,
        glass: drinkData.strGlass,
        instructions: drinkData.strInstructions,
        ingredients, // Array of ingredients
        measures // Corresponding array of measures
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const getIngredients = (cocktailData) => {
    return cocktailData.ingredients.map((ingredient, index) => {
      const measure = cocktailData.measures[index];
      return (
        <li className="list-group-item list-group-item-action" key={ingredient}>
          {measure} {ingredient}
        </li>
      );
    });
  };



  return (
    <div className="container mt-5 text-center">
      {cocktail ? (
        <div className="card">
          <button className="btn btn-primary" onClick={fetchData}>
            Get New Cocktail
          </button>
          <h1>{cocktail.name}</h1>
          <img src={cocktail.image} alt={cocktail.name} width='250' className="rounded mx-auto d-block" />
          <div className="recipe">

            <h3><br/>Glass Type:</h3>
            <p>{cocktail.glass}</p>
            <h3><br/>Ingredients:</h3>
            <ul className="list-group list-group-flush">
              {getIngredients(cocktail)}
            </ul>
          </div>
          <h3><br/>Recipe</h3>
          <p>{cocktail.instructions}</p>
        </div>
      ) : "Loading..."}
    </div>
  );
}

export default App;
