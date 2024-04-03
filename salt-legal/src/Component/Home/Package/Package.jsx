import React from 'react';
import './Package.css'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { useRecoilValue, useRecoilState } from 'recoil';
import { jwtTokenState, userIdState } from '../../auth/atoms';



function Package() {


  const navigate = useNavigate();
  const jwtToken = useRecoilValue(jwtTokenState);
  const userId = useRecoilValue(userIdState)
  const [cardDetails, setCardDetails] = useState([])
  const [book, setbook] = useState({
    name: "The Road to be taken",
    author: "C.S Tylor",
    img: "https://th.bing.com/th?id=OIP.O8X2cM_d8XTou4d3_YlbgAHaLH&w=204&h=306&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2",
    price: 1500,
  });
  const initPayment = (data,title,cardId) => {
    const options = {
      key: "rzp_test_UH0rkDW0Rkm44R",
      amount: data.amount,
      currency: data.currency,
      name: title,
      description: "Test Transaction",
      img: book.img,
      order_id: data.id,
      handler: async (response) => {
        try {
          console.log("dataishere",jwtToken,userId);
          const verifyUrl = `http://localhost:3001/verify/${userId}/${cardId}`;
          const token = jwtToken
      
          const headers = {
              'Authorization': `Bearer ${token}`
          };
      
          const { data } = await axios.post(verifyUrl, response, { headers });
          console.log("verifyData", data);
          if (data.status === true) navigate('/category-pay');
      } catch (error) {
          console.log(error);
      }
      
      },
      theme: {
        color: "#3399cc"
      },
    }
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  }

  const handlePayment = async (title,id) => {
    try {
      if (jwtToken) {
        console.log(jwtToken);
        console.log("order payment")
        const orderUrl = 'http://localhost:3001/orders';
        const { data } = await axios.post(orderUrl, {
          cardId : id
        });
        console.log("orderData", data);
        initPayment(data.data ,title,id);
      }
      else {
        navigate('/login');

      }
    } catch (error) {
      console.log(error)
    }
  }

  const getCardDetails = async () => {
    try {
      //change getContactUs to getPaymentCard after pushing data in mongodb now there is no data in mongodb so 
      //you wont get any data
      const response = await fetch('http://localhost:3001/getPaymentCard');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log("data", data);
      setCardDetails(data.data);
      console.log("carddetails", cardDetails)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getCardDetails();
  }, []);



  return (
    <div className='pakage-container'>

      <h2>Choose a <span>Right plan</span> for you</h2>
      <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae quos nemo totam unde quaerat odit facere.</p>

        <div className="package">
          {cardDetails.map((detail, index) => (
            <div className={`package-card-2 package-card-2-${index + 1}`} key={index}>
              <h2>{detail.title}</h2>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
            <FontAwesomeIcon icon={faCheckSquare} style={{ marginRight: '15px', color: 'black', marginTop: '5px' }} /><p>Ideal for larger teams </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <FontAwesomeIcon icon={faCheckSquare} style={{ marginRight: '15px', color: 'black', marginTop: '5px' }} /><p>Ideal for larger teams </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', textAlign: 'center' }}>
            <FontAwesomeIcon icon={faCheckSquare} style={{ marginRight: '15px', color: 'black', marginTop: '5px' }} /><p>Ideal for larger teams </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <FontAwesomeIcon icon={faCheckSquare} style={{ marginRight: '15px', color: 'black', marginTop: '5px' }} /><p>Ideal for larger teams </p>
          </div>
              <div>
                
                <h3>Price ₹{detail.price}/ month</h3>
              </div>
              <button onClick={() => handlePayment(detail.title, detail._id)}>SELECT</button>
            </div>
          ))}
        </div>
      </div>
  );
}

export default Package;