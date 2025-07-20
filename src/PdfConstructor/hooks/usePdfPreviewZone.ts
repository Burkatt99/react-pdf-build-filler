import { useCallback, useEffect, useRef, useState } from "react";
import { useDragLayer, useDrop } from "react-dnd";
import { PageChangeEvent, ZoomEvent } from "@react-pdf-viewer/core";
import {
  GoToPageProps,
  PageNavigationPlugin,
  pageNavigationPlugin,
} from "@react-pdf-viewer/page-navigation";
import { v4 as uuidv4 } from "uuid";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import { acceptFieldsList } from "@/constants/customFields";
import { IDropItem, IOption } from "@/constants/types";
import { IBuilderField } from "@/constants/types";

type UsePDFViewerZoneProps = {
  fields: IBuilderField[];
  onAddField: (item: IBuilderField) => void;
  onMoveField: (field: IBuilderField, newX: number, newY: number) => void;
};

type UsePDFViewerZone = {
  fieldsByPage: IBuilderField[];
  someIsDragging: boolean;
  dropRef: HTMLDivElement | null;
  pageInfo: Record<string, number>;
  currentPage: number;
  pageNavigationPluginInstance: PageNavigationPlugin;
  GoToNextPage: (props: GoToPageProps) => React.ReactElement;
  GoToPreviousPage: (props: GoToPageProps) => React.ReactElement;
  handleChangePage: (e: PageChangeEvent) => void;
  handleZoom: (e: ZoomEvent) => void;
  handleLoadDoc: () => void;
};

const usePDFViewerZone = (props: UsePDFViewerZoneProps): UsePDFViewerZone => {
  const { fields, onAddField, onMoveField } = props;
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { GoToNextPage, GoToPreviousPage } = pageNavigationPluginInstance;

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageInfo, setPageInfo] = useState<Record<string, number>>({});
  const [fieldsByPage, setFieldsByPage] = useState<IBuilderField[]>([]);
  const [dropRef, setDropRef] = useState<HTMLDivElement | null>(null);

  const pageChangeInterval = useRef<NodeJS.Timeout | null>(null);
  const onLoadDocInterval = useRef<NodeJS.Timeout | null>(null);

  const fieldCounter = useRef(0);

  useEffect(() => {
    return () => {
      if (pageChangeInterval.current) {
        clearInterval(pageChangeInterval.current);
      }

      if (onLoadDocInterval.current) {
        clearInterval(onLoadDocInterval.current);
      }
    };
  }, []);

  const { someIsDragging } = useDragLayer((monitor) => ({
    someIsDragging: monitor.isDragging(),
  }));

  const [, drop] = useDrop<
    IDropItem,
    void,
    { isOver: boolean; dropItem: IDropItem | null }
  >(
    {
      accept: acceptFieldsList,
      drop: (dropItem, monitor) => {
        if (!dropItem) return;

        const dropZoneRect = dropRef?.getBoundingClientRect();
        const delta = monitor.getDifferenceFromInitialOffset() || {
          x: 0,
          y: 0,
        };
        const dropOffset = monitor.getSourceClientOffset() || { x: 0, y: 0 };

        let newX = 0;
        let newY = 0;

        if (dropZoneRect && dropOffset && pageInfo.scale) {
          newX = Math.round(
            (dropOffset.x - dropZoneRect.left) / pageInfo.scale,
          );
          newY = Math.round((dropOffset.y - dropZoneRect.top) / pageInfo.scale);
        }

        if (!dropItem.field) {
          let newFieldName = "";
          let newOption = {} as IOption;
          let label = dropItem.placeholder;

          if (dropItem.type === "radio") {
            fieldCounter.current += 1;
            newFieldName = "Group1";
            label = "Radio group";
            newOption = {
              value: "",
              label: `Choice ${fieldCounter.current} label`,
            };
          } else if (dropItem.type === "partlyDate") {
            fieldCounter.current += 1;
            newFieldName = "Group1";
            newOption = {
              value: "",
              label: "",
            };
          }

          onAddField({
            uuid: uuidv4(),
            type: dropItem.type,
            name: newFieldName,
            label,
            option: newOption || null,
            x: newX,
            y: newY,
            width: dropItem.width,
            height: dropItem.height,
            page: currentPage,
            formState: {
              isValid: false,
            },
            validation: {
              isRequired: true,
            },
            role: "DEFAULT",
          });
        } else {
          const movedX = Math.round(
            dropItem.field.x + delta.x / pageInfo.scale,
          );
          const movedY = Math.round(
            dropItem.field.y + delta.y / pageInfo.scale,
          );

          onMoveField(dropItem.field, movedX, movedY);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        dropItem: monitor.getItem(),
      }),
    },
    [dropRef, currentPage, pageInfo.scale],
  );

  const handleZoom = useCallback(
    async (e: ZoomEvent) => {
      const { scale, doc } = e;

      const page = await doc.getPage(currentPage + 1);
      const viewport = page.getViewport({ scale });
      const boundingRect = dropRef?.getBoundingClientRect();

      const x = boundingRect ? boundingRect.left : 0;
      const y = boundingRect ? boundingRect.top : 0;

      setPageInfo({
        currentPage,
        width: viewport.width,
        height: viewport.height,
        x,
        y,
        scale,
      });
    },
    [currentPage, dropRef, setPageInfo],
  );

  const handleLoadDoc = () => {
    if (onLoadDocInterval.current) {
      clearInterval(onLoadDocInterval.current);
    }

    onLoadDocInterval.current = setInterval(() => {
      const viewerElement = document.querySelector(".rpv-core__viewer");

      if (!viewerElement) return;
      const childrenList = viewerElement.getElementsByTagName("div");

      for (let i = 0; i < childrenList.length; i++) {
        const child = childrenList[i];

        if (child.matches(`.rpv-core__inner-page[aria-label="Page 1"]`)) {
          const dropZone = child.querySelector(".rpv-core__page-layer");
          setDropRef(dropZone as HTMLDivElement | null);

          if (dropZone) {
            drop(dropZone);
            clearInterval(onLoadDocInterval.current as NodeJS.Timeout);
            break;
          }
        }
      }
    }, 350);
  };

  const handleChangePage = (e: PageChangeEvent) => {
    if (pageChangeInterval.current) {
      clearInterval(pageChangeInterval.current);
    }

    pageChangeInterval.current = setInterval(() => {
      const currentPage = e.currentPage;
      setCurrentPage(currentPage);

      const viewerElement = document.querySelector(".rpv-core__viewer");

      if (viewerElement && dropRef) {
        const childrenList = viewerElement.getElementsByTagName("div");

        for (let i = 0; i < childrenList.length; i++) {
          const child = childrenList[i];

          if (
            child.matches(
              `.rpv-core__inner-page[aria-label="Page ${currentPage + 1}"]`,
            )
          ) {
            const dropZone = child.querySelector(".rpv-core__page-layer");
            setDropRef(dropZone as HTMLDivElement | null);

            if (dropZone) {
              drop(dropZone);
              clearInterval(pageChangeInterval.current as NodeJS.Timeout);
              break;
            }
          }
        }
      }
    }, 50);
  };

  useEffect(() => {
    if (dropRef) {
      setFieldsByPage(fields.filter((field) => field.page === currentPage));
    }
  }, [currentPage, dropRef, fields]);

  return {
    fieldsByPage,
    someIsDragging,
    dropRef,
    pageInfo,
    currentPage,
    pageNavigationPluginInstance,
    GoToNextPage,
    GoToPreviousPage,
    handleChangePage,
    handleZoom,
    handleLoadDoc,
  };
};

export default usePDFViewerZone;
