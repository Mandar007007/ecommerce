import React, { Fragment, useEffect, useState } from 'react'
import "./Products.css"
import {useSelector,useDispatch} from "react-redux"
import { clearErrors,getProduct } from '../../actions/productAction'
import Loader from '../layout/Loader/Loader'
import ProductCard from '../Home/ProductCard'
import { useParams } from 'react-router-dom'
import Pagination from "react-js-pagination"
import { Typography } from '@mui/material'
import { Slider } from '@material-ui/core';
import MetaData from '../layout/MetaData'




const Products = () => {
  const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Altire",
    "Camera",
    "SmartPhones",
    "Calculator",
  ]
    const dispatch = useDispatch();
    const [currentPage,setCurrentPage] = useState(1)
    const [category,setCategory] = useState("")
    const [price,setPrice] = useState([0,25000])
    const [ratings,setRatings] = useState(0)

    const {products,loading,error,productsCount,resultsPerPage,} = useSelector((state) => state.products)
    
    const {keyword} = useParams()
    
    const setCurrentPageNo = (e) => {
      setCurrentPage(e);
    }
    
    const priceHandler = (e,newPrice) => {
      setPrice(newPrice)
    }
    
    useEffect(() => {
      if(error){
        alert.error(error);
        dispatch(clearErrors())
      }
        dispatch(getProduct(keyword,currentPage,price,category,ratings))
    },[dispatch,keyword,error,currentPage,price,category,ratings])


    
  return <Fragment>
    {loading ? <Loader /> :
    <Fragment>
      <MetaData title="PRODUCTS -- ECOMMERCE"/>
        <h2 className='productsHeading'>Products</h2>

        <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} price={price} />
              ))}
          </div>

                <div className='filterBox'>
                <Typography>Price</Typography>
                <Slider value={price} onChange={priceHandler} valueLabelDisplay="auto" aria-labelledby="range-slider" min={0} max={25000}/>
                <Typography>Categories</Typography>
                <ul className='categoryBox'>
                  {categories.map((category) => {
                    return <li className='category-link' key={category} onClick={() => setCategory(category)}>{category}</li>
                  })}
                </ul>
                
                  <fieldset>
                    <Typography component="legend">Ratings Above</Typography>
                    <Slider value={ratings} onChange={(e,newRating) => {setRatings(newRating)}} aria-labelledby='continious-slider' min={0} max={5}/>
                  </fieldset>

                </div>

          <div className='paginationBox'>
                <Pagination activePage={currentPage} itemsCountPerPage={resultsPerPage} totalItemsCount = {productsCount} onChange={setCurrentPageNo} nextPageText="Next" prevPageText="prev" firstPageText="1st" lastPageText="Last" itemClass="page-item" linkClass="page-link" activeClass="pageItemActive" activeLinkClass="pageLinkActive"/>
          </div>
        </Fragment>}
  </Fragment>
}

export default Products
