import React from 'react'
import FormData from './Components/FormData'
import ListOfResult from './Components/ListOfResult'
import Header from './Components/Header'
import FilterData from './Components/FilterData'
import "./Styles/App.css"

function App() {
  return (
    <>
      <Header />
      <main>
        <FormData/>
        <ListOfResult />
        <FilterData />
      </main>
    </>
  );
}
export default App;