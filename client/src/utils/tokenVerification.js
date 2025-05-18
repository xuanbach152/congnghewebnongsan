import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useTokenVerification() {
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/");
    } else {
      setIsVerified(true);
    }
  }, [navigate]);

  return isVerified;
}
