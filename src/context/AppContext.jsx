import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [doctors, setDoctors] = useState([]);
  const [utoken, setUToken] = useState(
    localStorage.getItem("utoken") ? localStorage.getItem("utoken") : ""
  );
  const [userData, setUserData] = useState(false);

  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
        toast.success(data.message);
      } else [toast.error(data.message)];
    } catch (error) {
      toast.error(error.message);
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { utoken },
      });

      if (data.success) {
        setUserData(data.userData);
        toast.success(data.message);
        // console.log(data)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    doctors,
    currencySymbol,
    utoken,
    setUToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    getDoctorsData,
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (utoken) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [utoken]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
