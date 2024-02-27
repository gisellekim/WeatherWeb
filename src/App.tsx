import { Provider } from "react-redux"
import { store } from "./store/store"
import "./App.css"
import { CityList } from "./components/CityList"

const App = () => {
  return (
    <Provider store={store}>
      <CityList />
    </Provider>
  )
}

export default App
