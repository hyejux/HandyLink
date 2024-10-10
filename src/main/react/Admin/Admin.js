import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { useState, useEffect } from 'react';


function Admin() {

       useEffect(() => {
            axios.get('/admin/test')
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.log('Error Category', error);
                });
        }, [])


  return (
    <div>
      <h3>관리자 입니다</h3>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Admin />
);