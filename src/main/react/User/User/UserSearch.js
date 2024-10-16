// import React, { useEffect } from 'react';
// import './user-store-list.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const UserSearch = () => {
//   useEffect(() => {
//     // 스크롤 버튼 설정
//     const setupScrollControls = (listWrap, btnLeft, btnRight) => {
//       btnLeft.addEventListener('click', () => {
//         listWrap.scrollBy({ left: -200, behavior: 'smooth' });
//       });

//       btnRight.addEventListener('click', () => {
//         listWrap.scrollBy({ left: 200, behavior: 'smooth' });
//       });

//       listWrap.addEventListener('scroll', () => {
//         updateButtonVisibility(listWrap, btnLeft, btnRight);
//       });

//       updateButtonVisibility(listWrap, btnLeft, btnRight);
//     };

//     const updateButtonVisibility = (list, leftBtn, rightBtn) => {
//       const scrollLeft = list.scrollLeft;
//       const maxScrollLeft = list.scrollWidth - list.clientWidth;
//       leftBtn.style.display = scrollLeft <= 0 ? 'none' : 'block';
//       rightBtn.style.display = scrollLeft >= maxScrollLeft ? 'none' : 'block';
//     };

//     const listWrap = document.querySelector('.user-main-list-wrap');
//     const btnLeft = document.querySelector('.nav-button.left');
//     const btnRight = document.querySelector('.nav-button.right');
//     setupScrollControls(listWrap, btnLeft, btnRight);

//     const listWrap2 = document.querySelector('.user-main-list-wrap2');
//     const btnLeft2 = document.querySelector('.nav-button-wrap2.left');
//     const btnRight2 = document.querySelector('.nav-button-wrap2.right');
//     setupScrollControls(listWrap2, btnLeft2, btnRight2);

//     const hashtagListWrap = document.querySelector('.user-hashtag-list-wrap');
//     const btnLeft3 = document.querySelector('.nav-button-wrap3.left');
//     const btnRight3 = document.querySelector('.nav-button-wrap3.right');
//     setupScrollControls(hashtagListWrap, btnLeft3, btnRight3);

//     const buttons = document.querySelectorAll('.user-main-list-menu button');
//     buttons.forEach(button => {
//       button.addEventListener('click', () => {
//         buttons.forEach(btn => btn.classList.remove('active'));
//         button.classList.add('active');
//       });
//     });

//     document.querySelectorAll('.dropdown-item').forEach(item => {
//       item.addEventListener('click', function () {
//         const buttonText = this.getAttribute('data-value');
//         document.getElementById('dropdownButtonText').textContent = buttonText;
//       });
//     });
//   }, []);

//   return (
//     <div className="user-main-container">
//       <div className="user-top-nav">
//         <div className="logo">HandyLink!</div>
//       </div>

//       <div className="store-search-bar">
//         <i className="bi bi-search"></i>
//         <input type="text" placeholder="찾으시는 가게가 있나요?" />
//         <button className="nav-button left">‹</button>
//         <button className="nav-button right">›</button>
//       </div>

//       <div className="user-main-content">
//         <div className="user-main-list-wrap">
//           <div className="user-main-list-container">
//             <div className="user-category-menu">
//               <div className="user-category-menu-img">
//                 <img src="../img1.jpg" alt="디저트" />
//               </div>
//               <div className="user-category-name">디저트</div>
//             </div>
//           </div>
//           {/* Other list items */}
//         </div>

//         <div className="user-hashtag-list-wrap">
//           <div className="user-hashtag-list">
//             <button type="button" className="btn-hashtag">
//               <a href="#">
//                 <img src="/icon/free-icon-font-hastag-5068648.png" alt="" />
//                 레터링케이크
//               </a>
//             </button>
//             {/* Other hashtags */}
//           </div>
//         </div>

//         <div className="user-hit-search-list">
//           <button className="nav-button-wrap3 left">‹</button>
//           <button className="nav-button-wrap3 right">›</button>

//           <h4>
//             <img src="/icon/icon-fire.png" alt="fire" /> 10월 인기 가게
//           </h4>
//           <ol className="store-list">
//             <li>1 <a href="#">오늘도 케이크</a></li>
//             {/* Other store items */}
//           </ol>
//         </div>

//         <div className="user-main-list-wrap2">
//           <div className="user-main-list-menu">
//             <button type="button">자양동</button>
//             {/* Other menu items */}
//           </div>
//         </div>

//         <div className="user-main-list-wrap3">
//           <button className="nav-button-wrap2 left">‹</button>
//           <button className="nav-button-wrap2 right">›</button>

//           <div className="user-main-list-sub-part">
//             <div>
//               검색결과 <span>3</span> 건
//             </div>

//             <div className="dropdown">
//               <button className="btn btn-sm" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
//                 <span id="dropdownButtonText">추천순</span> <i className="bi bi-chevron-down"></i>
//               </button>
//               <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
//                 <li><a className="dropdown-item" href="#" data-value="추천순">추천순</a></li>
//                 {/* Other dropdown items */}
//               </ul>
//             </div>
//           </div>

//           <div className="user-main-list-sub-content">
//             <i className="bi bi-heart"></i>
//             <div className="sub-content-img-box">
//               <img src="../img3.jpg" alt="오늘도 케이크" />
//             </div>

//             <div className="sub-content-top">
//               <div className="sub-content-container">
//                 <div className="sub-content-title">오늘도 케이크</div>
//                 <div className="sub-content-category">디저트</div>
//               </div>
//               <div className="sub-content-date">
//                 <img src="/icon/free-icon-font-clock-five-7602662.png" alt="시계" /> 영업중 10:00 ~ 22:00
//               </div>
//             </div>

//             <div className="sub-content-mid">
//               <div className="sub-content-review">
//                 ⭐<span>4.8</span> <span>(10,959)</span>
//               </div>
//               <div className="sub-content-location">
//                 <img src="/icon/free-icon-font-marker-3916862.png" alt="위치" /> 현재 위치에서 950m
//               </div>
//             </div>

//             <div className="sub-content-bottom">
//               <div className="sub-content-price">₩ 12,000 ~</div>
//               <div className="sub-content-option-container">
//                 <img src="/icon/free-icon-font-hastag-5068648.png" alt="" />
//                 <span className="sub-content-option">레터링케이크</span>
//                 {/* Other options */}
//               </div>
//             </div>
//           </div>

//           {/* Other sub-contents */}
//         </div>

//         <div className="user-bottom-nav">
//           <a href="#"><span>메인</span></a>
//           <a href="#"><span>검색</span></a>
//           <a href="#"><span>예약</span></a>
//           <a href="#"><span>문의</span></a>
//           <a href="#"><span>MY</span></a>
//         </div>
//       </div>
//     </div>
//   );
// };

// ReactDOM.createRoot(document.getElementById("root")).render(<UserMain />);
