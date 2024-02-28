import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import AddIcon from "@mui/icons-material/Add"
import Button from "@mui/material/Button"
import CheckIcon from "@mui/icons-material/Check"
import CloseIcon from "@mui/icons-material/Close"
import { AutocompleteInput } from "../AutocompleteInput"

type AddCardProps = {
  newCityId: number
  creatingCity: number | null
  setCreatingCity: (cityId: number | null) => void
  newCityName: string | null
  setNewCityName: (cityName: string | null) => void
  confirmCityName: (cityId: number, newCityName: string | null) => void
  inputErrorMsg: string | null
  setInputErrorMsg: (message: string | null) => void
  handleClickClose: (cityId: number) => void
}

export const AddCard = ({
  newCityId,
  creatingCity,
  setCreatingCity,
  newCityName,
  setNewCityName,
  confirmCityName,
  inputErrorMsg,
  setInputErrorMsg,
  handleClickClose,
}: AddCardProps) => {
  const handleInputValueChange = (newCityName: string) => {
    setInputErrorMsg(null)
    setNewCityName(newCityName)
  }

  const defaultInput = (
    <AutocompleteInput
      errorMsg={inputErrorMsg}
      setErrorMsg={setInputErrorMsg}
      onChange={handleInputValueChange}
    />
  )

  return (
    <Card sx={{ minWidth: "50%", p: "1.5rem", m: "1rem" }}>
      {creatingCity !== null && (
        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button sx={{ minWidth: "32px" }} size="small">
            <CheckIcon
              onClick={() => {
                if (
                  newCityName !== null &&
                  newCityName.length > 2 &&
                  inputErrorMsg === null
                ) {
                  confirmCityName(newCityId, newCityName)
                }
              }}
            />
          </Button>
          <Button sx={{ minWidth: "32px" }} size="small">
            <CloseIcon
              color="action"
              onClick={() => handleClickClose(newCityId)}
            />
          </Button>
        </CardActions>
      )}
      <CardActions sx={{ display: "flex", justifyContent: "center" }}>
        {creatingCity !== null ? (
          defaultInput
        ) : (
          <Button size="large">
            <AddIcon
              color="action"
              onClick={() => {
                setCreatingCity(newCityId)
                setInputErrorMsg(null)
              }}
            />
          </Button>
        )}
      </CardActions>
    </Card>
  )
}
