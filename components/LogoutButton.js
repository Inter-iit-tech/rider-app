import { Button, Icon } from "@rneui/base";
import useAuthContext from "../hooks/useAuthContext";

const LogoutButton = () => {
  const { logout } = useAuthContext();

  return (
    <Button
      type="clear"
      icon={
        <Icon
          type="material"
          name="power-settings-new"
          style={{ paddingRight: 5 }}
          color="tomato"
        />
      }
      title="Logout"
      onPress={logout}
      titleStyle={{
        color: "tomato",
      }}
      buttonStyle={{
        marginRight: 10,
      }}
    />
  );
};

export default LogoutButton;
