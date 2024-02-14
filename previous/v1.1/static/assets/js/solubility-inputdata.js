/**
 * This js file is made for solubility-inputdata.html
 */

// hard-coded labels
const projectLabels = [
    "name",
    "mw",
    "solidForm",
    "tmelt",
    "nhfus"
]
const colLabels = [
    "Solvent 1", 
    "Solvent 2", 
    "Solvent 3", 
    "Solv Frac 1 (solute-free)", 
    "Solv Frac 2 (solute-free)", 
    "Solv Frac 3 (solute-free)", 
    "T", 
    "XRPD",
    "Solubility*",
    "",
    "",
    "", 
    "Solute Lot #", 
    "ELN/Sample # of Measurement", 
    "Measurement Method",
    "Comments", 
];
const colLabelsDropdown = [
    ["wt frac", "vol frac"], // for solv frac 1 (2-3 become the same as selection)
    ["mg/g soln.", "mg/g solv", "mg/mL solv."], // for :1 columns under solubility
    ["wt%", "mg/g soln.", "mg/g solv", "mg/mL solv."] // for 1:4 columns under solubility*
]
const dataLabels = [
    "solvent1", 
    "solvent2", 
    "solvent3", 
    "solvFrac1", 
    "solvFrac2", 
    "solvFrac3", 
    "t", 
    "xrpd",
    "solubility1",
    "solubility2",
    "solubility3",
    "solubility4", 
    "lotNum", 
    "eln", 
    "measurementMethod",
    "comments", 
];
/**
 * void readFiles()
 * - Separates file uploads from solubility-inputdata.html into individual files
 * - Accounts for unique sheets in each file
 * - Calls filterSheet()
 * */
function readFiles() {
    console.log("Upload data button clicked")
    const fileInput = document.getElementById('fileInput');
    const selectedFiles = [...fileInput.files];
    // console.log(selectedFiles.length + " files: " + selectedFiles)
    for (index in selectedFiles) {
        // console.log(selectedFiles[index])
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            for (let i = 0; i < workbook.SheetNames.length; i++) {
                // console.log("Sheet " + i + " is: " + workbook.SheetNames[i])
                const sheetName = workbook.SheetNames[i];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });



                const jsonString = JSON.stringify(jsonData, null, 2);
                console.log(jsonString);
                filterSheet(sheetName, jsonData);
            }
        };
        reader.readAsArrayBuffer(selectedFiles[index])
    }
}

/**
 * void filterSheet(sheetName, jsonDataIn)
 * - Takes the name of the sheet and sheet json data as inputs
 * - Calls grabData() if the sheet is named for data input
 * @param {name of sheet} sheetName 
 * @param {JSON of any sheet} jsonDataIn 
 */
function filterSheet(sheetName, jsonDataIn) {
    console.log("filterSheet() called");
    // console.log(jsonDataIn);
    switch (sheetName) {
        case 'Indata':
            // console.log("indata");
            grabData(jsonDataIn);
            break;
        default:
            // console.log("not indata");
            break;
    }
}


/**
 * void grabData(jsonDataIn)
 * - Takes jsonData from correct (after filter) sheets
 * - Converts json data into jss objects, which act as dicts
 * - Uses hard-coded terms to look for, can be expanded manually
 * - Calls createTable()
 * @param {JSON of filtered sheet} jsonDataIn 
 */
