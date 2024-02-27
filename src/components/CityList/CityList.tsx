import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Helmet } from "react-helmet"
import { Box } from "@mui/material"
import axios from "axios"
import { City, Forecast, State } from "../../types/types"
import { BasicCard } from "../BasicCard"
import { AddCard } from "../AddCard"

export const CityList = () => {
  const cityList = useSelector((state: State) => state.cityList) // selector: data getter
  const dispatch = useDispatch() // dispatch: sending an Event
  const [newCityName, setNewCityName] = useState<string | null>(null)
  const [editingCity, setEditingCity] = useState<number | null>(null)
  const [creatingCity, setCreatingCity] = useState<number | null>(null)
  const [inputErrorMsg, setInputErrorMsg] = useState<string | null>(null)

  const editCityName = (cityId: number) => {
    setEditingCity(cityId)
    setInputErrorMsg(null)
  }

  const setInputError = (message: string | null) => {
    setInputErrorMsg(message)
  }

  const confirmCityName = async (
    cityId: number,
    newCityName: string | null
  ) => {
    setInputError(null)
    if (!newCityName || newCityName.trim() === "") {
      setInputError("Please enter a new city name.")
      return
    }

    const filteredNewCityName = newCityName.split(",")[0]
    const isExistingCityInTheCurrentWeatherList = cityList.some(
      (city) => city.name.toLowerCase() === filteredNewCityName!.toLowerCase()
    )

    if (isExistingCityInTheCurrentWeatherList) {
      setInputError("This city already exists in your list.")
      return
    }

    const newCityData = await fetchSingleCityData(filteredNewCityName!, cityId)

    if (!newCityData) {
      setInputError("Please enter a valid city name.")
      return
    }

    if (
      newCityData!.name.toLowerCase() === filteredNewCityName!.toLowerCase()
    ) {
      if (editingCity) {
        updateCity(newCityData!)
        setEditingCity(null)
      }
      if (creatingCity) {
        createCity(newCityData!)
        setCreatingCity(null)
      }
    }
  }

  const createCity = (city: City) => {
    setCreatingCity(cityList.length)
    dispatch({
      type: "CREATE_CITY",
      payload: city,
    })
  }

  const updateCity = (city: City) => {
    dispatch({
      type: "UPDATE_CITY",
      payload: city,
    })
  }

  const deleteCity = (cityId: number) => {
    dispatch({
      type: "DELETE_CITY",
      payload: { id: cityId },
    })
  }

  const toggleFavourite = (cityId: number) => {
    dispatch({ type: "TOGGLE_FAVOURITE", payload: { id: cityId } }) // payload: 운송물
  }

  const handleClickClose = (cityId: number) => {
    if (creatingCity) {
      setCreatingCity(null)
    } else {
      deleteCity(cityId)
    }
    setNewCityName(null)
    setInputError(null)
  }

  const fetchSingleCityData = async (cityName: string, index: number) => {
    try {
      const res = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=8c92d711380c452d8b003154242202&q=${cityName}&days=6&aqi=no&alerts=no`
      )
      if (res.data) {
        const forecasts: Forecast[] = res.data.forecast.forecastday.map(
          /* eslint-disable @typescript-eslint/no-explicit-any */
          (forecast: any) => ({
            date: forecast.date,
            maxtemp_c: forecast.day.maxtemp_c,
            maxtemp_f: forecast.day.maxtemp_f,
            mintemp_c: forecast.day.mintemp_c,
            mintemp_f: forecast.day.mintemp_f,
            condition: {
              text: forecast.day.condition.text,
              code: forecast.day.condition.code,
            },
          })
        )

        const result: City = {
          id: index,
          name: res.data.location.name,
          country: res.data.location.country,
          temp_c: res.data.current.temp_c,
          temp_f: res.data.current.temp_f,
          forecasts,
          isFavourite: false,
        }

        return result
      }
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (err: any) {
      console.log("Error fetching city weather: ", err)
      return null
    }
  }

  useEffect(() => {
    const fetchCityWeather = async () => {
      const newCityData = await Promise.all(
        cityList.map(async (city, index) =>
          fetchSingleCityData(city.name, index)
        )
      )
      const filteredWeatherData = newCityData.filter((city) => city !== null)

      filteredWeatherData.forEach((city) => {
        if (city) {
          updateCity(city)
        }
      })
    }
    fetchCityWeather()
  }, [])

  const sortedCityList = [...cityList].sort((a, b) => (b.isFavourite ? 1 : -1))

  return (
    <Box sx={{ maxWidth: "680px", m: "0 auto" }}>
      <Helmet>
        <title>
          {editingCity === null
            ? creatingCity === null
              ? "View all the weathers"
              : "Add a new city weather"
            : "Update the weather"}
        </title>
      </Helmet>
      <AddCard
        newCityId={cityList.length}
        creatingCity={creatingCity}
        setCreatingCity={setCreatingCity}
        newCityName={newCityName}
        setNewCityName={setNewCityName}
        confirmCityName={confirmCityName}
        inputErrorMsg={inputErrorMsg}
        setInputErrorMsg={setInputErrorMsg}
        handleClickClose={handleClickClose}
      />
      {sortedCityList.map((city) => (
        <BasicCard
          key={city.id}
          city={city}
          toggleFavourite={toggleFavourite}
          newCityName={city.name}
          setNewCityName={setNewCityName}
          editingCity={editingCity}
          setEditingCity={setEditingCity}
          editCityName={editCityName}
          confirmCityName={confirmCityName}
          inputErrorMsg={inputErrorMsg}
          setInputErrorMsg={setInputErrorMsg}
          handleClickClose={handleClickClose}
        />
      ))}
    </Box>
  )
}
