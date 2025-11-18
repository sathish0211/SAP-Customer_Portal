const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const { parseStringPromise } = require("xml2js");  // REQUIRED

const app = express();
app.use(cors());
app.use(bodyParser.json());

// SAP Login URL
const SAP_LOGIN_URL =
  "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zsg_rfc_login?sap-client=100";

// SAP Profile URL
const SAP_PROFILE_URL =
  "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zsg_rfc_profile?sap-client=100";

// SAP Credentials
const SAP_USERNAME = "k901890";
const SAP_PASSWORD = "Sathish@gp0212";

// ----------------------- LOGIN API -----------------------
app.post("/login", async (req, res) => {
  const { customerId, password } = req.body;

  const soapRequestXML = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                    xmlns:tns="urn:sap-com:document:sap:rfc:functions">
    <soapenv:Header/>
    <soapenv:Body>
      <tns:ZSG_FM_LOGIN>
        <IV_CUSTOMER_ID>${customerId}</IV_CUSTOMER_ID>
        <IV_PASSWORD>${password}</IV_PASSWORD>
      </tns:ZSG_FM_LOGIN>
    </soapenv:Body>
  </soapenv:Envelope>`;

  try {
    const response = await axios.post(SAP_LOGIN_URL, soapRequestXML, {
      headers: { "Content-Type": "text/xml" },
      auth: { username: SAP_USERNAME, password: SAP_PASSWORD },
    });

    const jsonResult = await parseStringPromise(response.data, {
      explicitArray: false,
    });

    const soapResponse =
      jsonResult["soap-env:Envelope"]["soap-env:Body"]["n0:ZSG_FM_LOGINResponse"];

    if (soapResponse.EV_STATUS === "SUCCESS") {
      return res.json({ status: "SUCCESS" });
    } else {
      return res.json({ status: "FAIL" });
    }
  } catch (err) {
    return res.status(500).json({ status: "ERROR", error: err.message });
  }
});

// ----------------------- PROFILE API -----------------------
app.post("/profile", async (req, res) => {
  const { customerId } = req.body;

  const soapRequestXML = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                    xmlns:tns="urn:sap-com:document:sap:rfc:functions">
    <soapenv:Header/>
    <soapenv:Body>
      <tns:ZSG_FM_PROFILE>
        <IV_CUSTOMER_ID>${customerId}</IV_CUSTOMER_ID>
      </tns:ZSG_FM_PROFILE>
    </soapenv:Body>
  </soapenv:Envelope>`;

  try {
    const response = await axios.post(SAP_PROFILE_URL, soapRequestXML, {
      headers: { "Content-Type": "text/xml" },
      auth: { username: SAP_USERNAME, password: SAP_PASSWORD },
    });

    const jsonResult = await parseStringPromise(response.data, {
      explicitArray: false,
    });

    const soapResponse =
      jsonResult["soap-env:Envelope"]["soap-env:Body"]["n0:ZSG_FM_PROFILEResponse"];

    return res.json({
      status: "SUCCESS",
      message: soapResponse.EV_MESSAGE,
      profile: soapResponse.EV_PROFILE,
    });

  } catch (err) {
    console.log("SAP ERROR:", err);
    return res.status(500).json({ status: "ERROR", error: err.message });
  }
});


