import cn from "classnames";

import "./styles.scss";

import { appReactMemo } from "@/hocs/appReactMemo";

import { highlightedTextClasses } from "./constants";

export type IHighlightedTextNamings = Partial<{
  container: string;
  highlightedText: string;
}>;

export interface IHighlightedTextProps {
  children: string;
  searchTerm?: string;
  classes?: IHighlightedTextNamings;
}

const HighlightedText = ({
  children = "",
  searchTerm = "",
  classes,
}: IHighlightedTextProps) => {
  const normalizedTerm = searchTerm?.trim().toLowerCase();
  const specialTerm = normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${specialTerm})`, "gi");
  const parts = children.split(regex);

  const getText = () => {
    if (searchTerm) {
      return parts.map((part: string, i: number) => {
        const normalizedPart = part.toLowerCase().trim();
        if (normalizedPart === normalizedTerm) {
          return (
            <span
              key={i}
              className={cn(
                highlightedTextClasses.highlightedText,
                classes?.highlightedText,
              )}
            >
              {part}
            </span>
          );
        }
        return part;
      });
    }

    return children;
  };

  return (
    <span className={cn(highlightedTextClasses.container, classes?.container)}>
      {getText()}
    </span>
  );
};

export default appReactMemo(HighlightedText);
