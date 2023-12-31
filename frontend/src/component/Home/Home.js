import React, { Fragment,useEffect } from 'react'
import './Home.css'
import Product from "./ProductCard.js"
import MetaData from '../layout/MetaData'
import { clearErrors, getProduct } from '../../actions/productAction'
import {useDispatch,useSelector } from "react-redux"
import Loader from '../layout/Loader/Loader'
import { useAlert } from 'react-alert'





function Home() {
  const alert = useAlert()
  const dispatch = useDispatch()
  const {loading,error,products} = useSelector((state) => state.products)
  console.log()
  useEffect(() => {
    if(error){
      alert.error(error)
      dispatch(clearErrors())
    }
    dispatch(getProduct())
  },[dispatch,error,alert])

  return (
    <Fragment>
      {loading ? <Loader/>  : <Fragment>
    <MetaData title="Ecommerce" />

    <div className='banner'>
    <p>Welcome to Ecomerce</p>
    <h1>FIND AMAZING PRODUCTS BELOW</h1>

    <a href="#container">
      <button>
        Scroll <i class="fa-solid fa-computer-mouse-scrollwheel fa-bounce"></i>
      </button>
    </a>
    </div>

    <h2 className='homeHeading'>Featured Product</h2>
    <div className='container' id="container">
    {products && products.map((product) => <Product product={product} />)}
    </div>
  </Fragment>}
    </Fragment>
  )
}

export default Home
