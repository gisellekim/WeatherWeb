import * as React from "react"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Typography from "@mui/material/Typography"
import { CardActionArea } from "@mui/material"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import HourglassDisabledIcon from "@mui/icons-material/HourglassDisabled"
import { Forecast } from "../../types/types"
import icons from "../../assets/icons.json"
import { getWeekDay } from "../../utils/getWeekDay"

type IconCardProps = {
  isCelsius: boolean
  forecast: Forecast
}

export const IconCard = ({ isCelsius, forecast }: IconCardProps) => {
  // Function to find the index of an icon by its code
  const findIconIndexByIconCode = (code: number | null): number => {
    return icons.findIndex((icon) => icon.code === code)
  }
  const iconIndex = findIconIndexByIconCode(forecast.condition.code)

  let faIconElement: JSX.Element | null = null

  if (iconIndex !== -1) {
    const { fa: faIcon, colour } = icons[iconIndex]
    faIconElement = (
      <FontAwesomeIcon
        sx={{ margin: "0 auto" }}
        icon={faIcon}
        style={{ color: colour }}
      />
    )
  } else {
    faIconElement = <HourglassDisabledIcon color="action" />
  }
  const day = () => {
    if (forecast.date) {
      const date = new Date(forecast.date)
      return getWeekDay(date)
    }
  }

  return (
    <Card
      sx={{
        width: "16%",
        boxSizing: "border-box",
        maxWidth: "5rem",
        m: "0.1rem",
        p: "0.1rem 0.5rem",
      }}
    >
      <CardActionArea>
        <CardContent sx={{ p: 0 }}>
          <Typography variant="overline" sx={{ display: "block" }}>
            {day()}
          </Typography>
          {faIconElement}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", lineHeight: "1rem", paddingTop: "0.5rem" }}
          >
            {forecast.condition.text}
          </Typography>

          <Typography
            variant="caption"
            color="primary"
            sx={{ display: "block", lineHeight: "1rem", paddingTop: "0.5rem" }}
          >
            {isCelsius
              ? `${forecast.mintemp_c} / ${forecast.maxtemp_c}`
              : `${forecast.mintemp_f} / ${forecast.maxtemp_f}`}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