function grabData(jsonDataIn) {
    //console.log("grabData(jsonDataIn) called");
    data = {}
    rows = jsonDataIn["data"]
    for (let rowIndex in rows) {
        let row = rows[rowIndex];
        if (row == null || row == "") {
            continue;
        }
        if (row[0]) {
            switch (row[0]) {
                case "Compound Name":
                    let numbers = row[1].match(/(\d+)/); // gives a list [numbers, numbers]
                    data["name"] = numbers[0]; // we only need one copy of name
                    
                    break;
                case "MW":
                    data["mw"] = [row[1], row[2]]; // value, unit
                    break;
                case "Solid Form":
                    data["solidForm"] = row[1];
                    break;
                default:
                    if (row[0].includes('Tmelt')) {
                        data["tmelt"] = [row[1], row[2]]; // value, unit
                    } else if (row[0].includes('Hfus')) {
                        data["nhfus"] = [row[1], row[2]]; // value, unit
                    } else if (row[3] || row[4] || row[5]) {
                        var rowData = {}
                        // console.log("adding-->" + row + "to rowData");
                        for (colIndex in row) {
                            //if (row[colIndex]) {
                            if (row[colIndex] !== null && row[colIndex] !== undefined){
                                switch (parseInt(colIndex)) {
                                    case 0:
                                        rowData["solvent1"] = row[colIndex];
                                        break;
                                    case 1:
                                        rowData["solvent2"] = row[colIndex];
                                        break;
                                    case 2:
                                        rowData["solvent3"] = row[colIndex];
                                        break;
                                    case 3:
                                        rowData["solvFrac1"] = shouldRound(row[colIndex]) ? Number(row[colIndex]).toFixed(3) : row[colIndex];
                                        break;
                                    case 4:
                                        rowData["solvFrac2"] = shouldRound(row[colIndex]) ? Number(row[colIndex]).toFixed(3) : row[colIndex];
                                        break;
                                    case 5:
                                        rowData["solvFrac3"] = shouldRound(row[colIndex]) ? Number(row[colIndex]).toFixed(3) : row[colIndex];
                                        break;
                                    case 6:
                                        rowData["t"] = row[colIndex];
                                        break;
                                    case 7:
                                        rowData["xrpd"] = row[colIndex];
                                        break;
                                    case 8:
                                        rowData["solubility1"] = shouldRound(row[colIndex]) ? Number(row[colIndex]).toFixed(3) : row[colIndex];
                                        break;
                                    case 9:
                                        rowData["solubility2"] = shouldRound(row[colIndex]) ? Number(row[colIndex]).toFixed(3) : row[colIndex];
                                        break;
                                    case 10:
                                        rowData["solubility3"] = shouldRound(row[colIndex]) ? Number(row[colIndex]).toFixed(3) : row[colIndex];
                                        break;
                                    case 11:
                                        rowData["solubility4"] = shouldRound(row[colIndex]) ? Number(row[colIndex]).toFixed(3) : row[colIndex];
                                        break;
                                    case 12:
                                        rowData["lotNum"] = row[colIndex];
                                        break;
                                    case 13:
                                        rowData["eln"] = row[colIndex];
                                        break;
                                    case 14:
                                        rowData["measurementMethod"] = row[colIndex];
                                        break;
                                    case 15:
                                        rowData["comments"] = row[colIndex];
                                    case 16:
                                        rowData["dataInputstatus"] = row[colIndex];
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                        // console.log("complete rowData-->");
                        // console.log(rowData);
                        if ("data" in data) {
                            data["data"].push(rowData);
                        } else {
                            data["data"] = [rowData];
                        }
                    } else {
                        /* Uncomment the following line if more columns need to be identified.
                         * It outputs into the console the rows that aren't added,
                         * and what the first element is in that row. */
                        // console.log("unaccounted case: " + "-->" + row[0] + "<--" + row);
                        break;
                    }
            }
        }
    }
    //console.log(data);
    createTable(data);
}

//check to see if we should round - need to fix(edge cases exist)
function shouldRound(value) {
    return value.toString().length > 5;
}

/**
 * createTable(data)
 * - Creates table for sheet data
 * - Provides visualization
 * - Calls createTable()
 * - Calls createHead()
 * - Calls createBody()
 * @param {Sheet information object} data 
 */
function createTable(data) {
    // console.log("createTable(data) called");
    const tableDiv = document.createElement('div');
    var titleDiv = document.createElement('div');
    var dataDiv = document.createElement('div');
    var table = document.createElement('table');
    createTitle(titleDiv, data);
    createHead(table);
    createBody(table, data);
    tableDiv.appendChild(titleDiv);
    tableDiv.appendChild(dataDiv);
    dataDiv.appendChild(table);
    // styling
    dataDiv.style.overflow = "scroll";
    tableDiv.style.backgroundColor = "beige";
    tableDiv.style.marginBottom = "1rem";
    table.style.borderCollapse = "collapse";
    table.style.tableLayout = "fixed";
    table.style.border = "solid black";
    table.display = "flex";

    var tableCells = table.querySelectorAll('th, td');
    tableCells.forEach(function(cell) {
        cell.style.padding = '5px';
    });
    // update head
    console.log(table.children);
    // add to body
    document.body.appendChild(tableDiv);
}

/**
 * createTitle(titleDiv, data)
 * - Creates title with important compound information, such as name, mv, etc.
 * @param {divider to put title table} titleDiv 
 * @param {sheet json data} data 
 */
function createTitle(titleDiv, data) {
    console.log("createTitle(titleDiv, data) called");
    console.log(data);
    // instantiate elements
    var titleTable = document.createElement('table');
    var titleTableHead = document.createElement('thead');
    var titleTableRow = document.createElement('tr');
    // append rows to table
    titleTable.appendChild(titleTableHead);
    titleTable.appendChild(titleTableRow);
    for (let i = 0; i < projectLabels.length; i++) {
        // instantiate data boxes
        var titleTh = document.createElement('th');
        var titleTd = document.createElement('td');
        var titleTdDiv = document.createElement('div');
        // set text
        titleTh.innerText = projectLabels[i];
        tempText = data[projectLabels[i]];
        if (typeof(tempText) == "string") {
            titleTdDiv.innerText = tempText;
        } else {
            titleTdDiv.innerText = tempText[0];
        }
        // style boxes
        titleTh.style.border = "solid";
        titleTd.style.border = "solid";
        titleTd.style.textAlign = "center";
        titleTdDiv.style.textAlign = "center";
        titleTdDiv.contentEditable = "true";
        // append to parent row
        titleTd.appendChild(titleTdDiv);
        titleTableHead.appendChild(titleTh);
        titleTableRow.appendChild(titleTd);
    }
    // style table
    titleTable.style.borderCollapse = "collapse";
    titleTable.style.width = "100%";
    titleTable.style.marginBottom = "1px";
    titleTable.style.tableLayout = "fixed";
    // append table to parent div
    titleDiv.appendChild(titleTable);
}

/**
 * createHead(table)
 * - Creates head part of the table
 * - In this case, this is column label and occasional column label units
 * - Bolded in table visual
 * - Calls createSelection() to create unit selections
 * @param {table element} table 
 */
function createHead(table) {
    // console.log("createHead(table) called");
    var thead = document.createElement('thead');
    // creates column labels
    var row1 = document.createElement('tr');
    for (let i = 0; i < colLabels.length; i++) {
        var th = document.createElement('th');
        th.innerText = colLabels[i];
        // style th
        th.style.whiteSpace = "nowrap";
        th.style.overflow = "hidden";
        if (i != 8 && i != 9 && i != 10 && i != 11) {
            // this eliminates borders in solubility* boxes
            th.style.borderStyle = "solid";
        } else {
            th.style.borderBottomStyle = "solid";
        }
        // add to row
        row1.appendChild(th);
    }
    thead.appendChild(row1);
    // creates secondary labels (allow for choosing options)
    var row2 = document.createElement('tr');
    for (i in colLabels) {
        var th = document.createElement('th');
        th.style.borderStyle = "solid";
        switch (colLabels[i]) {
            case "Solv Frac 1 (solute-free)":
                createSelection(row2, th, colLabelsDropdown[0]);
                row2.appendChild(th);
                break;
            case "T":
                th.innerText = "\u00B0C";
                row2.appendChild(th);
                break;
            case "Solubility*":
                createSelection(row2, th, colLabelsDropdown[1]);
                row2.appendChild(th);
                break;
            default:
                th.style.borderStyle = "none";
                row2.appendChild(th);
                break;
        }
    }
    thead.appendChild(row2);
    // style thead
    thead.style.borderStyle = "solid";
    thead.style.borderColor = "black";
    // add head to table
    table.appendChild(thead);
}

/**
 * createSelection(parentparent, parent, options)
 * - Creates selection elements in 2nd row of header
 * - Calls updateHead() whenever selection is changed
 * @param {this would be the row that selection is on} parentparent 
 * @param {this is the th selection is in} parent 
 * @param {these are the dropdown options, different for each select element} options 
 */
function createSelection(parentparent, parent, options) {
    // console.log("createSelection() called");
    var select = document.createElement('select');
    for (index in options) {
        var option = document.createElement('option');
        option.value = options[index];
        option.innerText = options[index];
        select.appendChild(option);
        select.onchange = function () {
            updateHead(parentparent);
        };
    }
    parent.appendChild(select);
}

/**
 * updateHead(parent)
 * - Updates all unit labels in the 2nd row to match selections
 * @param {2nd row of head} parent 
 */
function updateHead(parent) {
    // console.log("updateHead() called");
    var thList = parent.children;
    var selection;
    // set index 4-5 same as index 3 (solv frac)
    selection = thList[3].children[0];
    selection = selection.options[selection.selectedIndex].text;
    thList[4].innerText = selection;
    thList[5].innerText = selection;
    // set index 9-11 correct (solubility*)
    selection = thList[8].children[0];
    selection = selection.options[selection.selectedIndex].text;
    options = structuredClone(colLabelsDropdown[2]);
    options.splice(options.indexOf(selection), 1);
    thList[9].innerText = options.pop();
    thList[10].innerText = options.pop();
    thList[11].innerText = options.pop();
    indices = [4, 5, 9, 10, 11]
    for (index in indices) {
        thList[indices[index]].style.borderStyle = "solid";
    }
}

/**
 * createBody(table, data)
 * - Fills in table using data from json file
 * - Makes every box contenteditable = true using inner-dividers
 * @param {parent table} table 
 * @param {sheet json data} data 
 */
function createBody(table, data) {
    console.log("createBody() called");
    // iterate through rows of data, create and fill in boxes
    for (let i = 1; i < data["data"].length; i++) {
        var tr = document.createElement('tr');
        for (let j = 0; j < dataLabels.length; j++) {
            var td = document.createElement('td');
            var tdDiv = document.createElement('div');
            td.style.border = "1px solid black";
            //tdDiv.contentEditable = "true";
            td.appendChild(tdDiv);

            checkInputstatus(data,i,td);
            /*
            if (data["data"][i][dataLabels[j]]) {
                tdDiv.innerText = data["data"][i][dataLabels[j]];
            }
            */
            if (data["data"][i][dataLabels[j]] !== null && data["data"][i][dataLabels[j]] !== undefined) {
                tdDiv.innerText = data["data"][i][dataLabels[j]];
            }
        
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}
/**
 * checkInputstatus(data,i, td)
 * - Check whether the row is ok if so make the background green.
 * - If we have an error change the background of the row to red.
 * @param {sheet json data} data 
 * @param {position of current row} i 
 * @param {current row object} td 
 * @returns 
 */
function checkInputstatus(data,i, td){
    if (data["data"][i]["dataInputstatus"] == "OK"){
        td.style.backgroundColor = "#ccffcc";
    }

    else if(data["data"][i]["dataInputstatus"] == "ERROR w/ Data Input…Check Solvent Name(s), Solvent Fracs, T, and Solubility"){
        td.style.backgroundColor = "#ffcccc"; 
    }
    return -1 
}

