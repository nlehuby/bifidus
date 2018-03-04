var map = new mapboxgl.Map({
    container: 'map',
    style: 'glstyle.json',
    center: [
        2.4067, 48.7031
    ],
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

var osmose_filter = get_issues_to_display_from_url()
var osmose_base_api_url = 'https://cors.5apps.com/?uri=http://osmose.openstreetmap.fr/fr/api/0.2/error/'

map.on('load', function() {
    map.loadImage('https://raw.githubusercontent.com/osm-fr/osmose-frontend/master/static/images/markers/marker-b-3010.png', function(error, image) {
        if (error)
            throw error;
        map.addImage('8040', image);
    });

    map.loadImage('https://raw.githubusercontent.com/osm-fr/osmose-frontend/master/static/images/markers/marker-b-0.png', function(error, image) {
        if (error)
            throw error;
        map.addImage('2140', image);
    });

    map.loadImage('https://raw.githubusercontent.com/osm-fr/osmose-frontend/master/static/images/markers/marker-b-5010.png', function(error, image) {
        if (error)
            throw error;
        map.addImage('1260', image);
    });

    map.on('click', popup_element.remove);

    create_osmose_layer(osmose_filter);
    map.on('click', "issues_osmose", display_info);

})

function get_issues_to_display_from_url() {
    var osmose_issues = ['1260_1', '1260_2', '1260_3', '1260_4', '8040', '2140_21402', '2140_21403',
        '2140_21404', '2140_21405', '2140_21401', '2140_21411', '2140_21412',
        'line_info'
    ]
    osmose_issues_to_display = get_parameter_from_url("issues")
    if (!osmose_issues.includes(osmose_issues_to_display)) {
        var osmose_issues_to_display = "all"
        console.log("Le numéro Osmose passé dans l'URL n'est pas valide, on affiche tout")
    }


    if (osmose_issues_to_display == 'all') {
        var filter = ["all"]
    } else if (osmose_issues_to_display == 'line_info') {
        var filter = [
            "all", ["==", "item", 2140],
            ["in", "class", 21402, 21403, 21404, 21405]
        ]
    } else if (osmose_issues_to_display == '8040') {
        var filter = ["all", ["==", "item", 8040]]
    } else {
        var osmose_name_array = osmose_issues_to_display.split("_");
        var item = parseInt(osmose_name_array[0]);
        var class_ = parseInt(osmose_name_array[1]);
        var filter = [
            "all", ["==", "item", item],
            ["==", "class", class_]
        ]
    }

    return filter
}
