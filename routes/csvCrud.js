const express = require("express");
const router = express.Router();
const csvtojson = require("csvtojson");
const Csv = require("../models/csv");

const multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".csv"); //Appending .csv
  },
});

var upload = multer({ storage: storage });

router.get("/upload", (req, res) => {
  res.render("upload");
});

router.post("/upload", upload.single("csv"), async (req, res) => {
  await csvtojson()
    .fromFile(req.file.path)
    .then(async (csvData) => {
      // console.log(csvData);
      const filename = req.file.originalname;
      const newFile = await Csv.insertMany([{ filename, csvData }])
        .then(() => {
          console.log("inserted");
          res.redirect("files");
        })
        .catch((e) => console.log(e));
    });
});

router.get("/files", async (req, res) => {
  const files = await Csv.find({});
  res.render("files", { files });
});

router.get("/file/:id", async (req, res) => {
  const { id } = req.params;
  const file = await Csv.findById(id);
  // console.log(file);
  res.render("show", { file });
});

router.delete("/file/:id", async (req, res) => {
  const { id } = req.params;
  await Csv.findByIdAndDelete(id);
  res.redirect("/files");
});

router.get("/file/:id/add/", async (req, res) => {
  const { id } = req.params;
  const file = await Csv.findById(id);
  // await file.csvData.push(stu)
  // console.log(doc);
  res.render("add", { file });
});

router.put("/file/:id/add", async (req, res) => {
  const { studentUsn, studentName, IA1, IA2, IA3, Total } = req.body.csvData;
  const { id } = req.params;
  const file = await Csv.findById(id);
  file.csvData.push({ studentUsn, studentName, IA1, IA2, IA3, Total });
  await file.save();
  res.redirect(`/file/${id}`);
});

router.get("/file/:id/edit/:dataID", async (req, res) => {
  const { id, dataID } = req.params;
  const file = await Csv.findById(id);
  const doc = file.csvData.id(dataID);
  // console.log(doc);
  res.render("edit", { id, doc });
});

router.put("/file/:id/edit/:dataID", async (req, res) => {
  const { studentUsn, studentName, IA1, IA2, IA3, Total } = req.body.csvData;
  const { id, dataID } = req.params;
  const file = await Csv.findById(id);
  const doc = file.csvData.id(dataID);
  console.log(doc);
  doc.studentUsn = studentUsn;
  doc.studentName = studentName;
  doc.IA1 = IA1;
  doc.IA2 = IA2;
  doc.IA3 = IA3;
  doc.Total = Total;
  await file.save();
  res.redirect(`/file/${id}`);
});

router.delete("/file/:id/data/:dataID", async (req, res) => {
  const { id, dataID } = req.params;
  const file = await Csv.findById(id);
  file.csvData.id(dataID).remove();
  await file.save();
  console.log(file);
  res.redirect(`/file/${id}`);
});

router.delete("/file/:id", async (req, res) => {
  const { id } = req.params;
  await Csv.findByIdAndDelete(id);
  res.redirect("/files");
});

module.exports = router;
