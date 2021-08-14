import { Ingredient } from "../shopping-list/ingredient.model";

export class Recipe {
  constructor (
    public id: string,
    public name:string,
    public description:string,
    public imgPath:string,
    public ingredients:Ingredient[],
    public lastUpdated: string,
    public createdBy: string
  ) {}
}
