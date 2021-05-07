import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { api } from "../services/apiClient";
import { setupApiClient } from "../services/api";
import { withSSRAuth } from "../utils/withSSRAuth";
import { useCan } from "../hooks/useCan";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const useCanSeeMetrics = useCan({
    permissions: ["admnistrator", "editor"],
  });

  useEffect(() => {
    api
      .get("/me")
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }, []);
  return (
    <div>
      <h1>Dashboard: {user?.email}</h1>

      {useCanSeeMetrics && <div>métricas</div>}
    </div>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupApiClient(ctx);

  const response = await apiClient.get("/me");

  console.log(response.data);

  return {
    props: {},
  };
});
