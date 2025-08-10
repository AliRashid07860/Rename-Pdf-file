import './App.css';
import FedexInvoices from './Components/Fedex/FedexInvoices';
import DhlInvoice from './Components/Dhl/DhlInvoice';
import PdfRename from './Components/PdfRename';
import AremexInvoices from './Components/Aremax/AremexInvoices';
import DhlAwb from './Components/Dhl/DhlAwb';

function App() {
  return (
    <div className="app-container">
      {/* Row 1 => PdfRename at center */}
      <div className="top-section">
        <PdfRename />
      </div>

      {/* Row 2 => 3 components (Fedex, DHL group, Aramex) */}
      <div className="grid-section">
        {/* Fedex */}
        <div className="grid-item">
          <h2 className="section-header">
            <img src='https://res.cloudinary.com/zenbusiness/q_auto,w_1050/v1/shared-assets/s2/raster/fedex-logo.jpg' alt="Fedex Logo" className="logo" />
          </h2>
          <FedexInvoices />
        </div>

        {/* DHL Group (Invoice + AWB) */}
        <div className="grid-item">
          <h2 className="section-header">
            <img src='https://www.pngitem.com/pimgs/m/78-785160_magazine-article-dhl-png-logo-dhl-png-logo.png' alt="DHL Logo" className="logo" />
          </h2>

          <div className="dhl-group">
            <DhlInvoice />
            <hr />
            <DhlAwb />
          </div>
        </div>

        {/* Aramex */}
        <div className="grid-item">
            <h2 className="section-header">
            <img src='https://dotcomaramexprod.blob.core.windows.net/default/images/default-source/press-releases/x-headerbcf4b188b3f2659d9310ff0100e7fe0c.png' alt="Aramex Logo" className="logo" />
          </h2>
          <AremexInvoices />
        </div>
      </div>
    </div>
  );
}

export default App;
