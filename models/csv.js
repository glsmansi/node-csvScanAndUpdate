const mongoose = require("mongoose");

const CsvFileSchema = new mongoose.Schema([
  {
    filename: String,
    csvData: [
      {
        studentUsn: String,
        studentName: String,
        IA1: Number,
        IA2: Number,
        IA3: Number,
        Total: Number,
      },
    ],
  },
]);

const Csv = mongoose.model("Csv", CsvFileSchema);
module.exports = Csv;
