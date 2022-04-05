import React, { useContext , useEffect} from "react";
import { StoreContext, setUserData } from "../../authentication/store";
import { authenticate } from "../../authentication/services";

export default function Home(props) {
  const { user } = useContext(StoreContext);
  console.log(user);
  return (
    <div className="homeContainer">
        welcome back {user&&user.name}!
    </div>
  );
}