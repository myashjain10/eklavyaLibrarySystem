import axios from "axios";
import { useEffect, useState } from "react";
import { Member } from "../types";

//get all members
export const useMembers = () => {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);

  
  useEffect(()=>{
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/member/bulk`,{
      headers:{
        Authorization: localStorage.getItem("token") || ""
      }
    })
      .then( response => {
      setMembers(response.data.members);
      setLoading(false);
    })
  },[])

  return{
    loading,
    members
  }
}

//get one member
export const useMember = ({id} : {id:string}) => {
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<Member>();

  
  useEffect(()=>{
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/member/single/${id}`,{
      headers:{
        Authorization: localStorage.getItem("token") || ""
      }
    })
      .then( response => {
        setMember(response.data.member);
        setLoading(false);
    })
  },[id])

  return{
    loading,
    member
  }
}