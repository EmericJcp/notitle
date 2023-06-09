import { useState, useEffect } from "react";
import axios from "axios";

const useAxiosGet = (url: string) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = () => {
    axios
      .get(url)
      .then((res) => setData(res.data))
      .catch((error) => setError(error.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    refreshData();
  }, []);

  return { data, error, isLoading, refreshData };
};

export default useAxiosGet;
