import React, { useEffect, useState } from "react";
import MainCategoriesCard from "./MainCategoriesCard";
import { useNavigate } from "react-router-dom";
import categories from '../../Images/categories.svg';
const MainCategoriesSection = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [mainCategoriesRec, setMainCategoriesRec] = useState();
  const navigate = useNavigate();
  const [isSuccess, setSuccess] = useState(false);
  useEffect(() => {
    if (isSuccess == false) {

      getMainCategoriesEvent();
    }

  })

  const getMainCategoriesEvent = async () => {
    //console.log('record found');
    let r = await fetch(`${apiUrl}getMainCategoriesEvent`, {
      method: "GET", headers: {
        "Content-Type": "application/json",
      }
    })

    let res = await r.json()
    if (r.ok) {
      setSuccess(true);
      setMainCategoriesRec(res.mainCategories);
      console.log('record found', res.mainCategories);
    }
  }

  return (
    <>

      <section className="py-16 px-6 md:px-20 ">
        <div className="col-7 categories-row">
          <div className="col-lg-1 col-3">
            <img
              className="section-header-img"
              loading="lazy"
              src={categories}
              alt="Upcoming Events Icon"
            />
          </div>
          <div className="col-lg-11 col-9">
            <h3 className="home-thicker home-header-text">Honeymoon & Family Trips</h3>
          </div>
        </div>
        <br></br>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">

          {isSuccess && mainCategoriesRec && (
            mainCategoriesRec.map((event, index) => (
              <MainCategoriesCard key={index} mainCategory={event} />
            ))
          )
          }
          {/* Repeat other cards with same classes */}
        </div>
      </section>


    </>
  )
}

export default MainCategoriesSection