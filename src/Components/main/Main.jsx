import './Main.css';

import PdfRename from '../PdfRename';
import PdfSplitter from '../PdfSpliter/PdfSplitter';
import PdfToExcel from '../PdfToExcel/PdfToExcel';
import FedexInvoices from "../Fedex/FedexInvoices";
import DhlInvoice from '../Dhl/DhlInvoice';
import DhlAwb from '../Dhl/DhlAwb';
import AremexInvoices from "../Aremax/AremexInvoices";

function Main() {
  return (
    <div className="app-container">
      
      {/* Stylish Header */}
      <header className="custom-header">
        <div className="header-logo">
          <img 
            src="https://rukminim2.flixcart.com/image/704/844/xif0q/flag/5/c/i/32-india-flag-indian-national-flag-lookat-original-imagrrx42kb3b3b8.jpeg?q=90&crop=false" 
            alt="App Logo" 
            className="main-logo"
            height={60}
          />
        </div>
        <h1 className="header-title">
          Keep Smiling  <span className="your-name">Ra & Sh</span>
        </h1>
        <div className="header-avatar">
  <span className="avatar-name">Rashid Ali</span>
  <img 
    src="https://ik.imagekit.io/8o8zh778p/smiley-face-png-35.jpg?updatedAt=1755426533168" 
    alt="avatar" 
    className="avatar" 
  />
  </div>
{/* 


        <div className="header-avatar">
            Rashid Ali
  
          <img src='https://ik.imagekit.io/8o8zh778p/smiley-face-png-35.jpg?updatedAt=1755426533168' alt="avatar" className="avatar" />
        </div> */}
      </header>

      {/* Row 1 => PdfRename at center */}
      <div className="top-section">
        <PdfRename />
        <PdfSplitter/>
        <PdfToExcel/>
      </div>

      {/* Row 2 => 3 components (Fedex, DHL group, Aramex) */}
      <div className="grid-section">
        {/* Fedex */}
        <div className="grid-item">
          <h2 className="section-header">
            <img src='https://tr.rbxcdn.com/f9066c373b9ff96c5193a26eedd71af9/420/420/Decal/Png' alt="Fedex Logo" className="logo" />
          </h2>
            <FedexInvoices/>
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
            <img src='https://cdn.posttrack.com/cdn/images/carriers/thumbnails/0098-aramex.png' alt="Aramex Logo" className="logo" />
          </h2>
          <AremexInvoices />
        </div>
      </div>
    </div>
  );
}

export default Main;
