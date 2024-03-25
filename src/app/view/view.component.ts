import { getSafePropertyAccessString } from '@angular/compiler';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { SearchService } from '../view.service';
import { TableData } from '../view/table-data.interface';


@Component({
    selector: 'view-root',
    templateUrl: 'view.component.html',
    styleUrls: ['./view.component.scss']
})
export class ViewComponent {
    @ViewChild('normalSearch') normalSearch!: ElementRef;
    @ViewChild('advancedSearch') advancedSearch!: ElementRef;

    constructor(private searchService: SearchService) { }
    tableData: TableData[] = [];

    
    advancedSearchFilterID = 1;
    id_tracker: number[] = [1];

    equalityTerms = [
        "=",
        "<",
        "<=",
        ">",
        ">=",
    ]
    solidformTerms = [
        "Form I",
        "Form II",
        "Form III",
    ]

    solventSelectTerms = [
        "has specific solvent combination",
        "has any data on solvent",
    ]

    ngAfterViewInit() {
      // Now you can access the elements
      if (this.normalSearch && this.advancedSearch) {
        // Do something with normalSearch and advancedSearch
        // console.log(this.normalSearch.nativeElement);
        // console.log(this.advancedSearch.nativeElement);
        this.advancedSearch.nativeElement.style.display = 'none';
        this.createNormal(this.normalSearch.nativeElement, this.advancedSearch.nativeElement);
        this.createAdvanced(this.normalSearch.nativeElement, this.advancedSearch.nativeElement);
      }
    }

    createNormal(normal: any, advanced: any) {
        const normalSearch = document.createElement('form');
        // create normal search toggle
        const toggle = document.createElement('input');
        toggle.type = "button";
        toggle.value = "Normal Search";
        toggle.addEventListener('click', () => {
            normal.style.display = 'none';
            advanced.style.display = 'block';
        });
        normalSearch.appendChild(toggle);
        // form line break
        normalSearch.appendChild(document.createElement('br'));
        // number input
        const numberInput = document.createElement('input');
        numberInput.pattern = "[0-9]+";
        numberInput.inputMode = "numeric";
        numberInput.placeholder = "Project Number";
        numberInput.classList.add("light-background");
        normalSearch.appendChild(numberInput);
        // submit button
        const searchButton = document.createElement('input');
        searchButton.type = "button";
        searchButton.value = "Search";
        normalSearch.appendChild(searchButton);
        // append form to document
        normal.appendChild(normalSearch);

        // make the search button work 
        searchButton.addEventListener('click', () => {
            const dataToSend = { projectNumber: numberInput.value };
            this.searchService.uploadData(dataToSend).subscribe(response => {
              console.log(response);
              this.tableData = this.parseResponseData(response);
            });
          });

        
    }

    createAdvanced(normal: any, advanced: any) {
        const advancedSearch = document.createElement('form');
        // create advanced search toggle
        const toggle = document.createElement('input');
        toggle.type = "button";
        toggle.value = "Advanced Search";
        toggle.addEventListener('click', function(){
            normal.style.display = 'block';
            advanced.style.display = 'none';
        });
        advancedSearch.appendChild(toggle);
        // form line break
        advancedSearch.appendChild(document.createElement('br'));
        // create add filter butotn
        const addFilter = document.createElement('input');
        addFilter.type = "button";
        addFilter.value = "Add Filter";
        addFilter.addEventListener('click', () => {
            this.advancedSearchFilterID = this.id_tracker.length + 1;
            this.id_tracker.push(this.advancedSearchFilterID);
            this.appendSelect(advancedSearch, currentData);
        });
        advancedSearch.appendChild(addFilter);
        // create reset filters butotn
        const resetFilter = document.createElement('input');
        resetFilter.type = "button";
        resetFilter.value = "Reset";
        resetFilter.addEventListener('click', () => {
            advanced.innerHTML = '';

            this.advancedSearchFilterID = 1;
            this.id_tracker = [1];

            this.createAdvanced(normal, advanced);
        });
        advancedSearch.appendChild(resetFilter);


        // create the search button, possibly rerfactor in future 
        const searchButton = document.createElement('input');
        searchButton.type = "button";
        searchButton.value = "Search";
        advancedSearch.append(searchButton)

        
        const currentData: { [key: string]: any[] } = {};


        searchButton.addEventListener('click', () => {
            // searchButton.disabled = true; // Disable the button
            for (const key in currentData) {
                const divElement = document.getElementById(key);

                if(divElement){
                    const selectFields  = divElement.querySelectorAll('select')
                    const inputFields = divElement.querySelectorAll('input');

                    selectFields.forEach((selectField: HTMLSelectElement) => {
                        currentData[key].push(selectField.value)
                    })

                    inputFields.forEach((inputField: HTMLInputElement) => {
                        currentData[key].push(inputField.value);
                    });
                }
            }
            const dataToSend = { Data :  currentData};
            this.searchService.uploadData(dataToSend).subscribe(response => {
                //console.log(response)
              this.tableData = this.parseResponseData(response);
            });
          });

        // form line break
        advancedSearch.appendChild(document.createElement('br'));
        // append initial select
        this.appendSelect(advancedSearch, currentData);
        advanced.appendChild(advancedSearch);
    }

