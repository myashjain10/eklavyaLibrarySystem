import axios from "axios";
import { useEffect, useState } from "react";
import { Allotment } from "../types";


export const useAllotment = ({id} : {id:string}) => {
  const [loading, setLoading] = useState(true);
  const [allotment, setAllotment] = useState<Allotment>();

  
  // Effect to fetch and populate form if editing existing allotment

  useEffect(()=>{
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/allotment/single/${id}`,{
      headers:{
        Authorization: localStorage.getItem("token") || ""
      }
    })
      .then( response => {
        setAllotment(response.data.allotment);
        setLoading(false);
    })
  },[id])

  return{
    loading,
    allotment
  }
}