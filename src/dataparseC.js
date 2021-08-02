function readMe() {
  
  const vinFileDate = moment().format("MM/DD/YYYY");

  document.getElementById("status").innerHTML = "...Running";

  // data is entire loaded csv array of objects, each row is an object
  // Promise async/sync
  // originaldata = [{row1},{row2},...]
  // newDataArr = [{newRow1},{newRow2},...]

  let newDataArr = [];
  const gcmFileNumber = document.getElementById("GCM_Number").value;

  //loop
  d3.csv("../data/myExcelFile.csv", (originaldata) => {
    // TODO: declare newTable
    let newRowAdded = "";
    let header = "";
    const array = Object.keys(originaldata[0]); //header
    // add header
    for (let j = 0; j < array.length; j++) {
      header += "<th>" + array[j] + "</th>";
      //  newDataArr.push(array[j]);
    }

    header += "<th>" + "VIN File Date" + "</th>";
    header += "<th>" + "GCM File Number" + "</th>";

    let uniqueVIN = [];

    originaldata.forEach((originalDataRow) => {
      let emptyRow = true;

      let newRowObj = {};

      let existedVin = false;

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

        if (prop == "Contract Begin Date") {
        let  newBeginDate = moment(newRowObj["Contract Begin Date"]).format("MM/DD/YYYY");
          newRowObj[prop] = newBeginDate;
        }

        if (prop == "Contract End Date" && originalDataRow[prop] == "") {
          var newEndDate = moment(originalDataRow["Contract Begin Date"])
            .add(3, "years")
            .format("MM/DD/YYYY");
          newRowObj[prop] = newEndDate;
        } else if (prop == "Contract End Date") {
          newEndDate = moment(newRowObj["Contract End Date"]).format("MM/DD/YYYY");
          newRowObj[prop] = newEndDate;
        }
      }

      newRowObj["Vin File Date"] = vinFileDate;

      newRowObj["GCM File Number"] = gcmFileNumber;

      // uniqueVIN  is empty []
      if (!uniqueVIN.includes(originalDataRow["VIN"])) {
        uniqueVIN.push(originalDataRow["VIN"]);
      } else {
        existedVin = true;
      }

      console.log(uniqueVIN);

      if (!emptyRow && !existedVin) {
        newDataArr.push(newRowObj);
      }
    });
    // sort by VIN number => duplicate VIN # delete
    //newDataArr = sortByVin(newDataArr);

    // let a = ["1", "1", "2", "3", "3", "1"];
    // let unique = a.filter((item, i, ar) => ar.indexOf(item) === i);
    // console.log(unique);
    // curr row = B
    // originaldata = [
    // {
    // customerName: "A",
    // VINnumber: "SALGV2EF1EA126208"
    // EndDate: 03/02/2021
    // },
    // // {
    // customerName: "B",
    // VINnumber: "SALGV2EF1EA126208"
    // EndDate: 03/02/21
    // },,
    // ...]
    //  uniqueVin = ["SALGV2EF1EA126208"]
    // forloop
    //   if uniqueVin dont includes SALGV2EF1EA126208
    //     uniqeVin add SALGV2EF1EA126208
    //      VinNum            Enddate
    // sort firstname then sort lastname,
    //  originaldata = [
    // {
    // lastname: "Nguyen",
    // firstname: "An"
    // }
    // {
    // lastname: "Nguyen",
    // firstname: "Binh"
    // },

    //  {
    // lastname: "Tran",
    // firstname: "An"
    // },
    // ...]

    newDataArr.sort((a, b) => a["VIN"].localeCompare(b["Vin"]));

    // sort by end date => newest -> oldest
    newDataArr.sort(function (a, b) {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return (
        new Date(b["Contract End Date"]) - new Date(a["Contract End Date"])
      );
    });

    //  newDataArr.forEach((item) => console.log(item)); // log each item of the array

    let newStringRow = buildTableData(newDataArr);

    document.getElementById("my_file").innerHTML = header + newStringRow;
    document.getElementById("status").innerHTML = "Done";
  });
}

// function sortByVin(comingArr) {
//   const result = [];
//   const map = new Map();
//   for (const item of comingArr) {
//     if (!map.has(item["VIN"])) {
//       map.set(item["VIN"], true); // set any value to Map
//       result.push({
//         "Customer Name": item["Customer Name"],
//         VIN: item["VIN"],
//         Make: item["Make"],
//         Model: item["Model"],
//         Year: item["Year"],
//         "Contract Begin Date": item["Contract Begin Date"],
//         "Contract End Date": item["Contract End Date"],
//         "Vin File Date": item["Vin File Date"],
//         "GCM File Number": item["GCM File Number"],
//       });
//     }
//   }
//   return result;
// }

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

//https://momentjs.com/
