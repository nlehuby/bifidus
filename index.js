var map = new mapboxgl.Map({
    container: 'map',
    style: 'glstyle.json',
    center: [-0.6039, 44.8306],
    zoom: 14,
    hash: true
});
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));

var poi_config = {}
poi_config['toilets'] = {
    'subclass': 'toilets',
    'class': 'toilets',
    'icon_url' : 'toilets.png',
    'icon_name': 'toilets',
    'osmose_class_item':'8180',
    'mapcontrib' : 'https://www.cartes.xyz/t/b607fa-Toilettes#'
}

poi_config['pharmacy'] = {
    'subclass': 'pharmacy',
    'class': 'pharmacy',
    'icon_name': 'pharmacy_11',
    'osmose_class_item':'8210'
}

var used_poi_config = poi_config['toilets'];

map.on('load', function() {

    map.addLayer({
        "id": "poi",
        "type": "symbol",
        "source": "openmaptiles",
        "source-layer": "poi",
        "filter": [
            "all", [
                "==",
                "$type",
                "Point"
            ],
            [
                "==",
                "subclass",
                used_poi_config['subclass']
            ],
            [
                "==",
                "class",
                used_poi_config['class']
            ],
        ],
        "layout": {
            "text-padding": 2,
            "text-font": [
                "Noto Sans Regular"
            ],
            "text-anchor": "top",
            "icon-image": used_poi_config['icon_name'],
            "icon-allow-overlap": true,
            "text-field": "{name}",
            "text-offset": [
                0,
                0.6
            ],
            "text-size": 12,
            "text-max-width": 9
        },
        "paint": {
            "text-halo-blur": 0.5,
            "text-color": "#666",
            "text-halo-width": 1,
            "text-halo-color": "#ffffff"
        }
    });

    if (used_poi_config['icon_url']) {
        map.loadImage(used_poi_config['icon_url'], function(error, image) {
            if (error)
                throw error;
            map.addImage(used_poi_config['icon_name'], image);
        });
    }

    map.addSource('osmose', {
        "type": 'vector',
        "tiles": ["https://cors.5apps.com/?uri=http://osmose.openstreetmap.fr/fr/map/issues/{z}/{x}/{y}.mvt?item=" + used_poi_config['osmose_class_item'] ],
        "attribution": "Osmose",
        "minzoom": 12
    });

    map.addLayer({
        "id": "issues_",
        "type": "circle",
        "source": "osmose",
        "source-layer": "issues",
        "paint": {
            "circle-color": "hsl(0, 81%, 54%)",
            "circle-radius": {
                "base": 1,
                "stops": [
                    [
                        12,
                        12
                    ],
                    [
                        18,
                        8
                    ]
                ]
            },
            "circle-blur": {
                "base": 1,
                "stops": [
                    [
                        12,
                        1
                    ],
                    [
                        18,
                        0
                    ]
                ]
            }
        }
    });

    map.on('mouseenter', 'issues_', function(e) {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'issues_', function() {
        map.getCanvas().style.cursor = '';
    });

    var popup = document.getElementById('popup');

    map.on('click', function(e) {
        if (popup.style.display == 'block') {
            popup.style.display = 'none'
        }

    });

    map.on('click', 'issues_', display_info);

    async function display_info(e) {
        map.flyTo({
            center: e.features[0].geometry.coordinates,
            zoom: 18
        });

        var item_id = e.features[0]['properties']['item'];

        try {
            var osmose_url = "https://cors.5apps.com/?uri=http://osmose.openstreetmap.fr/fr/api/0.2/error/" + e.features[0].properties.issue_id
            var osmose_response = await fetch(osmose_url);
            var osmose_data = await osmose_response.json();

            var popup_content = "<b>" + osmose_data['title'] + "</b><br/>"
            popup_content += osmose_data['subtitle']
            if (used_poi_config['mapcontrib']){
                var mapcontrib_url = used_poi_config['mapcontrib'] + "#position/18/" + e.features[0].geometry.coordinates[1] + '/' + e.features[0].geometry.coordinates[0];
                popup_content += "<br><a target='blank_' href='" + mapcontrib_url + "'>Voir sur MapContrib</a>"
            }

            popup.style.display = 'block';
            popup.innerHTML = popup_content
        } catch (err) {
            console.log("erreur en récupérant les infos d'Osmose : " + err)
        }
    }
})
