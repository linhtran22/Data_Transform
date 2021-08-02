var reader = new FileReader();
const vinFileDate = moment().format("MM/DD/YYYY");
let newDataArr = [];
let uniqueVIN = [];

function buildTableData(dataArr) {
  let newStringRow = "";
  for (let i = 0; i < dataArr.length; i++) {
    var eachRow = `<tr>
                    <td> ${dataArr[i]["Customer Name"]} </td>
                    <td> ${dataArr[i]["VIN"]} </td>
                    <td> ${dataArr[i]["Make"]} </td>
                    <td> ${dataArr[i]["Model"]} </td>
                    <td> ${dataArr[i]["Year"]} </td>
                    <td> ${dataArr[i]["Contract Begin Date"]} </td>
                    <td> ${dataArr[i]["Contract End Date"]} </td>
                    <td> ${dataArr[i]["Vin File Date"]} </td>
                    <td> ${dataArr[i]["GCM File Number"]} </td>     
    `;
    newStringRow += eachRow;
  }

  return newStringRow;
}

function loadFile() {
  var file = document.querySelector("input[type=file]").files[0];
  reader.addEventListener("load", parseFile, false);
  if (file) {
    reader.readAsText(file);
  }
}

function parseFile() {
  const gcmFileNumber = document.getElementById("GCM_Number").value;
  var data = d3.csv.parse(reader.result);

  let header = "";
  const array = Object.keys(data[0]); //header
  // add header
  for (let j = 0; j < array.length; j++) {
    header += "<th>" + array[j] + "</th>";
  }

  header += "<th>" + "VIN File Date" + "</th>";
  header += "<th>" + "GCM File Number" + "</th>";

  data.forEach((originalDataRow) => {
    let emptyRow = true;
    let newRowObj = {};
    let existedVin = false;

    for (const prop in originalDataRow) {
      if (
        originalDataRow[prop] !== "" &&
        originalDataRow[prop] != null &&
        originalDataRow[prop] != undefined
      ) {
        emptyRow = false;
      }

      newRowObj[prop] = originalDataRow[prop];

      if (prop == "Contract Begin Date") {
        let newBeginDate = moment(newRowObj["Contract Begin Date"]).format(
          "MM/DD/YYYY"
        );
        newRowObj[prop] = newBeginDate;
      }

      if (prop == "Contract End Date" && originalDataRow[prop] == "") {
        var newEndDate = moment(originalDataRow["Contract Begin Date"])
          .add(3, "years")
          .format("MM/DD/YYYY");
        newRowObj[prop] = newEndDate;
      } else if (prop == "Contract End Date") {
        newEndDate = moment(newRowObj["Contract End Date"]).format(
          "MM/DD/YYYY"
        );
        newRowObj[prop] = newEndDate;
      }
    }

    newRowObj["Vin File Date"] = vinFileDate;

    console.log("GCM File Number: " + gcmFileNumber);
    newRowObj["GCM File Number"] = gcmFileNumber;

    if (!uniqueVIN.includes(originalDataRow["VIN"])) {
      uniqueVIN.push(originalDataRow["VIN"]);
    } else {
      existedVin = true;
    }
    if (!emptyRow && !existedVin) {
      newDataArr.push(newRowObj);
    }
  });

  newDataArr.sort((a, b) => a["VIN"].localeCompare(b["Vin"]));
  newDataArr.sort(function (a, b) {
    return new Date(b["Contract End Date"]) - new Date(a["Contract End Date"]);
  });
  let newStringRow = buildTableData(newDataArr);

  document.getElementById("my_file").innerHTML = header + newStringRow;
}
