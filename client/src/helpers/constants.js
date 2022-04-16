var tmp;
if (process.env.NODE_ENV === "production"){
  tmp = "https://covid-tracker-nodogoro.herokuapp.com/api/";
}
else{
  tmp = "http://localhost:5000/api/"
}  

export const link = tmp;