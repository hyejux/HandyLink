import React from "react";
import ReactDOM from 'react-dom/client';

function Admin() {

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