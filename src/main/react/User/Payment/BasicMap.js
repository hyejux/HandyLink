import React, { useEffect, useState } from "react";

export default function BasicMap() {
    const storeLocation = { lat: 37.4979, lng: 127.0276 }; // 강남역 좌표
    const [currentPosition, setCurrentPosition] = useState(null);
    const [map, setMap] = useState(null);

    useEffect(() => {
        const existingScript = document.getElementById('kakao-map-sdk');
        if (!existingScript) {
            const script = document.createElement('script');
            script.id = 'kakao-map-sdk';
            script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=f2ab75dd984a8c54de2057619973c70a&libraries=services,drawing,clusterer`;
            script.async = true;

            script.onload = () => {
                // 지도 생성
                const mapContainer = document.getElementById('map');
                const kakaoMap = new window.kakao.maps.Map(mapContainer, {
                    center: new window.kakao.maps.LatLng(storeLocation.lat, storeLocation.lng),
                    level: 3,
                });
                setMap(kakaoMap);

                // 마커 표시
                const markerPosition = new window.kakao.maps.LatLng(storeLocation.lat, storeLocation.lng);
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition,
                    map: kakaoMap,
                });

                // 인포윈도우 생성
                const infowindowContent = `
                    <div style="padding:5px; font-size:12px;">
                        기대만족 본점
                    </div>
                `;
                const infowindow = new window.kakao.maps.InfoWindow({
                    content: infowindowContent,
                    removable: true,
                });

                // 마커 클릭 시 인포윈도우 표시
                window.kakao.maps.event.addListener(marker, 'click', () => {
                    infowindow.open(kakaoMap, marker);
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

                            // 지도 중심을 현재 위치로 이동
                            kakaoMap.setCenter(new window.kakao.maps.LatLng(lat, lng));
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

    return (
    <div>
    <div
    id="map"
    style={{ width: "100%", height: "400px", marginTop: "20px" }}
    ></div>
    </div>
    );
}
