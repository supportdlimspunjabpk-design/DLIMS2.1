import { createFileRoute } from "@tanstack/react-router";
import { DlimsApp } from "@/components/dlims/shell";

export const Route = createFileRoute("/")({ component: DlimsApp });
