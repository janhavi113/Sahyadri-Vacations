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
   
      getMainCategoriesEvent();

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
     {isSuccess && 
        <div className="section-header px-heading">
          <div className="col-7 row">
            <div className="col-lg-1 col-3">
                            <img
                              className="section-header-img"
                              loading="lazy"
                              src={categories}
                              alt="Upcoming Events Icon"
                            />
                          </div>
            <div className="col-lg-11 col-9">
              <h3 className="home-thicker home-header-text">Honney Moon & Family Trips</h3>
            </div>
          </div>
          <div className="mainSectionsCategories" >
          <div className="row">
            { mainCategoriesRec && (
              mainCategoriesRec.map((event, index) => (
                <MainCategoriesCard key={index} mainCategory={event} />
              ))
            )
            }
          </div>
        </div>
        </div>}
    </>
  )
}

export default MainCategoriesSection