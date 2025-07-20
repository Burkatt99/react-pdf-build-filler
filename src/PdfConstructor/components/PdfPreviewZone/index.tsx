import React from "react";
import { createPortal } from "react-dom";
import {
  ScrollMode,
  SpecialZoomLevel,
  Viewer,
  Worker,
} from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { RenderGoToPageProps } from "@react-pdf-viewer/page-navigation";
import {
  ToolbarProps,
  ToolbarSlot,
  TransformToolbarSlot,
} from "@react-pdf-viewer/toolbar";
import cn from "classnames";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "./styles.scss";

import Button from "@/components/Button";
import { IBuilderField, IResizedField } from "@/constants/types";
import { usePdfConstructor } from "@/context";
import { appReactMemo } from "@/hocs/appReactMemo";
import { ICONS_MAP } from "@/icons";
import { pdfViewerZoneClasses } from "@/PdfConstructor/constants";
import usePDFViewerZone from "@/PdfConstructor/hooks/usePdfPreviewZone";
import { PdfViewerZoneClasses } from "@/PdfConstructor/types";

import CustomLargeField from "../CustomLargeField";

interface IViewerProps {
  fileUrl: string | Uint8Array;
  fields: IBuilderField[];
  maxHeight: number;
  isNewTemplate: boolean;
  classes?: PdfViewerZoneClasses;
  onAddField: (item: IBuilderField) => void;
  onMoveField: (field: IBuilderField, newX: number, newY: number) => void;
  onSelect: (item: IBuilderField | null) => void;
  onResizeField: ({ uuid, width, height, newX, newY }: IResizedField) => void;
}

const PdfPreviewZone = (props: IViewerProps) => {
  const {
    fields,
    fileUrl,
    isNewTemplate,
    classes,
    onSelect,
    onAddField,
    onMoveField,
    onResizeField,
  } = props;
  const { isValid, selectedField: selected } = usePdfConstructor();
  const { renderDefaultToolbar } = defaultLayoutPlugin().toolbarPluginInstance;

  const {
    fieldsByPage,
    dropRef,
    pageInfo,
    currentPage,
    pageNavigationPluginInstance,
    GoToNextPage,
    GoToPreviousPage,
    handleChangePage,
    handleZoom,
    handleLoadDoc,
  } = usePDFViewerZone({ fields, onAddField, onMoveField });

  const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    Open: () => <></>,
    Print: () => <></>,
    SwitchTheme: () => <></>,
    EnterFullScreen: () => <></>,
    GoToNextPage: () => <></>,
    GoToPreviousPage: () => <></>,
    ShowSearchTooltip: () => <></>,
    ShowProperties: () => <></>,
    Download: isNewTemplate ? () => <></> : slot.Download,
  });

  const renderToolbar = (
    Toolbar: (props: ToolbarProps) => React.ReactElement,
  ) => <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>;

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [],
    renderToolbar,
  });

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <div className={pdfViewerZoneClasses.pdfViewerBlock}>
        {!!dropRef &&
          !!fieldsByPage.length &&
          createPortal(
            fieldsByPage.map((field) => (
              <CustomLargeField
                key={field.uuid}
                field={field}
                parentRef={dropRef}
                onSelect={onSelect}
                onResizeField={onResizeField}
                isSelected={selected?.uuid === field?.uuid}
                currentPage={pageInfo}
              />
            )),
            dropRef,
          )}
        <Viewer
          fileUrl={fileUrl}
          plugins={[defaultLayoutPluginInstance, pageNavigationPluginInstance]}
          defaultScale={SpecialZoomLevel.PageFit}
          initialPage={currentPage}
          onPageChange={handleChangePage}
          onDocumentLoad={handleLoadDoc}
          onZoom={handleZoom}
          scrollMode={ScrollMode.Page}
        />
      </div>
      <GoToPreviousPage>
        {({ onClick, isDisabled }: RenderGoToPageProps) => (
          <div className={cn(pdfViewerZoneClasses.prevPage, classes?.prevPage)}>
            <Button
              onClick={onClick}
              variant="icon"
              disabled={isDisabled}
              startIcon={<ICONS_MAP.ArrowLeftIcon />}
              className={cn(
                pdfViewerZoneClasses.pageButton,
                classes?.pageButton,
                {
                  [`${pdfViewerZoneClasses.pageButton}--danger ${classes?.pageButton}--danger`]:
                    !isValid && !isDisabled,
                },
              )}
            />
            {"Prev page"}
          </div>
        )}
      </GoToPreviousPage>

      <GoToNextPage>
        {({ onClick, isDisabled }: RenderGoToPageProps) => (
          <div className={cn(pdfViewerZoneClasses.nextPage, classes?.nextPage)}>
            <Button
              variant="icon"
              onClick={onClick}
              disabled={isDisabled}
              startIcon={<ICONS_MAP.ArrowRightIcon />}
              className={cn(
                pdfViewerZoneClasses.pageButton,
                classes?.pageButton,
                {
                  [`${pdfViewerZoneClasses.pageButton}--danger ${classes?.pageButton}--danger`]:
                    !isValid && !isDisabled,
                },
              )}
            />
            {"Next page"}
          </div>
        )}
      </GoToNextPage>
    </Worker>
  );
};

export default appReactMemo(PdfPreviewZone);
