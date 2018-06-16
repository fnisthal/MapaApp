var map;
var markersLayer;
var mapError;
var osmMapType;
var KMLSesion;
var carros;
var carrosAnteriores = [];

function param(name) {
    return (location.search.split(name + '=')[1] || '').split('&')[0];
}

function contentPageLoad() {
    //KMLSesion = param('KMLSesion');
    //agregarKML(KMLSesion);
    if (map == null) {
        mapError = 0;
        if (map == null)
            crearMapa();
        //getVehiculosPos();
    }
}

function agregarKML(parametro) {
    document.getElementById("navegacion").href = document.getElementById("navegacion").href + "?KMLSesion=" + parametro;
}

function crearMapa() {
    var centrar = (map == null);

    if (map == null) {
        // set up the map
        map = new L.Map('mapa');

        var OpenMapSurfer_Roads = L.tileLayer.provider('OpenMapSurfer.Roads');
        var OpenStreetMap_Mapnik = L.tileLayer.provider('OpenStreetMap.Mapnik');
        var OpenStreetMap_HOT = L.tileLayer.provider('OpenStreetMap.HOT');
        var Thunderforest_OpenCycleMap = L.tileLayer.provider('Thunderforest.OpenCycleMap');
        var Thunderforest_Transport = L.tileLayer.provider('Thunderforest.Transport');
        var Hydda_Full = L.tileLayer.provider('Hydda.Full');
        var MapQuestOpen_OSM = L.tileLayer.provider('MapQuestOpen.OSM');
        var MapQuestOpen_Aerial = L.tileLayer.provider('MapQuestOpen.Aerial');
        //MapQuestOpen_Aerial.options.maxZoom = 11;
        //var MapBox Se necesita registro
        var Stamen_TonerLite = L.tileLayer.provider('Stamen.TonerLite');
        var Esri_WorldStreetMap = L.tileLayer.provider('Esri.WorldStreetMap'); //Se necesita registro pero no usa sintaxis especial
        var Esri_WorldImagery = L.tileLayer.provider('Esri.WorldImagery'); //Se necesita registro pero no usa sintaxis especial
        //var HERE_normalDay = HERE.normalDay;
        //var HERE_normalDayMobile = HERE.normalDayMobile;
        //var HERE_hybridDay = HERE.hybridDay;
        //var HERE_hybridDayMobile = HERE.hybridDayMobile;
        //var HERE_satelliteDay = HERE.satelliteDay;
        //var Acetate_all = L.tileLayer.provider('Acetate.all');
        var CartoDB_Positron = L.tileLayer.provider('CartoDB.Positron');

        map.setView(new L.LatLng(14.5, -90.5), 7);
        map.addLayer(OpenStreetMap_Mapnik);
        markersLayer = new L.LayerGroup();	//layer contain searched elements
        map.addLayer(markersLayer);
        var controlSearch = new L.Control.Search({
            position: 'topright',
            layer: markersLayer,
            initial: false,
            zoom: 15,
            marker: false
        });
        map.addControl(controlSearch);
        var baseMaps = {
            "OpenStreetMap Mapnik": OpenStreetMap_Mapnik,
            "OpenStreetMap HOT": OpenStreetMap_HOT,
            "Thunderforest OpenCycleMap": Thunderforest_OpenCycleMap,
            "Thunderforest Transport": Thunderforest_Transport,
            "OpenMapSurfer Roads": OpenMapSurfer_Roads,
            "Hydda Full": Hydda_Full,
            //"MapQuestOpen OSM": MapQuestOpen_OSM,
            //"MapQuestOpen Aerial (Satelital)": MapQuestOpen_Aerial,
            //var MapBox Se necesita registro
            "Stamen TonerLite": Stamen_TonerLite,
            "Esri WorldStreetMap": Esri_WorldStreetMap,
            "Esri WorldImagery (Satelital)": Esri_WorldImagery,
            //var HERE_normalDay = HERE.normalDay;
            //var HERE_normalDayMobile = HERE.normalDayMobile;
            //var HERE_hybridDay = HERE.hybridDay;
            //var HERE_hybridDayMobile = HERE.hybridDayMobile;
            //var HERE_satelliteDay = HERE.satelliteDay;
            //"Acetate all": Acetate_all,
            "CartoDB Positron": CartoDB_Positron
        };

        L.control.layers(baseMaps).addTo(map);
    }
}

