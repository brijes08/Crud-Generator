import React from 'react'
import Logoouter from "../welcomeAPIHUBouterdesign.png"
import Logoinner from "../welcomeAPIHUBinnerdesign.png"

const HomePage = () => {
  return (
    <div className="homepage">
      <div className="spinnnnnn">
        <img className="outerDesign" src={Logoouter} alt="" />
      </div>
      <img className="innerDesign" src={Logoinner} alt="" />
    </div>

  )
}

export default HomePage
