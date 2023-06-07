import React, {useState, useEffect, createContext} from 'react';

// Data
import {housesData} from "../data"

// Create context
export const HouseContext = createContext()



const HouseContextProvider = ({children}) => {

  const [houses, setHouses] = useState(housesData)
  const [country, setCountry] = useState("Location (any)")
  const [countries, setCountries] = useState([])
  const [property, setProperty] = useState("Property type (any)")
  const [properties, setProperties] = useState([])
  const [price, setPrice] = useState("Price range (any)")
  const [loading, setLoading] = useState(false)

  // return countries
  useEffect(() => {
    const allCountries = houses.map((house) => {
      return house.country
    })
    // Remove Duplicates
    const uniqueCountries = ["Location (any)", ...new Set(allCountries)]

    //set countries
    setCountries(uniqueCountries)
  }, [])

  // return properties
  useEffect(() => {
    const allProperties = houses.map((house) => {
      return house.type
    })
    // Remove Duplicates
    const uniqueProperties = ["Location (any)", ...new Set(allProperties)]

    //set countries
    setProperties(uniqueProperties)
  }, [])

  const handleClick = () => {
    // Set Loading 
    setLoading(true)
    // If the String includes "(any)":
    const isDefault = (str) => {
      return str.split(" ").includes("(any)")
    }
    console.log(isDefault(country))
    // get value of price min & max and parse it to number
    const minPrice = parseInt(price.split(" ")[0]) 
    const maxPrice = parseInt(price.split(" ")[2])

    const newHouses = housesData.filter(house => {
      const housePrice = parseInt(house.price)

      // If all values are selected 
      if(
        house.country === country &&
        house.type === property &&
        housePrice >= minPrice &&
        housePrice <= maxPrice
      ) {
        return house
      }

      // if all values are default
      if(
        isDefault(country) &&
        isDefault(property) &&
        isDefault(price)
      ) {
        return house
      }

      // if country is not default
      if(!isDefault(country) && isDefault(property) && isDefault(price)) {
        return house.country === country
      }

      // if property is not default 
      if(isDefault(country) && !isDefault(property) && isDefault(price)) {
        return house.type === property
      }

      // if price is not default
      if(isDefault(country) && isDefault(property) && !isDefault(price)) {
        if(housePrice >= minPrice && housePrice <= maxPrice) {
          return house
        }
      }

      // if country & property are not default
      if(!isDefault(country) && !isDefault(property) && isDefault(price)) {
        return house.country === country && house.type === property
      }
      
      // if country & price are not default
      if(!isDefault(country) && isDefault(property) && !isDefault(price)) {
        return house.country === country && housePrice >= minPrice && housePrice <= maxPrice
      }

      // if property & price are not default
      if(isDefault(country) && !isDefault(property) && !isDefault(price)) {
        return house.type === property && housePrice >= minPrice && housePrice <= maxPrice
      }
    })

    setTimeout(() => {
      return newHouses.length < 1 ? setHouses([]) :
      setHouses(newHouses),
      setLoading(false)
    }, 1000)
  }
  return (
    <HouseContext.Provider value={{
      houses,
      country,
      setCountry,
      countries,
      property,
      setProperty,
      properties,
      price,
      setPrice,
      loading,
      handleClick
    }}>
      {children}
    </HouseContext.Provider>
  );
};

export default HouseContextProvider;
