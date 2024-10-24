import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Layout from './layouts/Layout'
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import AddHotel from "./pages/AddHotel";
import { useAppContext } from "./contexts/AppContext";
import MyHotels from "./pages/MyHotels";
import EditHotel from "./pages/EditHotel";
import Search from "./pages/Search";

const App = () => {

  const { isloggedIn } = useAppContext();


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout>
          <p>Home Page</p>
        </Layout>} />
        <Route path="/search" element={<Layout>
          <Search/>
        </Layout>} />
        <Route path="/register" element={
          <Layout>
            <Register />
          </Layout>
        } />
        <Route path="/sign-in" element={
          <Layout>
            <SignIn />
          </Layout>
        } />
        {isloggedIn && (
          <>
            <Route path="/add-hotel" element={
              <Layout>
                <AddHotel />
              </Layout>
            } />
            <Route path="/edit-hotel/:hotelId" element={
              <Layout>
                <EditHotel />
              </Layout>
            } />
            <Route path="/my-hotels" element={
              <Layout>
                <MyHotels />
              </Layout>
            } />
          </>
        )}
        <Route path="*" element={<Navigate to='/' />} />
      </Routes>
    </BrowserRouter>
  );
};


export default App;