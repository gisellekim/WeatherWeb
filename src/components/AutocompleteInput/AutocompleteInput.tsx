import { useEffect, useState } from "react"
import axios from "axios"
import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import { CityOptions } from "../../types/types"

type AutocompleteInputProps = {
  errorMsg: string | null
  setErrorMsg: (msg: string | null) => void
  onChange: (value: string) => void
}

export const AutocompleteInput = ({
  errorMsg,
  setErrorMsg,
  onChange,
}: AutocompleteInputProps) => {
  const [options, setOptions] = useState<CityOptions>([])
  const [newValue, setNewValue] = useState<string | null>(null)
  //   const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const onInputChange = (value: string) => {
    setErrorMsg(null)
    setNewValue(value)
    onChange(value)
  }

  const fetchCityOptions = async (cityName: string) => {
    if (cityName.length < 3) {
      setErrorMsg("Please type minimum three letters.")
      return []
    }
    setErrorMsg(null)

    try {
      const res = await axios.get(
        `https://api.weatherapi.com/v1/search.json?key=8c92d711380c452d8b003154242202&q=${cityName}`
      )
      if (res.data) {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const cities = res.data.map((city: any) => ({
          name: city.name,
          country: city.country,
        }))
        if (cities.length === 0) {
          setErrorMsg("Please enter a valid city name.")
        }
        return cities
        //valid city
      }
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (err: any) {
      setErrorMsg(
        "This was an error while fetching a city list. Please try it again."
      )
      console.log("Error fetching city options: ", err)
      return []
    }
  }
  useEffect(() => {
    let timeout: any = null

    const getOptions = (newValue: string) => {
      timeout = setTimeout(async () => {
        setOptions(await fetchCityOptions(newValue))
      }, 500)
    }

    if (newValue) {
      getOptions(newValue)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [newValue])

  return (
    <Autocomplete
      freeSolo
      disableClearable
      options={options.map((option) => `${option.name}, ${option.country}`)}
      sx={{ width: "100%" }}
      onChange={(e: any) => onInputChange(e.target.textContent)}
      renderInput={(params) => (
        <TextField
          error={errorMsg ? true : false}
          {...params}
          helperText={errorMsg}
          onChange={(e) => onInputChange(e.target.value)}
          label="Enter a new city name"
          InputProps={{
            ...params.InputProps,
            type: "search",
          }}
        />
      )}
    />
  )
}
