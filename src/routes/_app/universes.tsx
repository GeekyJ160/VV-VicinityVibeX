import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/universes")({
  component: UniversesLayout,
});

function UniversesLayout() {
  return <Outlet />;
}
