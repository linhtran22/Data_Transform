

function readMe() {
  const vinFileDate = moment().format("MM/DD/YYYY");
  
  document.getElementById("status").innerHTML = "...Running";

  //   d3.csv("../data/myDocument.csv", function (data) {
  // data is entire loaded csv array of objects, each row is an object
  // Promise async/sync
  // originaldata = [{row1},{row2},...]
  // newTable = [{newRow1},{newRow2},...]
  d3.csv("../data/myExcelFile.csv", (originaldata) => {
    // TODO: declare newTable
    let newRowAdded = "";
    let header = "";
    const array = Object.keys(originaldata[0]); //header

    // add header
    for (let j = 0; j < array.length; j++) {
      header += "<th>" + array[j] + "</th>";
    }

    // add new header "VIN File Date"
    header += "<th>" + "VIN File Date" + "</th>";
    header += "<th>" + "GCM File Number" + "</th>";
    
    // each row is an object
    originaldata.forEach((originalDataRow) => {
      // bang voi function(originalDataRow) originalDataRow is an object
      // . 1st => file hien tai, . 2nd => thoat ra file truoc do, / file can vo

      // requirement: if row has all empty values => remove
      // Object.values(obj) returns array of values

      // console.log("below is the row object");
      // console.log(originalDataRow);

      //const rowArray = Object.values(originalDataRow); // array
      let emptyRow = true;

      // TODO: declare newRow
      let row = "";
      for (const prop in originalDataRow) {
        // user is property; this is for loop of object
        // console.log(`loop 1 ------ ${prop}: ${originalDataRow[prop]}----`);

        if (
          originalDataRow[prop] !== "" &&
          originalDataRow[prop] != null &&
          originalDataRow[prop] != undefined
        ) {
          emptyRow = false;
        }
        // console.log(`if-else here: ${prop}` + originalDataRow[prop] + " empty row is t/f: " + emptyRow);

        // console.log("hello!");
        if (prop == "Contract End Date" && originalDataRow[prop] == "") {
          // console.log("It is empty here! ");
          // console.log("Begin date: " + originalDataRow["Contract Begin Date"]);
          // console.log("type "+ (typeof originalDataRow["Contract Begin Date"]) + " new date moment " + moment(originalDataRow["Contract Begin Date"], "MM/DD/YYYY"));
          var newDate = moment(originalDataRow["Contract Begin Date"])
            .add(3, "years")
            .format("MM/DD/YYYY");
          // console.log("new Date: " + newDate);
          // originalDataRow[prop] = newDate; //fix original - no
          // console.log("End Date in originalDataRow: " + originalDataRow[prop]);
          row += "<td>" +  newDate + "</td>"; // string
          // TODO: object add new prop
        } else {
          row += "<td>" +  originalDataRow[prop] + "</td>";
          // TODO: object add new prop
        }

      }
      // if emptyRow is not true => print row. if emptyRow is true => skip/don't print Row

      row += "<td>" + vinFileDate + "</td>";
      // TODO: object add new prop
      // console.log ("row ------------------:" + row);

      const gcmFileNumber = document.getElementById("GCM_Number").value;
      row += "<td>" + gcmFileNumber + "</td>";
      // TODO: object add new prop

      if (!emptyRow) {
        newRowAdded += "<tr>" + row + "</tr>";
        // TODO: object add new row object
      }
    });
// sort by VIN number => duplicate VIN # delete
// sort by end date => newest -> oldest

    document.getElementById("my_file").innerHTML = header + newRowAdded;
    document.getElementById("status").innerHTML = "Done";
  });
  //   this is executed before header and newRowAdded has data. they are empty string right now
  //   document.getElementById("my_file").innerHTML = header + newRowAdded;
}

// function myFunction(){
//   x = document.getElementById("edu").value;
//   document.getElementById("eduform").innerHTML = x;
// }

//https://momentjs.com/