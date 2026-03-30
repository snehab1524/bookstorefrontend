import React from 'react'
import Home from './pages/Home'
import BooksPage from './pages/Books'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
import Favourites from './pages/Profile/Favourites'
import OrderHistory from './pages/Profile/OrderHistory'
import Settings from './pages/Profile/Settings'
import AddBooks from './pages/Profile/AddBooks'
import DeleteBooks from './pages/Profile/DeleteBooks'
import UpdateBooks from './pages/Profile/UpdateBooks'
import ManageOrders from './pages/Profile/ManageOrders'
import {Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/footer/footer'
import { Toaster } from 'react-hot-toast'
import ViewBookDetails from './components/ViewBookDetails/ViewBookDetails'
import { FavoritesProvider } from './context/FavoritesContext'


function App() {
  return (
    <div className='min-h-screen bg-zinc-900'>
        <Navbar />
        <FavoritesProvider>
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route path='/books' element={<BooksPage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/profile' element={<Profile />}>
              <Route index element={<Favourites/>}/>
              <Route path='favourites' element={<Favourites />} />
              <Route path='add-books' element={<AddBooks />} />
              <Route path='update-books' element={<UpdateBooks />} />
              <Route path='delete-books' element={<DeleteBooks />} />
              <Route path='orderHistory' element={<OrderHistory />} />
              <Route path='manage-orders' element={<ManageOrders />} />
              <Route path='settings' element={<Settings />} />
            </Route>
            <Route path="view-book-details/:id" element={<ViewBookDetails />} />
          </Routes>
        </FavoritesProvider>
        <Footer />
        <Toaster position="top-right" />

    </div>
  )
}

export default App
