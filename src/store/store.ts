import { configureStore } from "@reduxjs/toolkit/react"
import { State, City, Forecast } from "../types/types"

const createForecast = (): Forecast => {
  return {
    date: null,
    maxtemp_c: null,
    maxtemp_f: null,
    mintemp_c: null,
    mintemp_f: null,
    condition: {
      text: "",
      code: null,
    },
  }
}

let cities: string[] = JSON.parse(localStorage.getItem("cityList") || "null")

if (!cities) {
  cities = []
  localStorage.setItem("cityList", JSON.stringify(cities))
}

const cityData: City[] = cities.map((city: string, index: number) => ({
  id: index,
  name: city,
  country: null,
  temp_c: null,
  temp_f: null,
  isFavourite: false,
  forecasts: new Array(7).fill(0).map(createForecast),
}))

const initialState: State = {
  cityList: cityData,
}

type Action = {
  type: string
  payload: City
}

const cityReducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case "TOGGLE_FAVOURITE":
      return {
        ...state,
        cityList: state.cityList.map((city) => {
          return city.id === action.payload.id
            ? { ...city, isFavourite: !city.isFavourite }
            : city
        }),
      }
    case "UPDATE_CITY":
      return {
        ...state,
        cityList: state.cityList.map((city) =>
          city.id === action.payload.id
            ? {
                ...city,
                name: action.payload.name,
                temp_c: action.payload.temp_c,
                temp_f: action.payload.temp_f,
                forecasts: action.payload.forecasts,
                isFavourite:
                  city.name === action.payload.name ? city.isFavourite : false,
              }
            : city
        ),
      }
    case "CREATE_CITY":
      return {
        ...state,
        cityList:
          state.cityList.length === action.payload.id
            ? [...state.cityList, action.payload]
            : state.cityList,
      }
    case "DELETE_CITY":
      return {
        ...state,
        cityList: state.cityList.filter(
          (city) => city.id !== action.payload.id
        ),
      }
    default:
      return state
  }
}

export const store = configureStore({ reducer: cityReducer })
