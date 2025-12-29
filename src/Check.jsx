import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const Check = () => {
  const [awbText, setAwbText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFiles = async (files) => {
    if (!awbText.trim()) {
      alert("Please enter AWB numbers");
      return;
    }

    setLoading(true);

    const awbList = awbText
      .split("\n")
      .map(a => a.trim())
      .filter(Boolean);

    const zip = new JSZip();
    const reportData = {}; 
    /*
      {
        awb: {
          shippingBill: "",
          folder: "",
          files: []
        }
      }
    */

    try {
      for (const file of files) {
        const buffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const tc = await page.getTextContent();
          text += tc.items.map(it => it.str).join(" ");
        }

        const cleanText = text.replace(/\s+/g, "");

        // 🔍 1. Find matching AWB
        const awbFound = awbList.find(awb => cleanText.includes(awb));
        if (!awbFound) continue;

        // 🔍 2. Find Shipping Bill Number (flexible)
        const sbMatch = text.match(
          /(shipping\s*bill\s*(no|number)?[:\-]?\s*)(\d{6,15})/i
        );

        if (!sbMatch) continue;

        const shippingBillNo = sbMatch[3];
        const folderName = shippingBillNo.slice(-5);

        if (!reportData[awbFound]) {
          reportData[awbFound] = {
            shippingBill: shippingBillNo,
            folder: folderName,
            files: []
          };
        }

        zip.folder(folderName).file(file.name, file);
        reportData[awbFound].files.push(file.name);

        console.log(
          "MATCH:",
          "AWB =", awbFound,
          "SB =", shippingBillNo,
          "FOLDER =", folderName,
          "FILE =", file.name
        );
      }

      // 📊 Excel Report
      const excelRows = Object.keys(reportData).map(awb => ({
        "AWB Number": awb,
        "Shipping Bill Number": reportData[awb].shippingBill,
        "Folder Name": reportData[awb].folder,
        "PDF Files": reportData[awb].files.join(", ")
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array"
      });

      zip.file("REPORT.xlsx", excelBuffer);

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "AWB_SHIPPINGBILL_RESULT.zip");

    } catch (err) {
      console.error(err);
      alert("Error while processing PDFs");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>AWB + Shipping Bill Folder Creator</h3>

      <textarea
        rows="6"
        placeholder="Enter AWB numbers (one per line)"
        value={awbText}
        onChange={e => setAwbText(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <label
        style={{
          background: "#007bff",
          color: "#fff",
          padding: "10px 16px",
          cursor: "pointer",
          borderRadius: 4,
          display: "inline-block"
        }}
      >
        Upload PDFs
        <input
          type="file"
          multiple
          accept="application/pdf"
          style={{ display: "none" }}
          onChange={e => handleFiles(e.target.files)}
        />
      </label>

      {loading && <p style={{ marginTop: 10 }}>Processing PDFs…</p>}
    </div>
  );
};

export default Check;
