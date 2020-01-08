export class ConceptModel {
  public title: string;
  public type: string;
  public description: string;
  public fileURL: string;
  public imgURL: string;
  public dataURL: string;

  constructor(title: string, type: string, description: string, fileURL: string, imgURL: string) {
    this.title = title;
    this.type = type;
    this.description = description;
    this.fileURL = fileURL;
    this.imgURL = imgURL;
    this.dataURL = null;
  }
}