// Invoice details
app.post("/invoice-details", async (req, res) => {
  const { customerId } = req.body;

  // SOAP XML request for Invoice Details RFC
  const soapRequestXML = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                    xmlns:tns="urn:sap-com:document:sap:rfc:functions">
    <soapenv:Header/>
    <soapenv:Body>
      <tns:ZSG_FM_INVOICE_DETAIL>
        <IV_CUSTOMER_ID>${customerId}</IV_CUSTOMER_ID>
      </tns:ZSG_FM_INVOICE_DETAIL>
    </soapenv:Body>
  </soapenv:Envelope>
  `;

  try {
    const INVOICE_URL =
      "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zsg_rfc_invoice_detail?sap-client=100";

    // Call SAP SOAP Endpoint
    const response = await axios.post(INVOICE_URL, soapRequestXML, {
      headers: {
        "Content-Type": "text/xml",
        SOAPAction: "",
      },
      auth: {
        username: SAP_USERNAME,
        password: SAP_PASSWORD,
      },
    });

    // Convert XML to JSON
    const jsonResult = await parseStringPromise(response.data, {
      explicitArray: false,
    });

    const soapResponse =
      jsonResult["soap-env:Envelope"]["soap-env:Body"]["n0:ZSG_FM_INVOICE_DETAILResponse"];

    const invoiceList = soapResponse.EV_INVOICE.item;

    // Ensure invoice list is an array
    const invoices = Array.isArray(invoiceList)
      ? invoiceList
      : [invoiceList];

    return res.json({
      status: "SUCCESS",
      invoices,
    });

  } catch (error) {
    console.error("SAP Invoice Error:", error);

    return res.status(500).json({
      status: "ERROR",
      message: "Failed to fetch invoice details from SAP",
      error: error.message,
    });
  }
});

// ----------------------- PAYMENTS & AGING API -----------------------
app.post("/payments-aging", async (req, res) => {
  const { customerId } = req.body;

  // SOAP XML request for Payments & Aging RFC
  const soapRequestXML = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                    xmlns:tns="urn:sap-com:document:sap:rfc:functions">
    <soapenv:Header/>
    <soapenv:Body>
      <tns:ZSG_FM_PAYMENT_AGING>
        <IV_CUSTOMER_ID>${customerId}</IV_CUSTOMER_ID>
      </tns:ZSG_FM_PAYMENT_AGING>
    </soapenv:Body>
  </soapenv:Envelope>
  `;

  try {
    const AGING_URL =
      "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zsg_rfc_payments_aging?sap-client=100";

    // Call SAP SOAP Endpoint
    const response = await axios.post(AGING_URL, soapRequestXML, {
      headers: {
        "Content-Type": "text/xml",
        SOAPAction: "",
      },
      auth: {
        username: SAP_USERNAME,
        password: SAP_PASSWORD,
      },
    });

    // Convert XML to JSON
    const jsonResult = await parseStringPromise(response.data, {
      explicitArray: false,
    });

    // Extract main response node
    const soapResponse =
      jsonResult["soap-env:Envelope"]["soap-env:Body"][
        "n0:ZSG_FM_PAYMENT_AGINGResponse"
      ];

    const items = soapResponse.EV_PAYMENTS_AGING.item;

    // Make sure result is an array
    const payments = Array.isArray(items) ? items : [items];

    return res.json({
      status: "SUCCESS",
      payments,
    });

  } catch (error) {
    console.error("SAP Payments Aging Error:", error);

    return res.status(500).json({
      status: "ERROR",
      message: "Failed to fetch Payments & Aging from SAP",
      error: error.message,
    });
  }
});

