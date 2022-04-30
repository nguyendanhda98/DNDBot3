class ExtraForm {
  constructor() {
    this.setColor = '';
    this.setTitle = '';
    this.setURL = '';
    this.setAuthor = '';
    this.setDescription = '';
    this.setThumbnail = '';
    this.addFields = [];
    this.addField = [];
    this.setImage = '';
    this.setFooter = '';
  }

  test(x) {
    console.log('16 test', x);
  }

  Color(color) {
    this.setColor = color;
  }
  Title(title) {
    this.setTitle = title;
  }
  URL(URL) {
    this.setURL = URL;
  }
  Author(author) {
    this.setAuthor = author;
  }
  Description(description) {
    this.setDescription = description;
  }
  Thumbnail(thumbnail) {
    this.setThumbnail = thumbnail;
  }
  Fields(fields) {
    this.addFields.push(fields);
  }
  Field(filed) {
    this.addField = filed;
  }
  Image(image) {
    this.setImage = image;
  }
  Footer(footer) {
    this.setFooter = footer;
  }
}
// let extra1 = {
//   setColor: '',
//   setTitle: '',
//   setURL: '',
//   setAuthor: '',
//   setDescription: '',
//   setThumbnail: '',
//   addFields: [],
//   addField: [],
//   setImage: '',
//   setFooter: '',
// };

// const setColor = (color) => {
//   extra.setColor = color;
// };
// const setTitle = (title) => {
//   extra.setTitle = title;
// };
// const setURL = (URL) => {
//   extra.setURL = URL;
// };
// const setAuthor = (author) => {
//   extra.setAuthor = author;
// };
// const setDescription = (description) => {
//   extra.setDescription = description;
// };
// const setThumbnail = (thumbnail) => {
//   extra.setThumbnail = thumbnail;
// };
// const addFields = (fields) => {
//   extra.addFields.push(fields);
// };
// const addField = (filed) => {
//   extra.addField = filed;
// };
// const setImage = (image) => {
//   extra.setImage = image;
// };
// const setFooter = (footer) => {
//   extra.setFooter = footer;
// };
export { ExtraForm };
