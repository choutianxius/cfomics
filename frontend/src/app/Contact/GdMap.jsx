import React from 'react';

class GdMap extends React.Component {
  componentDidMount () {
    const script = document.createElement('script');
    script.src = 'https://webapi.amap.com/maps?v=1.4.15&key=c2cdd3a1626cdcbe242d3d6c1ee69c4b';
    script.async = true;
    script.onload = () => {
      const mapContainer = document.getElementById('mapContainer');
      const map = new window.AMap.Map(mapContainer, {
        resizeEnable: true,
        center: [116.315901, 40.00484],
        zoom: 17,
      });

      const info = [];
      info.push("<div class='input-card content-window-card'><div></div> ");
      info.push('<div style="padding:0px 0px 0px 15px;"><h6 class="lulab_head">Lu Lab @ Tsinghua University</h6>');
      info.push("<p class='input-item lulab_txt'>Addr.: Biotech. Building, School of Life Sciences <br>Room: 2-108, 2-110, 2-111, 3-106, 3-109.<br>Tel.: 010-62789217</p></div></div>");
      info.push('</div></div>');

      const infoWindow = new window.AMap.InfoWindow({ content: info.join('') });

      infoWindow.open(map, map.getCenter());
    };
    document.body.appendChild(script);
  }

  render () {
    return (
      <div id="mapContainer" className="w-100 h-100" style={{ minHeight: '450px' }} />
    );
  }
}

export default GdMap;
