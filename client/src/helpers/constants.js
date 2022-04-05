var tmp;
if (process.env.NODE_ENV === "production"){
  tmp = "https://www.animalsrepublic.org/api/";
}
else{
  tmp = "http://localhost:5000/api/"
}  

export const link = tmp;