import type { Metadata } from "next";

import { ComponentDemo } from "./_components/component-demo";

export const metadata: Metadata = {
  title: "Component Demo",
  description: "Living reference for the components shipped with this project template."
};

export default function ComponentDemoPage() {
  return <ComponentDemo />;
}
