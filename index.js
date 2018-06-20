var map = new mapboxgl.Map({
    container: 'map',
    style: 'glstyle.json',
    center: [
        2.3784, 48.851
    ],
    zoom: 12,
    hash: true
});
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));

var osmose_issues = get_issues_to_display_from_url()
var osmose_base_api_url = 'https://osmose.openstreetmap.fr/fr/api/0.2/error/'
var zoom_div = document.getElementById('zoom-overlay');

const osmose = new OsmoseRequest.default();

map.on('load', function() {
    map.loadImage('https://raw.githubusercontent.com/osm-fr/osmose-frontend/master/static/images/markers/marker-b-3010.png', function(error, image) {
        if (error)
            throw error;
        map.addImage('8040', image);
    });

    map.loadImage('https://raw.githubusercontent.com/osm-fr/osmose-frontend/master/static/images/markers/marker-b-1070.png', function(error, image) {
        if (error)
            throw error;
        map.addImage('2140', image);
    });

    map.loadImage('https://raw.githubusercontent.com/osm-fr/osmose-frontend/master/static/images/markers/marker-b-1070.png', function(error, image) {
        if (error)
            throw error;
        map.addImage('9014', image);
    });

    map.loadImage('https://raw.githubusercontent.com/osm-fr/osmose-frontend/master/static/images/markers/marker-b-5010.png', function(error, image) {
        if (error)
            throw error;
        map.addImage('1260', image);
    });

    map.loadImage('https://raw.githubusercontent.com/osm-fr/osmose-frontend/master/static/images/markers/marker-b-7060.png', function(error, image) {
        if (error)
            throw error;
        map.addImage('8042', image);
    });

    map.on('click', popup_element.remove);

    create_osmose_layer(osmose_issues);
    map.on('click', "issues_osmose", display_info);

    map.on('zoom', check_if_notify_user);
    check_if_notify_user()
})

function check_if_notify_user() {
    var current_zoom = map.getZoom();
    if (current_zoom > 13) {
        zoom_div.style.display = 'none';
    } else {
        zoom_div.style.display = 'block';
    }
}

function get_issues_to_display_from_url() {
    var osmose_issues = ['1260_1', '1260_2', '1260_3', '1260_4', '2140_21402', '2140_21403',
        '2140_21404', '2140_21405', '2140_21401', '2140_21411', '2140_21412',
        '9014_9014001','9014_9014002', '9014_9014003', '9014_9014004', '9014_9014005',
        '9014_9014006', '9014_9014007', '9014_9014008', '9014_9014009', '9014_9014010',
        '9014_9014011','9014_9014012', '9014_9014013', '9014_9014014', '9014_9014015',
        '9014_9014016','9014_9014017', '9014_9014018',
        '8040', '8042_1', '8042_2',
        'line_info'
    ]
    osmose_issues_to_display = get_parameter_from_url("issues")
    if (!osmose_issues.includes(osmose_issues_to_display)) {
        var osmose_issues_to_display = "all"
        console.log("Le numéro Osmose passé dans l'URL n'est pas valide, on affiche tout")
    }

    return osmose_issues_to_display
}
