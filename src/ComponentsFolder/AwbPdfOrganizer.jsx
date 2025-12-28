import React, { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import * as pdfjsLib from "pdfjs-dist";

import { extractAwb, detectType } from "./Utils";
import { extractTextWithOCR } from "./OcrUtilis";
import { pdfPageToImage } from "./pdfToImage";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const AwbOrganizer = () => {
  const [awbText, setAwbText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFiles = async (files) => {
    setLoading(true);

    const awbList = awbText.split("\n").map(a => a.trim()).filter(Boolean);
    const tracker = {};
    const zip = new JSZip();

    for (const file of files) {
      const buffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);

        // 🔹 Try normal text
        const content = await page.getTextContent();
        const pageText = content.items.map(it => it.str).join(" ");

        if (pageText.trim().length > 20) {
          fullText += pageText;
        } else {
          // 🔥 OCR fallback
          const image = await pdfPageToImage(page);
          const ocrText = await extractTextWithOCR(image);
          fullText += ocrText;
        }
      }

      const awb = extractAwb(fullText);
      if (!awb || !awbList.includes(awb)) continue;

      const type = detectType(fullText);
      if (!type) continue;

      if (!tracker[awb]) tracker[awb] = {};
      tracker[awb][type] = file;
    }

    // ✅ Folder creation only when all 3 present
    Object.keys(tracker).forEach(awb => {
      const d = tracker[awb];
      if (d.invoice && d.shipping && d.airwaybill) {
        const folder = zip.folder(awb.slice(-5));
        folder.file("invoice.pdf", d.invoice);
        folder.file("shipping.pdf", d.shipping);
        folder.file("airwaybill.pdf", d.airwaybill);
      }
    });

    saveAs(await zip.generateAsync({ type: "blob" }), "Verified_AWB.zip");
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>AWB PDF Folder Creator (OCR Enabled)</h2>

      <textarea
        rows="5"
        placeholder="Enter AWB numbers (one per line)"
        value={awbText}
        onChange={(e) => setAwbText(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <label style={{ background: "#007bff", color: "#fff", padding: 10, cursor: "pointer" }}>
        Upload PDFs
        <input
          type="file"
          multiple
          accept="application/pdf"
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {loading && <p>Processing PDFs (OCR running… please wait)</p>}
    </div>
  );
};

export default AwbOrganizer;
