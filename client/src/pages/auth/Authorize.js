import React, { useEffect, useContext } from "react";
import { StoreContext } from "../../authentication/store";
import { webAuth , logout } from "../../authentication/services";
import { Redirect } from "react-router-dom";

export default function Authorize(props) {
    props.setLoading(true);
    const {
        authenticateUser,
        setUserData,
        isAuthenticated,
        resetAuth,
      } = useContext(StoreContext);
    
      const parseAuthToken = () => {
        if (window.location.hash) {
          webAuth.parseHash({ hash: window.location.hash }, (err, res) => {
            if (err) {
              resetAuth();
              logout();
              return;
            }
    
            const { email, name, picture, sub: id } = res.idTokenPayload;
            setUserData({ email, name, picture, id });
            authenticateUser(res.idToken);
          });
        }
      };
    
      useEffect(parseAuthToken, []);
    
      if (isAuthenticated) {
        props.setLoading(false);
        return <Redirect to="/dashboard" />;
      }
    
      return (
        <React.Fragment>

        </React.Fragment>
      );
}
// credits --> https://github.com/krizten/passwordless-auth