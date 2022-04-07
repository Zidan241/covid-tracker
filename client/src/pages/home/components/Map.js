import React, { useRef, useEffect, useState } from "react";
import '../styling/map.scss';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = 'pk.eyJ1IjoiemlkYW4yNDEiLCJhIjoiY2wxbncwZnRxMDBycjNkbXk2emN6NmJrMCJ9.ATBdEV1eI0BTteOPzJjriQ';

export default function Map (props) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(-90.96);
    const [lat, setLat] = useState(-0.47);
    const [zoom, setZoom] = useState(7.5);
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v10',
          center: [lng, lat],
          zoom: zoom
        });
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
        map.current.on('load', () => {
            //user location
            map.current.addControl(new mapboxgl.GeolocateControl({
                positionOptions: {
                enableHighAccuracy: true
                },
                trackUserLocation: true,
                showUserHeading: true
            }));
            //patients markers
            map.current.addSource('points', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            'type': 'Feature',
                            'properties': {},
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [-91.3952, -0.9145]
                            }
                        },
                        {
                            'type': 'Feature',
                            'properties': {},
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [-90.3295, -0.6344]
                            }
                        },
                        {
                            'type': 'Feature',
                            'properties': {},
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [-91.3403, 0.0164]
                            }
                        }
                    ]
                }
            });
            // Add a circle layer
            map.current.addLayer({
                'id': 'circle',
                'type': 'circle',
                'source': 'points',
                'paint': {
                    'circle-color': '#4264fb',
                    'circle-radius': 8,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff'
                }
            });
            map.current.addLayer({
                'id': 'circle',
                'type': 'circle',
                'source': 'points',
                'paint': {
                    'circle-color': '#4264fb',
                    'circle-radius': 8,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff'
                }
            });
            // Center the map on the coordinates of any clicked circle from the 'circle' layer.
            map.current.on('click', 'circle', (e) => {
                map.flyTo({
                    center: e.features[0].geometry.coordinates
                });
            });
            // Change the cursor to a pointer when the it enters a feature in the 'circle' layer.
            map.current.on('mouseenter', 'circle', () => {
                map.current.getCanvas().style.cursor = 'pointer';
            });   
            // Change it back to a pointer when it leaves.
            map.current.on('mouseleave', 'circle', () => {
                map.current.getCanvas().style.cursor = '';
            });
        });
    },[]);
    return (
        <div className="mapContainer">
            <div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
};