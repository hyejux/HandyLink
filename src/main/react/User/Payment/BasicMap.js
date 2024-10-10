import React, { useEffect, useState } from "react";

export default function BasicMap() {
    const storeLocation = { lat: 37.4979, lng: 127.0276 }; // 강남역 좌표
    const initialZoomLevel = 3; // 초기 줌 레벨
    const [currentPosition, setCurrentPosition] = useState(null);
    const [map, setMap] = useState(null);
    const [infowindow, setInfowindow] = useState(null); // 인포윈도우 상태

    useEffect(() => {
        const existingScript = document.getElementById('kakao-map-sdk');
        if (!existingScript) {
            const script = document.createElement('script');
            script.id = 'kakao-map-sdk';
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=f2ab75dd984a8c54de2057619973c70a&libraries=services,drawing,clusterer`;
            script.async = true;

            script.onload = () => {
                const mapContainer = document.getElementById('map');
                const kakaoMap = new window.kakao.maps.Map(mapContainer, {
                    center: new window.kakao.maps.LatLng(storeLocation.lat, storeLocation.lng), // 가게 위치로 초기 설정
                    level: initialZoomLevel, // 초기 줌 레벨 설정
                });
                setMap(kakaoMap);

                const markerPosition = new window.kakao.maps.LatLng(storeLocation.lat, storeLocation.lng);
                const markerImage = new window.kakao.maps.MarkerImage(
                    'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                    new window.kakao.maps.Size(24, 35), // 마커 크기
                    { alt: '가게 위치' }
                );
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition,
                    map: kakaoMap,
                    image: markerImage,
                });

                // 인포윈도우 생성
                const infowindowContent = `
                    <div style="padding:5px; font-size:12px; max-width: 150px; white-space: normal;">
                        오늘도 케이크
                    </div>
                `;
                const infowindowInstance = new window.kakao.maps.InfoWindow({
                    content: infowindowContent,
                    removable: true,
                });
                setInfowindow(infowindowInstance); // 인포윈도우 상태 저장

                // 지도에 마커가 표시되면 인포윈도우도 열기
                infowindowInstance.open(kakaoMap, marker);

                // 마커 클릭 시 인포윈도우 표시
                window.kakao.maps.event.addListener(marker, 'click', () => {
                    infowindowInstance.open(kakaoMap, marker);
                });

                // 현재 위치 가져오기
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const lat = position.coords.latitude;
                            const lng = position.coords.longitude;
                            setCurrentPosition({ lat, lng });

                            // 현재 위치 마커 표시
                            const currentMarker = new window.kakao.maps.Marker({
                                position: new window.kakao.maps.LatLng(lat, lng),
                                map: kakaoMap,
                            });
                        },
                        (error) => {
                            console.error("현재 위치를 가져오는 데 실패했습니다.", error);
                        },
                        { enableHighAccuracy: true }
                    );
                }
            };

            document.head.appendChild(script);

            return () => {
                document.head.removeChild(script);
            };
        }
    }, []);

    // 내 위치로 돌아가기 위한 함수
    const goToCurrentPosition = () => {
        if (currentPosition && map) {
            map.setCenter(new window.kakao.maps.LatLng(currentPosition.lat, currentPosition.lng));
            map.setLevel(initialZoomLevel); 
        } else {
            alert("현재 위치를 가져올 수 없습니다.");
        }
    };

    // 가게 위치로 가기 위한 함수
    const goToStoreLocation = () => {
        if (map) {
            map.setCenter(new window.kakao.maps.LatLng(storeLocation.lat, storeLocation.lng));
            map.setLevel(initialZoomLevel); 
            // 인포윈도우 열기
            infowindow && infowindow.open(map, new window.kakao.maps.Marker({
                position: new window.kakao.maps.LatLng(storeLocation.lat, storeLocation.lng),
                map: map,
                image: new window.kakao.maps.MarkerImage(
                    'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                    new window.kakao.maps.Size(24, 35) // 마커 크기
                )
            }));
        } else {
            alert("지도가 준비되지 않았습니다.");
        }
    };

    return (
        <div style={{ position: "relative" }}>
            <div
                id="map"
                style={{ width: "100%", height: "400px", marginTop: "20px" }}
            ></div>
            <button 
                onClick={goToCurrentPosition} 
                style={{
                    position: "absolute", 
                    top: "10px", 
                    right: "10px", 
                    padding: "10px", 
                    backgroundColor: "white", 
                    border: "1px solid #ccc", 
                    borderRadius: "5px", 
                    cursor: "pointer",
                    zIndex: 1
                }}>
                내 위치
            </button>
            <button 
                onClick={goToStoreLocation} 
                style={{
                    position: "absolute", 
                    top: "10px", 
                    right: "80px",
                    padding: "10px", 
                    backgroundColor: "white", 
                    border: "1px solid #ccc", 
                    borderRadius: "5px", 
                    cursor: "pointer",
                    zIndex: 1
                }}>
                가게 위치
            </button>
        </div>
    );
}
