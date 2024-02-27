export type Forecast = {
  date: Date | null
  maxtemp_c: number | null
  maxtemp_f: number | null
  mintemp_c: number | null
  mintemp_f: number | null
  condition: {
    text: string
    code: number | null
  }
}

export type City = {
  id: number
  isFavourite: boolean
  name: string
  country: string | null
  temp_c: number | null
  temp_f: number | null
  forecasts: Forecast[]
}

export type State = {
  cityList: City[]
}

export type CityOption = {
  name: string | null
  country: string | null
}
export type CityOptions = CityOption[]