    appendSelect(search: HTMLFormElement, currentData : { [key: string]: any[] }){
        // create selector
        const selectOptions = [
            "Project Number",
            "Molecular Weight",
            "Solid Form",
            "Melting Temperature",
            "Fusion Enthalpy",
            "Solvent",
        ]
        const selectParent = document.createElement('div');
        selectParent.style.display = "flex";
        selectParent.style.flexDirection = "row";
        const selectDiv = document.createElement('div');
        const select = document.createElement('select');
        // add small delete div
        const deleteDiv = document.createElement('div');
        const deleteButton = document.createElement('button')
        deleteButton.addEventListener("click", () => {
            try {
              selectParent.parentElement?.removeChild(selectParent);
              const parentId = parseInt(selectParent.id);
              console.log(`parentId ${parentId}`);
              const index = this.id_tracker.findIndex((id) => id === parentId);
              console.log(index);
              if (index !== -1) {
                this.id_tracker.splice(index, 1);
              }
      
              //reassign values
              for (let i = 0; i < this.id_tracker.length; i++) {
                const id = this.id_tracker[i];
                const element = document.getElementById(`${id}`);
                if (element) {
                  element.id = `${i + 1}`;
                }
                this.id_tracker[i] = i + 1;
              }
              console.log(this.id_tracker);
      
              //correct filterID
              this.advancedSearchFilterID = this.id_tracker.length;
            } catch {}
        });
        deleteButton.innerText = 'X';
        deleteDiv.appendChild(deleteButton);
        selectParent.appendChild(deleteDiv);
        for (let i = 0; i < selectOptions.length; i++) {
            const tempOption = document.createElement('option');
            tempOption.innerText = selectOptions[i];
            select.appendChild(tempOption);
        }
        selectParent.appendChild(selectDiv);
        selectDiv.appendChild(select);
        search.appendChild(selectParent)
        // set id for select
        // selectParent.id = this.advancedSearchFilterID.toString();
        selectParent.id = this.id_tracker.length.toString();
        currentData[this.advancedSearchFilterID.toString()] = []
        // this.advancedSearchFilterID++;
        // make selects based on select value
        this.updateSelectOptions(select);
        select.addEventListener('change', () => {
            this.updateSelectOptions(select);
        });



    }

