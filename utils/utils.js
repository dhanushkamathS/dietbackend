
const DateCreator = () =>{
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1; // getMonth() returns month from 0 to 11
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}


module.exports ={DateCreator}