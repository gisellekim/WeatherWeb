import { useEffect, useState } from "react"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import EditIcon from "@mui/icons-material/Edit"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import FavoriteIcon from "@mui/icons-material/Favorite"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import { City, Forecast } from "../../types/types"
import { IconCard } from "../IconCard"
import { AutocompleteInput } from "../AutocompleteInput"

type BasicCardProps = {
  key: number
  city: City
  toggleFavourite: (cityId: number) => void
  editingCity: number | null
  setEditingCity: (cityId: number | null) => void
  editCityName: (cityId: number) => void
  newCityName: string
  setNewCityName: (cityName: string) => void
  confirmCityName: (cityId: number, newCityName: string) => void
  inputErrorMsg: string | null
  setInputErrorMsg: (message: string | null) => void
  handleClickClose: (cityId: number) => void
}

export const BasicCard = ({
  key,
  city,
  toggleFavourite,
  editingCity,
  setEditingCity,
  editCityName,
  newCityName,
  setNewCityName,
  confirmCityName,
  inputErrorMsg,
  setInputErrorMsg,
  handleClickClose,
}: BasicCardProps) => {
  const [isCelsius, setIsCelsius] = useState<boolean>(true)
  const [localNewCityName, setLocalNewCityName] = useState<string>(newCityName)

  useEffect(() => {
    setLocalNewCityName(newCityName)
  }, [newCityName])

  const handleSetNewCityName = (newCityName: string) => {
    setInputErrorMsg(null)
    setNewCityName(newCityName)
    setLocalNewCityName(newCityName)
  }

  return (
    <Card key={key} sx={{ minWidth: "50%", p: "1.5rem", m: "1rem" }}>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          sx={{ minWidth: "32px" }}
          size="small"
          onClick={() => {
            toggleFavourite(city.id)
          }}
        >
          {city.isFavourite ? (
            <FavoriteIcon />
          ) : (
            <FavoriteBorderIcon color="action" />
          )}
        </Button>
        <Button sx={{ minWidth: "32px" }} size="small">
          {editingCity === city.id ? (
            <CheckIcon
              onClick={() => {
                if (
                  localNewCityName !== null &&
                  localNewCityName.length > 2 &&
                  inputErrorMsg === null &&
                  localNewCityName !== city.name
                ) {
                  confirmCityName(city.id, localNewCityName)
                }
              }}
            />
          ) : (
            <EditIcon
              color="action"
              onClick={() => {
                editCityName(city.id)
                setEditingCity(city.id)
                setInputErrorMsg(null)
              }}
            />
          )}
        </Button>
        <Button sx={{ minWidth: "32px" }} size="small">
          <CloseIcon
            color="action"
            onClick={() => {
              editingCity === city.id
                ? setEditingCity(null)
                : handleClickClose(city.id)
            }}
          />
        </Button>
      </CardActions>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {editingCity === city.id ? (
            <AutocompleteInput
              errorMsg={inputErrorMsg}
              setErrorMsg={setInputErrorMsg}
              onChange={handleSetNewCityName}
            />
          ) : (
            newCityName
          )}
        </Typography>
        <Typography variant="h5" component="div">
          {isCelsius
            ? city.temp_c !== null
              ? city.temp_c
              : "-"
            : city.temp_f !== null
            ? city.temp_f
            : "-"}
          &deg;
          {isCelsius ? "C" : "F"}
        </Typography>
        <Button size="small" onClick={() => setIsCelsius(!isCelsius)}>
          Switch to {isCelsius ? "Fahrenheit" : "Celsius"}
        </Button>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {city.forecasts.map((forecast: Forecast, index: number) => (
            <IconCard key={index} isCelsius={isCelsius} forecast={forecast} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
