import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import cn from "classnames";

import "./styles.scss";

import { appReactMemo } from "@/hocs/appReactMemo";
import { ICONS_MAP } from "@/icons";

import { tabsClasses } from "./constants";
import { AdditionalProps, ITabsProps, TScrollButton } from "./types";

const Tabs = (props: ITabsProps) => {
  const { value, onChange, scrollButtons, children, classes, useKeyValue } =
    props;
  const [scrollRef, setScrollRef] = useState<HTMLDivElement | null>(null);
  const [activeButton, setActiveButton] = useState<TScrollButton>("next");
  const [isScroll, setIsScroll] = useState(false);
  const [width, setWidth] = useState(0);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const onRefChange = useCallback((node: HTMLDivElement) => {
    setScrollRef(node);
  }, []);

  const onScrollTo = useCallback(
    (type: TScrollButton) => {
      if (scrollRef) {
        const { scrollLeft, offsetWidth } = scrollRef;
        scrollRef.scrollTo({
          left:
            type === "prev"
              ? offsetWidth + scrollLeft
              : scrollLeft - offsetWidth,
          behavior: "smooth",
        });
        setActiveButton(type);
      }
    },
    [scrollRef],
  );

  const showScrollButton = useMemo(() => {
    if (scrollButtons && scrollRef) {
      const { scrollWidth, offsetWidth } = scrollRef;
      const buttonWidth = buttonRef?.current?.offsetWidth || 0;

      if (offsetWidth < scrollWidth && width + buttonWidth * 2 < scrollWidth) {
        return true;
      }
    }

    return false;
  }, [scrollRef, width]);

  const handleScroll = useCallback(() => {
    if (scrollRef) {
      const { scrollLeft, scrollWidth, offsetWidth } = scrollRef;
      const isEnd = Math.ceil(scrollLeft) + offsetWidth >= scrollWidth;

      setIsScroll(!!scrollLeft && !isEnd);

      if (isEnd) {
        setActiveButton("prev");
      } else if (!scrollLeft) {
        setActiveButton("next");
      }
    }
  }, [scrollRef]);

  useEffect(() => {
    if (scrollRef && scrollButtons) {
      const observer = new ResizeObserver((entries) => {
        setWidth(entries[0].contentRect.width);
      });
      observer.observe(scrollRef);

      scrollRef.addEventListener("scroll", handleScroll);

      return () => {
        scrollRef.removeEventListener("scroll", handleScroll);
        observer.unobserve(scrollRef);
      };
    }
  }, [scrollRef]);

  return (
    <div className={cn(tabsClasses.container, classes?.container)}>
      <div className={cn(tabsClasses.root, classes?.root)}>
        {showScrollButton && (
          <button
            type="button"
            onClick={() => onScrollTo("next")}
            disabled={activeButton === "next" && !isScroll}
            className={cn(tabsClasses.scrollButton, classes?.scrollButton)}
            ref={buttonRef}
          >
            <ICONS_MAP.ArrowLeftIcon />
          </button>
        )}
        <div className={cn(tabsClasses.scrollable, classes?.scrollable)} />
        <div
          ref={onRefChange}
          className={cn(tabsClasses.scrollerWrap, classes?.scrollerWrap)}
        >
          <div
            role="tablist"
            className={cn(tabsClasses.tabList, classes?.tabList)}
          >
            {React.Children.map(children, (child, index) => {
              if (React.isValidElement<AdditionalProps>(child)) {
                return React.cloneElement(child, {
                  ...child.props,
                  index,
                  value,
                  onChange,
                  useKeyValue,
                });
              }
              return null;
            })}
          </div>
        </div>
        {showScrollButton && (
          <button
            type="button"
            onClick={() => onScrollTo("prev")}
            disabled={activeButton === "prev" && !isScroll}
            className={cn(tabsClasses.scrollButton, classes?.scrollButton)}
          >
            <ICONS_MAP.ArrowRightIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default appReactMemo(Tabs);
