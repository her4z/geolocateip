import React, { useEffect, useState } from "react";

function App() {
  const [dataFetched, setDataFetched] = useState([{}]);

  useEffect(() => {
    fetch("/api").then((res) => {
      const { statusText } = res;
      setDataFetched(statusText);
    });
  }, []);
  return <div>{dataFetched ? `${dataFetched}` : ""}</div>;
}

export default App;
