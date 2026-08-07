/* Bangalore service-area map (Leaflet + Carto light tiles) */
(function () {
  'use strict';

  var mapEl = document.getElementById('loc-map');
  if (!mapEl || typeof L === 'undefined') return;

  var areas = [
    { id: 'whitefield', n: 1, name: 'Whitefield', zone: 'East Bangalore', lat: 12.9698, lng: 77.7499, href: 'whitefield.html' },
    { id: 'electronic-city', n: 2, name: 'Electronic City', zone: 'South Bangalore', lat: 12.8458, lng: 77.6692, href: 'electronic-city.html' },
    { id: 'peenya', n: 3, name: 'Peenya', zone: 'North-West Bangalore', lat: 13.0325, lng: 77.5195, href: 'peenya.html' },
    { id: 'hsr-layout', n: 4, name: 'HSR Layout', zone: 'South-East Bangalore', lat: 12.9121, lng: 77.6446, href: 'hsr-layout.html' },
    { id: 'koramangala', n: 5, name: 'Koramangala', zone: 'Central-South Bangalore', lat: 12.9352, lng: 77.6245, href: 'koramangala.html' },
    { id: 'marathahalli', n: 6, name: 'Marathahalli', zone: 'East Bangalore / ORR', lat: 12.9592, lng: 77.7010, href: 'marathahalli.html' },
    { id: 'manyata-tech-park', n: 7, name: 'Manyata Tech Park', zone: 'North Bangalore', lat: 13.0480, lng: 77.6215, href: 'manyata-tech-park.html' },
    { id: 'horamavu', n: 8, name: 'Horamavu & Kalkere', zone: 'Head office', lat: 13.0278, lng: 77.6612, href: 'horamavu.html', hq: true }
  ];

  var map = L.map(mapEl, {
    scrollWheelZoom: false,
    zoomControl: false,
    attributionControl: true
  }).setView([12.97, 77.62], 11);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 18
  }).addTo(map);

  /* Soft service-area ring around Bangalore */
  L.circle([12.97, 77.60], {
    radius: 22000,
    color: '#285f24',
    weight: 2,
    dashArray: '8 10',
    fillColor: '#3d8f36',
    fillOpacity: 0.05,
    interactive: false
  }).addTo(map);

  var markers = {};
  var listLinks = Array.prototype.slice.call(document.querySelectorAll('[data-loc-id]'));

  function setActive(id) {
    listLinks.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('data-loc-id') === id);
    });
    Object.keys(markers).forEach(function (key) {
      var el = markers[key].getElement();
      if (el) el.classList.toggle('is-active', key === id);
    });
  }

  areas.forEach(function (area) {
    var html;
    if (area.hq) {
      html =
        '<a class="loc-marker loc-marker--hq" href="' + area.href + '" data-map-id="' + area.id + '" aria-label="' + area.name + ' head office">' +
          '<span class="loc-marker-num" aria-hidden="true">' +
            '<svg viewBox="0 0 40 40" fill="currentColor"><path d="M14 6 L14 20 L20 20 L18 34 L26 18 L20 18 L22 6 Z"/></svg>' +
          '</span>' +
        '</a>';
    } else {
      html =
        '<a class="loc-marker" href="' + area.href + '" data-map-id="' + area.id + '" aria-label="' + area.name + '">' +
          '<span class="loc-marker-num">' + area.n + '</span>' +
          '<span class="loc-marker-text"><strong>' + area.name + '</strong><span>' + area.zone + '</span></span>' +
        '</a>';
    }

    var icon = L.divIcon({
      className: 'loc-marker-wrap',
      html: html,
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    });

    var marker = L.marker([area.lat, area.lng], { icon: icon, riseOnHover: true }).addTo(map);
    markers[area.id] = marker;

    marker.on('mouseover', function () { setActive(area.id); });
    marker.on('click', function () { window.location.href = area.href; });
  });

  listLinks.forEach(function (a) {
    var id = a.getAttribute('data-loc-id');
    a.addEventListener('mouseenter', function () {
      setActive(id);
      var m = markers[id];
      if (m) map.panTo(m.getLatLng(), { animate: true, duration: 0.45 });
    });
    a.addEventListener('focus', function () {
      setActive(id);
      var m = markers[id];
      if (m) map.panTo(m.getLatLng(), { animate: true, duration: 0.45 });
    });
  });

  /* Fit all markers with padding */
  var group = L.featureGroup(Object.keys(markers).map(function (k) { return markers[k]; }));
  map.fitBounds(group.getBounds().pad(0.18));

  window.addEventListener('resize', function () {
    map.invalidateSize();
  });
})();
