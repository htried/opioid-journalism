function albersUsaAll() {
  var ε = 1e-6;

  var lower48 = d3.geoAlbers();

  // EPSG:3338
  var alaska = d3.geo.conicEqualArea()
      .rotate([154, 0])
      .center([-2, 58.5])
      .parallels([55, 65]);

  // ESRI:102007
  var hawaii = d3.geo.conicEqualArea()
      .rotate([157, 0])
      .center([-3, 19.9])
      .parallels([8, 18]);

  // XXX? You should check that this is a standard PR projection!
  var puertoRico = d3.geo.conicEqualArea()
      .rotate([66, 0])
      .center([0, 18])
      .parallels([18.5, 18]);

  var guam = d3.geo.conicEqualArea()
      .rotate([-144.7, 0])
      .center([0, 13.5])
      .parallels([8, 13.5]);

  var samoa = d3.geo.conicEqualArea()
    .rotate([170.5, 0])
    .center([0, -14])
    .parallels([8, 18])

  var point,
      pointStream = {point: function(x, y) { point = [x, y]; }},
      lower48Point,
      alaskaPoint,
      hawaiiPoint,
      puertoRicoPoint,
      guamPoint,
      samoaPoint;

  function albersUsa(coordinates) {
    var x = coordinates[0], y = coordinates[1];
    point = null;
    (lower48Point(x, y), point)
        || (alaskaPoint(x, y), point)
        || (hawaiiPoint(x, y), point)
        || (puertoRicoPoint(x, y), point)
        || (guamPoint(x, y), point)
        || (samoaPoint(x, y), point);
    return point;
  }

  albersUsa.invert = function(coordinates) {
    var k = lower48.scale(),
        t = lower48.translate(),
        x = (coordinates[0] - t[0]) / k,
        y = (coordinates[1] - t[1]) / k;
    return (y >= .120 && y < .234 && x >= -.425 && x < -.214 ? alaska
        : y >= .166 && y < .234 && x >= -.214 && x < -.115 ? hawaii
        : y >= .204 && y < .234 && x >= .320 && x < .380 ? puertoRico
        : y >= .090 && y < .131 && x >= .343 && x < .388 ? guam
        : y >= .025 && y < .060 && x >= -.418 && x < -.359 ? samoa
        : lower48).invert(coordinates);
  };

  // A naïve multi-projection stream.
  // The projections must have mutually exclusive clip regions on the sphere,
  // as this will avoid emitting interleaving lines and polygons.
  albersUsa.stream = function(stream) {
    var lower48Stream = lower48.stream(stream),
        alaskaStream = alaska.stream(stream),
        hawaiiStream = hawaii.stream(stream),
        puertoRicoStream = puertoRico.stream(stream),
        guamStream = guam.stream(stream),
        samoaStream = samoa.stream(stream);
    return {
      point: function(x, y) {
        lower48Stream.point(x, y);
        alaskaStream.point(x, y);
        hawaiiStream.point(x, y);
        puertoRicoStream.point(x, y);
        guamStream.point(x, y);
        samoaStream.point(x, y);
      },
      sphere: function() {
        lower48Stream.sphere();
        alaskaStream.sphere();
        hawaiiStream.sphere();
        puertoRicoStream.sphere();
        guamStream.sphere();
        samoaStream.sphere();
      },
      lineStart: function() {
        lower48Stream.lineStart();
        alaskaStream.lineStart();
        hawaiiStream.lineStart();
        puertoRicoStream.lineStart();
        guamStream.lineStart();
        samoaStream.lineStart();
      },
      lineEnd: function() {
        lower48Stream.lineEnd();
        alaskaStream.lineEnd();
        hawaiiStream.lineEnd();
        puertoRicoStream.lineEnd();
        guamStream.lineEnd();
        samoaStream.lineEnd();
      },
      polygonStart: function() {
        lower48Stream.polygonStart();
        alaskaStream.polygonStart();
        hawaiiStream.polygonStart();
        puertoRicoStream.polygonStart();
        guamStream.polygonStart();
        samoaStream.polygonStart();
      },
      polygonEnd: function() {
        lower48Stream.polygonEnd();
        alaskaStream.polygonEnd();
        hawaiiStream.polygonEnd();
        puertoRicoStream.polygonEnd();
        guamStream.polygonEnd();
        samoaStream.polygonEnd();
      }
    };
  };

  albersUsa.precision = function(_) {
    if (!arguments.length) return lower48.precision();
    lower48.precision(_);
    alaska.precision(_);
    hawaii.precision(_);
    puertoRico.precision(_);
    guam.precision(_);
    samoa.precision(_);
    return albersUsa;
  };

  albersUsa.scale = function(_) {
    if (!arguments.length) return lower48.scale();
    lower48.scale(_);
    alaska.scale(_ * .35);
    hawaii.scale(_);
    puertoRico.scale(_);
    guam.scale(_);
    samoa.scale(_);
    return albersUsa.translate(lower48.translate());
  };

  albersUsa.translate = function(_) {
    if (!arguments.length) return lower48.translate();
    var k = lower48.scale(), x = +_[0], y = +_[1];

    lower48Point = lower48
        .translate(_)
        .clipExtent([[x - .455 * k, y - .238 * k], [x + .455 * k, y + .238 * k]])
        .stream(pointStream).point;

    alaskaPoint = alaska
        .translate([x - .307 * k, y + .201 * k])
        .clipExtent([[x - .425 * k + ε, y + .120 * k + ε], [x - .214 * k - ε, y + .234 * k - ε]])
        .stream(pointStream).point;

    hawaiiPoint = hawaii
        .translate([x - .205 * k, y + .212 * k])
        .clipExtent([[x - .214 * k + ε, y + .166 * k + ε], [x - .115 * k - ε, y + .234 * k - ε]])
        .stream(pointStream).point;

    puertoRicoPoint = puertoRico
        .translate([x + .300 * k, y + .224 * k])
        .clipExtent([[x + .275 * k, y + .204 * k], [x + .325 * k, y + .234 * k]])
        .stream(pointStream).point;

    guamPoint = guam
        .translate([x + .364 * k, y + .114 * k])
        .clipExtent([[x + .343 * k, y + .090 * k], [x + .388 * k, y + .131 * k]])
        .stream(pointStream).point;

    samoaPoint = samoa
        .translate([x - .395 * k, y + .038 * k])
        .clipExtent([[x - .418 * k, y + .025 * k], [x - .359 * k, y + .060 * k]])
        .stream(pointStream).point;

    return albersUsa;
  };

  return albersUsa.scale(1070);
}