function getVehiculosPos() {
    Telemensaje.GPSInternet.gpsservice.GetVehiculosPos(KMLSesion, GetVehiculosPosSuccess, GetVehiculosPosFailure);
}

function GetVehiculosPosSuccess(result, userContext, methodName) {
    //alert(result.length);
    mapError = 0;
    carros = result;
    var diferentes = false;
    var centrar = carrosAnteriores.length == 0;

    var CarIcon = L.Icon.extend({
        options: {
            iconSize: [42, 42],
            iconAnchor: [21, 21],
            popupAnchor: [0, -24]
        }
    });

    if (carrosAnteriores.length != 0 && result.length > 0) {
        var j = 0;
        for (var i = 0; i < result.length; i++) {
            var c1 = result[i];
            var c2 = carrosAnteriores[j];

            if (c1.cod != c2.pos.cod) {

                diferentes = true;
                break;
            }
            if (c1.nom == c2.pos.nom && (moment(c1.fecha).isAfter(moment(c2.pos.fecha)) || moment(c1.ult).isAfter(moment(c2.pos.ult)))) {

                c2.pos = c1;

                var c = new CarIcon({ iconUrl: c1.Icono });
                var popup = '<h2>' + c1.cod + ': ';
                if (result[i].Apodo == '') {
                    popup += c1.nom + '</h2>';;
                } else {
                    popup += c1.Apodo + '</h2>';;
                }
                popup += '<b>Dirección:</b> ' + c1.dir + '<br>';
                popup += '<b>Fecha:</b> ' + moment(c1.fecha).format('DD/MM/YYYY hh:mm a') + '<br>';
                popup += '<b>Velocidad:</b> ' + Math.round(c1.vel) + 'kmh<br>';
                if (c1.alt >= 0) popup += '<b>Altitud:</b> ' + Math.round(c1.alt) + 'm<br>';
                popup += '<b>Ultima comunicación:</b> ' + moment(c1.ult).format('DD/MM/YYYY hh:mm a');
                c2.marker.setIcon(c);
                c2.marker.setLatLng([c1.lat, c1.lon]).update();
                c2.marker.getPopup().setContent(popup).update();
            }
            j++;
        }
    }

    if (diferentes && !centrar) {
        for (var i = 0; i < carrosAnteriores.length ; i++) {
            var c1 = carrosAnteriores[i];
            markersLayer.removeLayer(c1.marker);
        }
        carrosAnteriores.length = 0;
    }

    if (carrosAnteriores.length == 0 && result.length > 0) {
        var bounds = L.latLngBounds([]);
        for (var i = 0; i < result.length; i++) {
            var c = new CarIcon({ iconUrl: result[i].Icono });
            var title = result[i].cod + ': ';
            var popup = '<h2>' + result[i].cod + ': ';
            if (result[i].Apodo == '') {
                popup += result[i].nom + '</h2>';;
                title += result[i].nom;
            } else {
                popup += result[i].Apodo + '</h2>';;
                title += result[i].Apodo;
            }
            popup += '<b>Dirección:</b> ' + result[i].dir + '<br>';
            popup += '<b>Fecha:</b> ' + moment(result[i].fecha).format('DD/MM/YYYY hh:mm a') + '<br>';
            popup += '<b>Velocidad:</b> ' + Math.round(result[i].vel) + 'kmh<br>';
            if (result[i].alt >= 0) popup += '<b>Altitud:</b> ' + Math.round(result[i].alt) + 'm<br>';
            popup += '<b>Ultima comunicación:</b> ' + moment(result[i].ult).format('DD/MM/YYYY hh:mm a');
            var V = { pos: result[i], marker: null };
            V.marker = L.marker([result[i].lat, result[i].lon], { icon: c, title: title }).addTo(markersLayer).bindPopup(popup);
            V.marker.i = i;
            carrosAnteriores.push(V);
            bounds.extend([result[i].lat, result[i].lon]);
        }
        if (centrar) map.fitBounds(bounds);
        diferentes = true;
    }
    setTimeout('getVehiculosPos()', 15000);
}

function GetVehiculosPosFailure(error, userContext, methodName) {
    mapError++;
    if (mapError < 5)
        setTimeout('getVehiculosPos()', 5000 * mapError);
}

/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}