// ----------------------- CREDIT / DEBIT MEMO API -----------------------
app.post("/credit-debit-memo", async (req, res) => {
  const { customerId } = req.body;

  // SOAP XML request for Memo RFC
  const soapRequestXML = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                    xmlns:tns="urn:sap-com:document:sap:rfc:functions">
    <soapenv:Header/>
    <soapenv:Body>
      <tns:ZSG_FM_MEMO>
        <IV_CUSTOMER_ID>${customerId}</IV_CUSTOMER_ID>
      </tns:ZSG_FM_MEMO>
    </soapenv:Body>
  </soapenv:Envelope>
  `;

  try {
    const MEMO_URL =
      "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zsg_rfc_memo?sap-client=100";

    // Call SAP RFC
    const response = await axios.post(MEMO_URL, soapRequestXML, {
      headers: {
        "Content-Type": "text/xml",
        SOAPAction: "",
      },
      auth: {
        username: SAP_USERNAME,
        password: SAP_PASSWORD,
      },
    });

    // Convert XML → JSON
    const jsonResult = await parseStringPromise(response.data, {
      explicitArray: false,
    });

    const soapResponse =
      jsonResult["soap-env:Envelope"]["soap-env:Body"][
        "n0:ZSG_FM_MEMOResponse"
      ];

    const memoList = soapResponse.EV_MEMO.item;

    // Ensure that items are always an array
    const memos = Array.isArray(memoList) ? memoList : [memoList];

    return res.json({
      status: "SUCCESS",
      memos,
    });

  } catch (error) {
    console.error("SAP Credit/Debit Memo Error:", error);

    return res.status(500).json({
      status: "ERROR",
      message: "Failed to fetch credit/debit memo from SAP",
      error: error.message,
    });
  }
});

// ----------------------- OVERALL SALES SUMMARY API -----------------------
app.post("/overall-sales-data", async (req, res) => {
  const { customerId } = req.body;

  // SOAP XML request for Sales Summary RFC
  const soapRequestXML = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                    xmlns:tns="urn:sap-com:document:sap:rfc:functions">
    <soapenv:Header/>
    <soapenv:Body>
      <tns:ZSG_FM_SALES_SUMMARY>
        <IV_CUSTOMER_ID>${customerId}</IV_CUSTOMER_ID>
      </tns:ZSG_FM_SALES_SUMMARY>
    </soapenv:Body>
  </soapenv:Envelope>
  `;

  try {
    const SUMMARY_URL =
      "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zsg_rfc_sales_summary?sap-client=100";

    // Call SAP SOAP Endpoint
    const response = await axios.post(SUMMARY_URL, soapRequestXML, {
      headers: {
        "Content-Type": "text/xml",
        SOAPAction: "",
      },
      auth: {
        username: SAP_USERNAME,
        password: SAP_PASSWORD,
      },
    });

    // Convert XML → JSON
    const jsonResult = await parseStringPromise(response.data, {
      explicitArray: false,
    });

    // Extract SAP response
    const soapResponse =
      jsonResult["soap-env:Envelope"]["soap-env:Body"][
        "n0:ZSG_FM_SALES_SUMMARYResponse"
      ];

    const summaryList = soapResponse.EV_SALES_SUMMARY.item;

    // Ensure array
    const summary = Array.isArray(summaryList)
      ? summaryList
      : [summaryList];

    return res.json({
      status: "SUCCESS",
      summary,
    });

  } catch (error) {
    console.error("SAP Sales Summary Error:", error);

    return res.status(500).json({
      status: "ERROR",
      message: "Failed to fetch Overall Sales Data from SAP",
      error: error.message,
    });
  }
});


