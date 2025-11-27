import { type ParentComponent, Show } from "solid-js";
import { useDockerSystem } from "../hooks/use-docker-system";
import { DockerOffScreen } from "./docker-off-screen";

export const ServiceGuard: ParentComponent = (props) => {
  const { isDockerOnline, toggleDockerService, pendingAction } = useDockerSystem();

  return (
    <Show
      when={isDockerOnline()}
      fallback={
        <div class="h-full w-full flex items-center justify-center bg-neutral-950/50 backdrop-blur-sm">
          <DockerOffScreen
            onTurnOn={() => toggleDockerService("start")}
            pendingAction={pendingAction()}
          />
        </div>
      }
    >
      {props.children}
    </Show>
  );
};