    updateSelectOptions(select: HTMLSelectElement) {
        var selectedValue = select.value;
        var parentDiv = select.parentNode;                    
        console.log(parentDiv?.childNodes);
        if (parentDiv) {
            // reset select div
            if (parentDiv.children.length > 1) {
                for (let i = parentDiv.children.length; i > 0; i--) {
                    if (parentDiv.children[i]) {
                        parentDiv.removeChild(parentDiv.children[i]);
                    }
                }
                // this.advancedSearchFilterID = 0;
            }
            // add more inputs depending on what selected value is
            switch (selectedValue) {
                case "Project Number":
                    // numerical input
                    var numberInput = document.createElement('input');
                    numberInput.pattern = "[0-9]+";
                    numberInput.placeholder = "Project Number";
                    numberInput.classList.add("light-background");
                    parentDiv.appendChild(numberInput);
                    break;
                case "Molecular Weight":
                    // equality select
                    var equalitySelect = document.createElement('select');
                    for (let i = 0; i < this.equalityTerms.length; i++){
                        const tempOption = document.createElement('option');
                        tempOption.innerText = this.equalityTerms[i];
                        equalitySelect.appendChild(tempOption);
                    }
                    parentDiv.appendChild(equalitySelect);
                    // numerical input
                    var numberInput = document.createElement('input');
                    numberInput.placeholder = "Molecular Weight (g/mol)";
                    numberInput.classList.add("light-background");
                    parentDiv.appendChild(numberInput);
                    break;
                case "Solid Form":
                    var solidformSelect = document.createElement('select');
                    for (let i = 0; i < this.solidformTerms.length; i++){
                        const tempOption = document.createElement('option');
                        tempOption.innerText = this.solidformTerms[i];
                        solidformSelect.appendChild(tempOption);
                    }
                    parentDiv.appendChild(solidformSelect);
                    break;
                case "Melting Temperature":
                    // equality select
                    var equalitySelect = document.createElement('select');
                    for (let i = 0; i < this.equalityTerms.length; i++){
                        const tempOption = document.createElement('option');
                        tempOption.innerText = this.equalityTerms[i];
                        equalitySelect.appendChild(tempOption);
                    }
                    parentDiv.appendChild(equalitySelect);
                    // numerical input
                    var numberInput = document.createElement('input');
                    numberInput.placeholder = "Melting Temperature (\u00B0C)";
                    numberInput.classList.add("light-background");
                    parentDiv.appendChild(numberInput);
                    break;
                case "Fusion Enthalpy":
                    // equality select
                    var equalitySelect = document.createElement('select');
                    for (let i = 0; i < this.equalityTerms.length; i++){
                        const tempOption = document.createElement('option');
                        tempOption.innerText = this.equalityTerms[i];
                        equalitySelect.appendChild(tempOption);
                    }
                    parentDiv.appendChild(equalitySelect);
                    // numerical input
                    var numberInput = document.createElement('input');
                    numberInput.placeholder = "Fusion Enthalpy (J/g)";
                    numberInput.classList.add("light-background");
                    parentDiv.appendChild(numberInput);
                    break;
                case "Solvent":
                    // solvent select
                    var solventSelect = document.createElement('select');
                    for (let i = 0; i < this.solventSelectTerms.length; i++){
                        const tempOption = document.createElement('option');
                        tempOption.innerText = this.solventSelectTerms[i];
                        solventSelect.appendChild(tempOption);
                    }
                    parentDiv.appendChild(solventSelect);
                    // console.log(parentDivID.id)
                    // currentData[parentDivID.id].push("Solvent")
                    // solvent entries
                    this.solventSelectAction(solventSelect);
                    solventSelect.addEventListener("change", () => {
                        this.solventSelectAction(solventSelect);
                    })
                    break;
            }
        }
    }

    solventSelectAction(select: HTMLSelectElement) {
        console.log("solvent")
        var selectedValue = select.value;
        var parentDiv = select.parentNode;

        if (parentDiv) {
            // eliminate children
            if (parentDiv.children.length > 2) {
                for (let i = parentDiv.children.length; i > 1; i--) {
                    if (parentDiv.children[i]) {
                        parentDiv.removeChild(parentDiv.children[i]);
                    }
                }
            }
            // add children
            switch (selectedValue) {
                case "has specific solvent combination":
                    // text input for solvent 1
                    var numberInput = document.createElement('input');
                    numberInput.type = "text";
                    numberInput.placeholder = "Solvent Name";
                    numberInput.classList.add("light-background");
                    parentDiv.appendChild(numberInput);
                    // text input for solvent 2
                    var numberInput = document.createElement('input');
                    numberInput.type = "text";
                    numberInput.placeholder = "Solvent Name (optional)";
                    numberInput.classList.add("light-background");
                    parentDiv.appendChild(numberInput);
                    // text input for solvent 3
                    var numberInput = document.createElement('input');
                    numberInput.type = "text";
                    numberInput.placeholder = "Solvent Name (optional)";
                    numberInput.classList.add("light-background");
                    parentDiv.appendChild(numberInput);     
                    break;

                    //add it to an dictionary
                case "has any data on solvent":
                    // text input for single solvent
                    var numberInput = document.createElement('input');
                    numberInput.type = "text";
                    numberInput.placeholder = "Solvent Name";
                    numberInput.classList.add("light-background");
                    parentDiv.appendChild(numberInput);
                    break;
            }
        }

    }
    
    parseResponseData(response: any): TableData[]{
        return response.map((row: any[]) => ({
            fileName: row[0],
            projectName: row[1],
            scientistName: row[2],
            compoundName: row[3],
            moleculearWeight: row[4],
            solidForm: row[5],
            tMelt: row[6],
            fusionEnthalpy: row[7],
            solvent1: row[8],
            solvent2: row[9],
            solvent3: row[10]
        }));
    }
}