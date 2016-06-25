import {range} from "d3-array";
import Transform from "./transform";

export default function() {
  var x0 = 0,
      y0 = 0,
      x1 = 960,
      y1 = 500,
      tx = (x0 + x1) / 2,
      ty = (y0 + y1) / 2,
      scale = 256,
      zoomDelta = 0;

  function tile() {
    var z = Math.max(Math.log(scale) / Math.LN2 - 8, 0),
        z0 = Math.round(z + zoomDelta),
        k = Math.pow(2, z - z0 + 8),
        x = tx - scale / 2,
        y = ty - scale / 2,
        tiles = [],
        cols = range(Math.max(0, Math.floor((x0 - x) / k)), Math.max(0, Math.ceil((x1 - x) / k))),
        rows = range(Math.max(0, Math.floor((y0 - y) / k)), Math.max(0, Math.ceil((y1 - y) / k)));

    rows.forEach(function(y) {
      cols.forEach(function(x) {
        tiles.push([x, y, z0]);
      });
    });

    tiles.transform = new Transform(k, x, y);

    return tiles;
  }

  tile.size = function(_) {
    return arguments.length ? (x0 = y0 = 0, x1 = +_[0], y1 = +_[1], tile) : [x1, y1];
  };

  tile.extent = function(_) {
    return arguments.length ? (x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1], tile) : [[x0, y0], [x1, y1]];
  };

  tile.scale = function(_) {
    return arguments.length ? (scale = +_, tile) : scale;
  };

  tile.translate = function(_) {
    return arguments.length ? (tx = +_[0], ty = +_[1], tile) : [tx, ty];
  };

  tile.zoomDelta = function(_) {
    return arguments.length ? (zoomDelta = +_, tile) : zoomDelta;
  };

  return tile;
}
