import { Board, Generator } from './board'
import { Model } from './model'
import { View } from './view'
import { Controller } from './controller'
import { imagesArray } from './images/images'
import "./style.css"

class SequenceGenerator implements Generator<string> {
    private sequence: string
    private index: number
 


    constructor(sequence: string) {
        this.sequence = sequence
        this.index = 0
    }

    next(): string {
        const n = this.sequence.charAt(this.index)
        this.index = (this.index + 1) % this.sequence.length
        return n
    }
}


class ImageGenerator implements Generator<string> {
private index:number
private imageArray:string[]=imagesArray
constructor(imageArray:string[]){
    this.imageArray=imageArray
    this.index=0
}

next():string{
    const n=this.imageArray[this.index]
    const randomInt = Math.floor(Math.random() * this.imageArray.length);
    this.index=(this.index+1)%this.imageArray.length
    const newImage = document.createElement("img");
    newImage.src = imagesArray[randomInt];
    newImage.className = "image";
    newImage.alt="image"
    newImage.id = "image" + this.index.toString();

    return newImage.src
}


}

async function init() {

    const generator = new ImageGenerator(imagesArray) 
    const board = new Board<String>(generator, 5, 5)
    const model = new Model<String>(board)

    const tiles = document.getElementsByClassName("tile");

    document.addEventListener('DOMContentLoaded', () => {
    for (let i = 0; i < tiles.length; i++) {
        const imageURL= generator.next()
        const newImage = document.createElement("img");
        tiles[i].innerHTML = ""
        newImage.src = imageURL;
        tiles[i].appendChild(newImage);
    }})

    const controller = new Controller<String>(model)
    const view = new View(window, controller)
    model.addObserver(m => view.view(m))
    view.view(model)

}
init()