// ----------------------- INQUIRY DATA API -----------------------
app.post("/inquiry-data", async (req, res) => {
  const { customerId } = req.body;

  // SOAP XML Request for Inquiry Data RFC
  const soapRequestXML = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                    xmlns:tns="urn:sap-com:document:sap:rfc:functions">
    <soapenv:Header/>
    <soapenv:Body>
      <tns:ZSG_FM_INQUIRY>
        <IV_CUSTOMER_ID>${customerId}</IV_CUSTOMER_ID>
      </tns:ZSG_FM_INQUIRY>
    </soapenv:Body>
  </soapenv:Envelope>
  `;

  try {
    const INQUIRY_URL =
      "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zsg_rfc_inquiry?sap-client=100";

    // Call SAP SOAP Endpoint
    const response = await axios.post(INQUIRY_URL, soapRequestXML, {
      headers: {
        "Content-Type": "text/xml",
        SOAPAction: "",
      },
      auth: {
        username: SAP_USERNAME,
        password: SAP_PASSWORD,
      },
    });

    // Convert XML → JSON
    const jsonResult = await parseStringPromise(response.data, {
      explicitArray: false,
    });

    // Extract SAP Response Node
    const soapResponse =
      jsonResult["soap-env:Envelope"]["soap-env:Body"][
        "n0:ZSG_FM_INQUIRYResponse"
      ];

    const inquiryList = soapResponse.EV_INQUIRY.item;

    // Always ensure array format
    const inquiries = Array.isArray(inquiryList)
      ? inquiryList
      : [inquiryList];

    return res.json({
      status: "SUCCESS",
      inquiries,
    });

  } catch (error) {
    console.error("SAP Inquiry Data Error:", error);

    return res.status(500).json({
      status: "ERROR",
      message: "Failed to fetch Inquiry Data from SAP",
      error: error.message,
    });
  }
});

// ----------------------- SALES ORDER API -----------------------
app.post("/sales-order", async (req, res) => {
  const { customerId } = req.body;

  // SOAP XML request for Sales Order RFC
  const soapRequestXML = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                    xmlns:tns="urn:sap-com:document:sap:rfc:functions">
    <soapenv:Header/>
    <soapenv:Body>
      <tns:ZSG_FM_SALESORDER>
        <IV_CUSTOMER_ID>${customerId}</IV_CUSTOMER_ID>
      </tns:ZSG_FM_SALESORDER>
    </soapenv:Body>
  </soapenv:Envelope>
  `;

  try {
    const SALESORDER_URL =
      "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zsg_rfc_salesorder?sap-client=100";

    // Call SAP SOAP Endpoint
    const response = await axios.post(SALESORDER_URL, soapRequestXML, {
      headers: {
        "Content-Type": "text/xml",
        SOAPAction: "",
      },
      auth: {
        username: SAP_USERNAME,
        password: SAP_PASSWORD,
      },
    });

    // Convert XML → JSON
    const jsonResult = await parseStringPromise(response.data, {
      explicitArray: false,
    });

    // Extract SAP Response Node
    const soapResponse =
      jsonResult["soap-env:Envelope"]["soap-env:Body"][
        "n0:ZSG_FM_SALESORDERResponse"
      ];

    const list = soapResponse.EV_SALESORDER.item;

    // Always return array
    const salesOrders = Array.isArray(list) ? list : [list];

    return res.json({
      status: "SUCCESS",
      salesOrders,
    });

  } catch (error) {
    console.error("SAP Sales Order Error:", error);

    return res.status(500).json({
      status: "ERROR",
      message: "Failed to fetch Sales Order from SAP",
      error: error.message,
    });
  }
});

// ----------------------- DELIVERY API -----------------------
app.post("/delivery", async (req, res) => {
  const { customerId } = req.body;

  // SOAP XML request for Delivery RFC
  const soapRequestXML = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                    xmlns:tns="urn:sap-com:document:sap:rfc:functions">
    <soapenv:Header/>
    <soapenv:Body>
      <tns:ZSG_FM_DELIVERY>
        <IV_CUSTOMER_ID>${customerId}</IV_CUSTOMER_ID>
      </tns:ZSG_FM_DELIVERY>
    </soapenv:Body>
  </soapenv:Envelope>
  `;

  try {
    const DELIVERY_URL =
      "http://172.17.19.24:8000/sap/bc/srt/scs/sap/zsg_rfc_delivery?sap-client=100";

    // Call SAP SOAP Endpoint
    const response = await axios.post(DELIVERY_URL, soapRequestXML, {
      headers: {
        "Content-Type": "text/xml",
        SOAPAction: "",
      },
      auth: {
        username: SAP_USERNAME,
        password: SAP_PASSWORD,
      },
    });

    // Convert XML → JSON
    const jsonResult = await parseStringPromise(response.data, {
      explicitArray: false,
    });

    // Extract SAP Response Node
    const soapResponse =
      jsonResult["soap-env:Envelope"]["soap-env:Body"][
        "n0:ZSG_FM_DELIVERYResponse"
      ];

    const deliveryList = soapResponse.EV_DELIVERY.item;

    // Ensure always array
    const deliveries = Array.isArray(deliveryList)
      ? deliveryList
      : [deliveryList];

    return res.json({
      status: "SUCCESS",
      deliveries,
    });

  } catch (error) {
    console.error("SAP Delivery Error:", error);

    return res.status(500).json({
      status: "ERROR",
      message: "Failed to fetch Delivery Data from SAP",
      error: error.message,
    });
  }
});



// --------------------- SERVER START -----------------------
app.listen(3001, () => {
  console.log("Backend running on http://localhost:3001");
});
