import type { PropsWithChildren } from "react";
import type { SectionId } from "../../data/about-files.types";
import type { TabBarProps } from "../tab-bar/tab-bar.types";

export type AboutContentProps = PropsWithChildren<TabBarProps & {
	activeSection: Nullable<SectionId>;
}>;
