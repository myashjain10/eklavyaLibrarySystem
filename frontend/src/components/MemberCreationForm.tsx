import axios from 'axios';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const MemberCreationForm = () => {
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    email: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    phone_number: '',
    email: ''
  });
  
  const [successMessage, setSuccessMessage] = useState('');
  
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      phone_number: '',
      email: ''
    };
    
    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    
    // Validate phone number
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
      valid = false;
    } else if (!/^\d{10}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Phone number must be exactly 10 digits';
      valid = false;
    }
    
    // Validate email (optional field)
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // For phone number, only allow numbers
    if (name === 'phone_number' && value !== '') {
      if (!/^\d*$/.test(value)) return;
      // Limit to 10 digits
      if (value.length > 10) return;
    }

    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage('');
    
    if (validateForm()) {
      // Form is valid, submit the data
      console.log('Form submitted:', formData);

      try{
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/member/add`,
          formData,
          {
            headers:{
              Authorization: localStorage.getItem("token") || ""
            }
          }
        );

        nav(`/member/${response.data.member_id}`)
      }catch(e){
        console.log(e);
        alert("Couldn't Publish Blog. Try Again")
      }
      // Show success message
      setSuccessMessage('Member created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        phone_number: '',
        email: ''
      });
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Member</h2>
      
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter member name"
          />
          {errors.name && (
            <p className="mt-1 text-red-500 text-sm">{errors.name}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="phone_number">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.phone_number ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter 10-digit phone number"
          />
          {errors.phone_number && (
            <p className="mt-1 text-red-500 text-sm">{errors.phone_number}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
            Email (Optional)
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter member email"
          />
          {errors.email && (
            <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
        >
          Create Member
        </button>
      </form>
    </div>
  );
};

export default MemberCreationForm;
