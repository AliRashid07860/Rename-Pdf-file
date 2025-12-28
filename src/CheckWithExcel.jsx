import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const CheckWithExcel = () => {
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
    const folderData = {}; 
    // { awb: { count: number, files: [] } }

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

        // 🔑 Clean text (remove spaces/newlines)
        const cleanText = text.replace(/\s+/g, "");

        for (const awb of awbList) {
          if (cleanText.includes(awb)) {
            if (!folderData[awb]) {
              folderData[awb] = { count: 0, files: [] };
              zip.folder(awb);
            }

            folderData[awb].count++;
            folderData[awb].files.push(file.name);
            zip.folder(awb).file(file.name, file);

            console.log("MATCH:", awb, file.name);
            break; // ek PDF ek hi AWB me
          }
        }
      }

      // 📊 Excel data
      const excelData = Object.keys(folderData).map(awb => ({
        "AWB Number": awb,
        "Total PDFs": folderData[awb].count,
        "PDF Names": folderData[awb].files.join(", ")
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "AWB Report");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array"
      });

      zip.file("AWB_REPORT.xlsx", excelBuffer);

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, "AWB_MATCH_RESULT.zip");

    } catch (err) {
      console.error(err);
      alert("Error while processing PDFs");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>AWB → PDF Matcher with Excel Report</h3>

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

      {loading && <p style={{ marginTop: 10 }}>Processing PDFs, please wait…</p>}
    </div>
  );
};

export default CheckWithExcel;
