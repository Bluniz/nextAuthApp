import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

type UseCanParams = {
  permissions?: string[];
  roles?: string[];
};

export function useCan({ permissions, roles }: UseCanParams) {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return false;
  }

  if (permissions?.length > 0) {
    //! O metodo every só irá retornar true se passar por todas as condições que forem colocadas dentro.
    //! O metodo some retorna true se pelo menos um dos valores passe nas condições
    const hasAllPermissions = permissions.some((permission) => {
      return user.permissions.includes(permission);
    });

    if (!hasAllPermissions) {
      return false;
    }

    if (!isAuthenticated) {
      return false;
    }

    if (roles?.length > 0) {
      //! O metodo every só irá retornar true se passar por todas as condições que forem colocadas dentro.
      const hasAllRoles = roles.every((role) => {
        return user.roles.includes(role);
      });

      if (!hasAllRoles) {
        return false;
      }
    }
  }

  return true;
}
