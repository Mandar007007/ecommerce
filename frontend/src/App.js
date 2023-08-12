import './App.css';
import Footer from "./component/layout/Footer/Footer.js"
import Header from './component/layout/Header/Header.js'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from './component/Home/Home.js'
import ProductDetails from "./component/Product/ProductDetails"
import Products from "./component/Product/Products.js"
import Search from "./component/Product/Search.js"
import LoginSignup from './component/User/LoginSignup';
import React from 'react';
import store from "./Store"
import { loadUser, updateProfile } from './actions/userAction';
import UserOptions from "./component/layout/Header/UserOptions.js"
import { useSelector } from 'react-redux';
import Profile from "./component/User/Profile.js"
import UpdateProfile from "./component/User/UpdateProfile.js"
import ProtectedRoute from './component/Route/ProtectedRoute';





function App() {

  const {isAuthenticated,user} = useSelector((state) => state.user)

  React.useEffect(() => {
    store.dispatch(loadUser())
  },[])
  return (
    <Router>
      <Header />
    
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path='login' element={<LoginSignup />}/>
        <Route path='account' element={<Profile />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route exact path="/me/update" element={<UpdateProfile />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
