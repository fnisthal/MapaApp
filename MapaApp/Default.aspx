<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="MapaApp.Default" %>

<!DOCTYPE html>

<html>
<head>
    <title></title>
    <link href="Content/kendo/2018.2.516/kendo.common.min.css" rel="stylesheet" />
    <link href="Content/kendo/2018.2.516/kendo.default.min.css" rel="stylesheet" />
    <link href="Scripts/leaflet/0.7.3/leaflet.css" rel="stylesheet" />
    <link href="Content/leaflet-search.css" rel="stylesheet" />
    
    <script src="Scripts/jquery-1.10.2.min.js"></script>
    <script src="Scripts/kendo/2018.2.516/kendo.all.min.js"></script>
    <script src="https://ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js" type="text/javascript"></script>
    <script src="../gpsservice.asmx/js" type="text/javascript"></script>
    <script src="Scripts/moment.js"></script>
    <script src="Scripts/MapaApp.js"></script>
    <script src="Scripts/leaflet/0.7.3/leaflet.js"></script>
    <script src="Scripts/leaflet/0.7.3/KML.js"></script>
    <script src="Scripts/leaflet/0.7.3/leaflet-providers.js"></script>
    <script src="Scripts/leaflet-search.js"></script>
    
    <style>
        html, body {
           padding: 0;
           margin: 0;
        }
        .leaflet-container {
            height: 100vh;
            width: 100vw;
        }
    </style>
    <script>
        
        $(function () {
            contentPageLoad();
        });
    </script>
</head>
<body>
    <div id="map"></div>
</body>
</html>
