const OsmoseRequest = require("osmose-request");
console.log(OsmoseRequest.default)
const osmose = new OsmoseRequest();
osmose.fetchErrors({ item: 8120, bbox: '1.123,-0.124,2.767,0.243' })
  .then(result => console.log(result));
