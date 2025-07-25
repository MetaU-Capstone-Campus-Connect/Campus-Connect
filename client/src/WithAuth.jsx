import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const WithAuth = (WrappedComponent) => {
  return function ProtectedComponent({ userInfo, ...props }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (userInfo === undefined) return;

      if (!userInfo) {
        navigate("/");
      } else {
        setLoading(false);
      }
    }, [userInfo, navigate]);

    if (loading || userInfo === undefined) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent userInfo={userInfo} {...props} />;
  };
};

export default WithAuth;
