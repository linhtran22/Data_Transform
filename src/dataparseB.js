function readMe() {
  const vinFileDate = moment().format("MM/DD/YYYY");

  document.getElementById("status").innerHTML = "...Running";

  // data is entire loaded csv array of objects, each row is an object
  // Promise async/sync
  // originaldata = [{row1},{row2},...]
  // newTable = [{newRow1},{newRow2},...]

  let dataArray = [];

  d3.csv("../data/myExcelFile.csv", (originaldata) => {
    // TODO: declare newTable
    let newRowAdded = "";
    let header = "";
    const array = Object.keys(originaldata[0]); //header

    // add header
    for (let j = 0; j < array.length; j++) {
      dataArray.push(array[j]);
    }

    dataArray.push("Vin File Date");
    dataArray.push("GCM File Number");

    // each row is an object
    originaldata.forEach((originalDataRow) => {
      let emptyRow = true;

      let newRowObj = {};

      //  console.log(originalDataRow);

      for (const prop in originalDataRow) {
        if (
          originalDataRow[prop] !== "" &&
          originalDataRow[prop] != null &&
          originalDataRow[prop] != undefined
        ) {
          emptyRow = false;
        }

        newRowObj[prop] = originalDataRow[prop];

        if (prop == "Contract End Date" && originalDataRow[prop] == "") {
          var newDate = moment(originalDataRow["Contract Begin Date"])
            .add(3, "years")
            .format("MM/DD/YYYY");
          newRowObj[prop] = newDate;
        }
      }
      newRowObj["Vin File Date"] = vinFileDate;
      const gcmFileNumber = document.getElementById("GCM_Number").value;
      newRowObj["GCM File Number"] = gcmFileNumber;
      //  dataArray.push(newRowObj);

      if (!emptyRow) {
        dataArray.push(newRowObj);
      }
    });
    // sort by VIN number => duplicate VIN # delete
    dataArray = sortByVin(dataArray);

    // sort by end date => newest -> oldest
    dataArray.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return (
        new Date(b["Contract End Date"]) - new Date(a["Contract End Date"])
      );
    });

    dataArray.forEach((item) => console.log(item));

    document.getElementById("my_file").innerHTML = header + newRowAdded;
    document.getElementById("status").innerHTML = "Done";
  });
  //   this is executed before header and newRowAdded has data. they are empty string right now
  //   document.getElementById("my_file").innerHTML = header + newRowAdded;
}

function sortByVin(comingArr) {
  const result = [];
  const map = new Map();
  for (const item of comingArr) {
    if (!map.has(item["VIN"])) {
      map.set(item["VIN"], true); // set any value to Map
      result.push({
        "Customer Name": item["Customer Name"],
        VIN: item["VIN"],
        Make: item["Make"],
        Model: item["Model"],
        Year: item["Year"],
        "Contract Begin Date": item["Contract Begin Date"],
        "Contract End Date": item["Contract End Date"],
      });
    }
  }
  return result;
}

// function myFunction(){
//   x = document.getElementById("edu").value;
//   document.getElementById("eduform").innerHTML = x;
// }

//https://momentjs.com/
