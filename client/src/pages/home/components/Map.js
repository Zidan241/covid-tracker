import React, { useRef, useEffect, useState } from "react";
import '../styling/map.scss';
import moment from 'moment';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = 'pk.eyJ1IjoiemlkYW4yNDEiLCJhIjoiY2wxbncwZnRxMDBycjNkbXk2emN6NmJrMCJ9.ATBdEV1eI0BTteOPzJjriQ';

export default function Map(props) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(31.4798836);
    const [lat, setLat] = useState(30.0623453);
    const [zoom, setZoom] = useState(7.5);

    useEffect(() => {
        if (props.data) {
            //if (map.current) return; // initialize map only once
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/light-v10',
                center: [lng, lat],
                zoom: zoom
            });
            const nameDisplay = document.getElementById('name');
            const tempDisplay = document.getElementById('temp');
            const dateDisplay = document.getElementById('date');
            map.current.on('load', () => {
                //user location
                map.current.addControl(new mapboxgl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true
                    },
                    trackUserLocation: true,
                    showUserHeading: true
                }));
                //update long and lat
                map.current.on('move', () => {
                    setLng(map.current.getCenter().lng.toFixed(4));
                    setLat(map.current.getCenter().lat.toFixed(4));
                    setZoom(map.current.getZoom().toFixed(2));
                });
                //patients markers
                map.current.addSource('points', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features':
                            props.data.map(t => {
                                return (
                                    {
                                        'type': 'Feature',
                                        'properties': t,
                                        'geometry': {
                                            'type': 'Point',
                                            'coordinates': [t.long, t.lat]
                                        }
                                    }
                                );
                            })
                    },
                    'generateId': true
                });
                map.current.addLayer({
                    'id': 'circle',
                    'type': 'circle',
                    'source': 'points',
                    paint: {
                        'circle-stroke-color': '#000',
                        'circle-stroke-width': 1,
                        'circle-color': '#000'
                    }
                });
                let featureId = null;

                map.current.on('mousemove', 'circle', (event) => {
                    map.current.getCanvas().style.cursor = 'pointer';


                    const name = event.features[0].properties.name;
                    const temp = event.features[0].properties.temp + "°";
                    const date = moment(event.features[0].creationDate).format("MMMM Do YYYY, h:mm:ss a");

                    if (event.features.length === 0) return;
                    // Display in the sidebar
                    nameDisplay.textContent = name;
                    tempDisplay.textContent = temp;
                    dateDisplay.textContent = date;

                });
                map.current.on('mouseleave', 'circle', () => {
                    if (featureId) {
                        map.current.setFeatureState(
                            {
                                source: 'points',
                                id: featureId
                            },
                            {
                                hover: false
                            }
                        );
                    }
                    featureId = null;
                    // Remove from the sidebar
                    nameDisplay.textContent = '';
                    tempDisplay.textContent = '';
                    dateDisplay.textContent = '';
                    // Reset the cursor style
                    map.current.getCanvas().style.cursor = '';
                });
                // Center the map on the coordinates of any clicked circle from the 'circle' layer.
                map.current.on('click', 'circle', (e) => {
                    map.current.flyTo({
                        center: e.features[0].geometry.coordinates
                    });
                });
            });
        }
    }, [props.data])

    return (
        <div className="mapContainer">
            <div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div className='quake-info'>
                <div><strong>Name:</strong> <span id='name'></span></div>
                <div><strong>Temperature:</strong> <span id='temp'></span></div>
                <div><strong>Date:</strong> <span id='date'></span></div>
            </div>

            <div ref={mapContainer} className="map-container" />
        </div>
    );
};