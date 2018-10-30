import React from 'react';

class LeafletSidebar extends React.Component {


  render() {
    return(
      <div id="sidebar" className="leaflet-sidebar collapsed">

        <div className="leaflet-sidebar-tabs">
          <ul role="tablist">
            <li><a href="#home" role="tab"><i className="fa fa-bars active"></i></a></li>
          </ul>


        </div>


        <div className="leaflet-sidebar-content">
          <div className="leaflet-sidebar-pane" id="home">
            <h1 className="leaflet-sidebar-header">
              Map legend
              <span className="leaflet-sidebar-close">
                <i className="fa fa-caret-left"></i>
              </span>
            </h1>

            <h2>Markers</h2>


          </div>

        </div>
      </div>
    );
  }
}

export default LeafletSidebar;
