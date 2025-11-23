import { ParentComponent, Show } from "solid-js";
import { useDockerSystem } from "../hooks/use-docker-system";
import { DockerOffScreen } from "./docker-off-screen";

export const ServiceGuard: ParentComponent = (props) => {
  const { isDockerDown, toggleDockerService, isToggling } = useDockerSystem();

  return (
    <Show
      when={!isDockerDown()} // Se estiver ONLINE, mostra filhos
      fallback={
        // Se estiver OFFLINE, mostra tela vermelha
        <DockerOffScreen 
            onTurnOn={() => toggleDockerService("start")}
            isToggling={isToggling()}
        />
      }
    >
      {props.children}
    </Show>
  );
};