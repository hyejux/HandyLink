import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';


function AdminReservation() {

     const [reservationList, setReservationList] = useState([]);

       useEffect(() => {
            axios.get('/adminReservation/getList')
                .then(response => {
                    console.log(response.data);
                    setReservationList(response.data);
                })
                .catch(error => {
                    console.log('Error Category', error);
                });
        }, [])

  const [category, setCategory] = useState({
    categoryLevel: 0,
    parentCategoryLevel: 0,
    serviceName: '',
    servicePrice: 0,
    serviceContent: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({
      ...category,
      [name]: value
    });
  };

 const clickBtn = () => {
    axios.post('/adminReservation/setCategory', category)
      .then(response => {
        console.log('Response:', response.data);
      })
      .catch(error => {
        console.log('Error Category:', error);
      });
  };



  return (
    <div>
      <h3> category </h3>

         <form>
            <div>
              <label> 카테고리 레벨 </label>
              <input
                type="number"
                name="categoryLevel"
                value={category.categoryLevel}
                onChange={handleChange}
              />
            </div>

            <div>
              <label> 부모 카테고리 레벨 </label>
              <input
                type="number"
                name="parentCategoryLevel"
                value={category.parentCategoryLevel}
                onChange={handleChange}
              />
            </div>

            <div>
              <label> 서비스 이름 </label>
              <input
                type="text"
                name="serviceName"
                value={category.serviceName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label> 서비스 가격 </label>
              <input
                type="number"
                name="servicePrice"
                value={category.servicePrice}
                onChange={handleChange}
              />
            </div>

            <div>
              <label> 서비스 내용 </label>
              <textarea
                name="serviceContent"
                value={category.serviceContent}
                onChange={handleChange}
              />
            </div>

            <button type="button" onClick={clickBtn}> submit </button>
          </form>



        <table>
        <thead>
        <tr>
        <th> </th>
        <th> </th>
        <th> </th>
        <th> </th>
        <th> </th>
        </tr>

        </thead>
        <tbody>

       {reservationList.map((value, index) => (

        <tr key={index}>
           <td>{value.categoryLevel}  </td>
              <td>{value.parentCategoryLevel}  </td>
                 <td>{value.serviceName}  </td>
                    <td>{value.servicePrice}  </td>
                    <td>{value.serviceContent}  </td>
                    <td>{value.storeId}  </td>
        </tr>
       ))}
  </tbody>
        </table>

    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AdminReservation />
);