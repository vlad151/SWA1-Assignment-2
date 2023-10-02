import "./style.css"
console.log("Hello, world!")

 function populateGrid(){

    let gridContainer = document.getElementById("grid-container")
    for(let i = 0; i < 8; i++){
        let gridItem = document.createElement("div")
        gridItem.classList.add("grid-row")
        gridContainer.appendChild(gridItem)
        for(let j = 0; j < 8; j++){
            let columnItem = document.createElement("div")
            columnItem.classList.add("grid-col")
            gridItem.appendChild(columnItem)
        }
    }
 


}

populateGrid()