import React, { useEffect, useState } from "react";

export default function BasicMap({ storeLocation, storeName }) {
    const initialZoomLevel = 3; // 초기 줌 레벨
    const [currentPosition, setCurrentPosition] = useState(null);
    const [map, setMap] = useState(null);
    const [infowindow, setInfowindow] = useState(null); // 인포윈도우 상태
    const [isLargeMap, setIsLargeMap] = useState(false);

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
                    center: new window.kakao.maps.LatLng(storeLocation.lat, storeLocation.lng),
                    level: initialZoomLevel,
                });
                setMap(kakaoMap);

                const markerPosition = new window.kakao.maps.LatLng(storeLocation.lat, storeLocation.lng);
                const markerImage = new window.kakao.maps.MarkerImage(
                    'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                    new window.kakao.maps.Size(24, 35)
                );
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition,
                    map: kakaoMap,
                    image: markerImage,
                });

                const infowindowContent = `<div style="padding:5px; font-size:12px; max-width: 150px; white-space: normal;">${storeName}</div>`;
                const infowindowInstance = new window.kakao.maps.InfoWindow({
                    content: infowindowContent,
                    removable: true,
                });
                setInfowindow(infowindowInstance);
                infowindowInstance.open(kakaoMap, marker);

                window.kakao.maps.event.addListener(marker, 'click', () => {
                    infowindowInstance.open(kakaoMap, marker);
                });

                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const lat = position.coords.latitude;
                            const lng = position.coords.longitude;
                            setCurrentPosition({ lat, lng });

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
    }, [storeLocation]); // storeLocation이 변경될 때마다 다시 실행

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

    // 지도 크기 토글 함수
    const toggleMapSize = () => {
        setIsLargeMap(!isLargeMap);
    };

    return (
        <div style={{ position: "relative" }}>
            <div
                id="map"
                style={{ width: "100%", height: "320px", borderRadius: "10px" }}
            ></div>
            <button
                onClick={goToCurrentPosition}
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    padding: "8px 10px",
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    cursor: "pointer",
                    zIndex: 1,
                    fontSize: "10px"
                }}>
                내 위치
            </button>
            <button
                onClick={goToStoreLocation}
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "70px",
                    padding: "8px 10px",
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    cursor: "pointer",
                    zIndex: 1,
                    fontSize: "10px"
                }}>
                가게 위치
            </button>
        </div>
    );
}
